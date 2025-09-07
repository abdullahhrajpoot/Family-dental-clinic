"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function NewPatient() {
  const r = useRouter()
  const [form, setForm] = useState({ name:"", phone:"", cnic:"", dob:"", gender:"", notes:"" })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErr(null)
    const { data, error } = await supabase.from("patients").insert({
      name: form.name, phone: form.phone || null, cnic: form.cnic || null,
      dob: form.dob ? form.dob : null, gender: form.gender || null, notes: form.notes || null
    }).select("id").single()
    setLoading(false)
    if (error) { setErr(error.message); return }
    r.push(`/dashboard/patients/${data!.id}`)
  }

  function upd(k: string, v: string){ setForm(prev=>({ ...prev, [k]: v })) }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-4">Add New Patient</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="border p-2 rounded w-full" placeholder="Full Name *" value={form.name} onChange={e=>upd("name", e.target.value)} required/>
        <div className="grid grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="Phone" value={form.phone} onChange={e=>upd("phone", e.target.value)}/>
          <input className="border p-2 rounded" placeholder="CNIC" value={form.cnic} onChange={e=>upd("cnic", e.target.value)}/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="date" className="border p-2 rounded" value={form.dob} onChange={e=>upd("dob", e.target.value)}/>
          <select className="border p-2 rounded" value={form.gender} onChange={e=>upd("gender", e.target.value)}>
            <option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
        <textarea className="border p-2 rounded w-full" placeholder="Notes" value={form.notes} onChange={e=>upd("notes", e.target.value)} />
        <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? "Saving…" : "Save Patient"}</button>
        {err && <p className="text-red-600 text-sm">{err}</p>}
      </form>
    </div>
  )
}
