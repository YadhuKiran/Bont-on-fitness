import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase, { getUser } from "../lib/supabase";

type Branch = { id: string; name: string };

export default function Onboarding(): JSX.Element {
  const [fullName, setFullName] = useState("");
  const [branchId, setBranchId] = useState<string | null>(null);
  const [goal, setGoal] = useState("General Fitness");
  const [heightCm, setHeightCm] = useState<number | "">("");
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load branch list for selector
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("branches").select("id,name").order("name");
      if (error) setError(error.message);
      else setBranches((data as Branch[]) || []);
    })();
  }, []);

  // Upload photo to Supabase storage and return public URL
  async function uploadPhoto(userId: string) {
    if (!photoFile) return null;
    const bucket = "profile-photos";
    const path = `${userId}/${Date.now()}_${photoFile.name}`;
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, photoFile, { upsert: true });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const session = await getUser();
      const user = (session as any)?.data?.session?.user;
      if (!user) throw new Error("Not authenticated");
      const userId = user.id as string;

      let avatar_url = null;
      if (photoFile) {
        avatar_url = await uploadPhoto(userId);
      }

      const payload: any = {
        id: userId,
        full_name: fullName,
        branch_id: branchId,
        goal,
        height_cm: heightCm === "" ? null : Number(heightCm),
        current_weight: weightKg === "" ? null : Number(weightKg),
      };
      if (avatar_url) payload.avatar_url = avatar_url;

      const { error: upsertErr } = await supabase.from("profiles").upsert(payload);
      if (upsertErr) throw upsertErr;

      // Redirect to dashboard
      navigate("/");
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Complete your profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <div className="text-sm">Full name</div>
          <input className="w-full p-2 border rounded" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>

        <label className="block">
          <div className="text-sm">Primary branch</div>
          <select className="w-full p-2 border rounded" value={branchId ?? ""} onChange={(e) => setBranchId(e.target.value)} required>
            <option value="">Select a branch</option>
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>

        <label className="block">
          <div className="text-sm">Fitness goal</div>
          <select className="w-full p-2 border rounded" value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option>Muscle Gain</option>
            <option>Fat Loss</option>
            <option>Strength</option>
            <option>Endurance</option>
            <option>General Fitness</option>
            <option>Weight Maintenance</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="text-sm">Height (cm)</div>
            <input className="w-full p-2 border rounded" type="number" value={heightCm as any} onChange={(e) => setHeightCm(e.target.value === "" ? "" : Number(e.target.value))} />
          </label>
          <label className="block">
            <div className="text-sm">Current weight (kg)</div>
            <input className="w-full p-2 border rounded" type="number" value={weightKg as any} onChange={(e) => setWeightKg(e.target.value === "" ? "" : Number(e.target.value))} />
          </label>
        </div>

        <label className="block">
          <div className="text-sm">Profile photo</div>
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files ? e.target.files[0] : null)} />
        </label>

        {error && <div className="text-red-600">{error}</div>}

        <div>
          <button className="px-4 py-2 bg-lime-500 text-white rounded" type="submit" disabled={loading}>{loading ? "Saving…" : "Save profile"}</button>
        </div>
      </form>
    </div>
  );
}
