"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type Patient = {
  id: string
  name: string
  phone: string | null
  cnic: string | null
  file_number: string | null
}

export default function PatientsPage() {
  const [q, setQ] = useState("")
  const [rows, setRows] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)

  async function search() {
    setLoading(true)
    let query = supabase.from("patients").select("id,name,phone,cnic,file_number").order("created_at", { ascending: false }).limit(50)
    if (q.trim()) {
      query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,cnic.ilike.%${q}%`)
    }
    const { data } = await query
    setRows((data || []) as any)
    setLoading(false)
  }

  useEffect(() => { search() }, []) // initial

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Patients</h1>
      <div className="flex gap-2">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search name / phone / CNIC" className="border p-2 rounded w-full"/>
        <button onClick={search} className="bg-blue-600 text-white px-4 rounded">Search</button>
        <a href="/dashboard/patients/new" className="px-4 py-2 border rounded">+ Add New</a>
      </div>
      <div className="border rounded">
        <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50 font-medium">
          <div>Name</div><div>Phone</div><div>CNIC</div><div>File #</div>
        </div>
        {loading && <div className="p-4 text-sm">Loading…</div>}
        {rows.map(p=>(
          <a key={p.id} href={`/dashboard/patients/${p.id}`} className="grid grid-cols-4 gap-2 p-2 border-t hover:bg-gray-50">
            <div>{p.name}</div><div>{p.phone ?? "-"}</div><div>{p.cnic ?? "-"}</div><div>{p.file_number ?? "-"}</div>
          </a>
        ))}
        {(!loading && rows.length===0) && <div className="p-4 text-sm text-gray-500">No patients yet.</div>}
      </div>
    </div>
  )
}
