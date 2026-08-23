import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EventType = "check_in" | "check_out";

type BiometricEvent = {
  member_id?: string;
  biometric_identifier?: string;
  branch_id: string;
  timestamp?: string;
  event_type: EventType;
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, "Content-Type": "application/json" },
});

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Only POST is supported." }, 405);

  try {
    const payload = await request.json() as BiometricEvent;
    if (!payload.branch_id || !payload.event_type || (!payload.member_id && !payload.biometric_identifier)) {
      return json({ error: "branch_id, event_type, and a member identifier are required." }, 400);
    }
    if (!["check_in", "check_out"].includes(payload.event_type)) {
      return json({ error: "event_type must be check_in or check_out." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const profileQuery = supabase.from("profiles").select("id, full_name, branch_id").eq("branch_id", payload.branch_id).limit(1);
    const { data: profile, error: profileError } = payload.member_id
      ? await profileQuery.eq("id", payload.member_id).maybeSingle()
      : await profileQuery.eq("biometric_identifier", payload.biometric_identifier).maybeSingle();
    if (profileError) return json({ error: profileError.message }, 500);
    if (!profile) return json({ error: "Member not found for this branch." }, 404);

    const eventTime = payload.timestamp ? new Date(payload.timestamp) : new Date();
    if (Number.isNaN(eventTime.getTime())) return json({ error: "timestamp must be a valid ISO date." }, 400);

    if (payload.event_type === "check_in") {
      const { data: openSession } = await supabase.from("attendance").select("id").eq("member_id", profile.id).is("check_out_at", null).maybeSingle();
      if (!openSession) {
        const { error } = await supabase.from("attendance").insert({ member_id: profile.id, branch_id: payload.branch_id, check_in_at: eventTime.toISOString(), source: "biometric" });
        if (error) return json({ error: error.message }, 500);
      }
      await supabase.from("profiles").update({ currently_in_gym: true }).eq("id", profile.id);
      await supabase.from("notifications").insert({ member_id: profile.id, title: "Checked in", message: `Checked in at ${eventTime.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}. Have a strong session!` });
      return json({ ok: true, event: "check_in", member_id: profile.id, member_name: profile.full_name });
    }

    const { data: openSession, error: openError } = await supabase.from("attendance").select("id, check_in_at").eq("member_id", profile.id).eq("branch_id", payload.branch_id).is("check_out_at", null).order("check_in_at", { ascending: false }).limit(1).maybeSingle();
    if (openError) return json({ error: openError.message }, 500);
    if (!openSession) return json({ ok: true, event: "check_out", message: "No open attendance session found." });

    const durationMinutes = Math.max(0, Math.round((eventTime.getTime() - new Date(openSession.check_in_at).getTime()) / 60000));
    const { error: updateError } = await supabase.from("attendance").update({ check_out_at: eventTime.toISOString(), duration_minutes: durationMinutes }).eq("id", openSession.id);
    if (updateError) return json({ error: updateError.message }, 500);
    await supabase.from("profiles").update({ currently_in_gym: false }).eq("id", profile.id);
    await supabase.from("notifications").insert({ member_id: profile.id, title: "Checked out", message: `Checked out — great session! ${durationMinutes} minutes.` });
    return json({ ok: true, event: "check_out", member_id: profile.id, duration_minutes: durationMinutes });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Invalid request." }, 400);
  }
});
