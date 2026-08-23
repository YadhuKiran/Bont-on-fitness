import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { supabaseAdmin } from "./supabaseAdmin";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const AUTO_CLOSE_HOURS = Number(process.env.AUTO_CLOSE_HOURS || "2");

app.post("/webhook/attendance", async (req, res) => {
  try {
    const { member_id, branch_id, timestamp, event } = req.body;
    if (!member_id || !branch_id || !timestamp || !event) return res.status(400).json({ error: "Missing fields" });
    const ts = new Date(timestamp);

    if (event === "check_in") {
      const { data, error } = await supabaseAdmin.from("attendance").insert({ member_id, branch_id, check_in: ts }).select().single();
      if (error) throw error;
      await supabaseAdmin.from("profiles").update({ currently_in_gym: true, last_checkin: ts }).eq("id", member_id);
      // create notification
      await supabaseAdmin.from("notifications").insert({ member_id, title: "Checked in", body: `Checked in at ${ts.toLocaleString()}`, metadata: { branch_id } });
      return res.json({ ok: true, attendance: data });
    }

    if (event === "check_out") {
      // find last open attendance for member
      const { data: open } = await supabaseAdmin
        .from("attendance")
        .select("id, check_in")
        .eq("member_id", member_id)
        .is("check_out", null)
        .order("check_in", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!open) return res.status(404).json({ error: "No open session found" });
      const checkOutTs = ts;
      const durationMin = Math.max(1, Math.round((checkOutTs.getTime() - new Date(open.check_in).getTime()) / 60000));
      const { error } = await supabaseAdmin.from("attendance").update({ check_out: checkOutTs, duration_minutes: durationMin }).eq("id", open.id);
      if (error) throw error;
      await supabaseAdmin.from("profiles").update({ currently_in_gym: false, last_checkout: checkOutTs }).eq("id", member_id);
      await supabaseAdmin.from("notifications").insert({ member_id, title: "Checked out", body: `Checked out — great session! ${durationMin} minutes`, metadata: { branch_id, durationMin } });
      return res.json({ ok: true, duration_minutes: durationMin });
    }

    return res.status(400).json({ error: "Unknown event" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
});

// Simple cron endpoint to auto-close old sessions
app.post("/cron/auto-close", async (req, res) => {
  try {
    const threshold = new Date(Date.now() - AUTO_CLOSE_HOURS * 60 * 60 * 1000);
    const { data, error } = await supabaseAdmin
      .from("attendance")
      .select("id, member_id, branch_id, check_in")
      .is("check_out", null)
      .lt("check_in", threshold);
    if (error) throw error;
    let updated = 0;
    for (const row of data as any[]) {
      const autoCloseTs = new Date(new Date(row.check_in).getTime() + AUTO_CLOSE_HOURS * 60 * 60 * 1000);
      const durationMin = Math.max(1, Math.round((autoCloseTs.getTime() - new Date(row.check_in).getTime()) / 60000));
      const { error: uerr } = await supabaseAdmin.from("attendance").update({ check_out: autoCloseTs, duration_minutes: durationMin, auto_closed: true }).eq("id", row.id);
      if (uerr) console.error("auto-close update error", uerr);
      else {
        updated++;
        await supabaseAdmin.from("notifications").insert({ member_id: row.member_id, title: "Session auto-closed", body: `We auto-closed your session of ${durationMin} minutes.`, metadata: { branch_id: row.branch_id } });
      }
    }
    return res.json({ ok: true, auto_closed: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => console.log(`Webhook server listening on ${PORT}`));
