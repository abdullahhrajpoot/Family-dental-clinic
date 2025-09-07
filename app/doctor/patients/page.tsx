"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

type Patient = {
  id: string
  name: string
  phone: string | null
  cnic: string | null
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      let query = supabase.from("patients").select("id,name,phone,cnic").order("name", { ascending: true })
      if (q.trim()) {
        query = query.or(
          `name.ilike.%${q}%,cnic.ilike.%${q}%,phone.ilike.%${q}%`
        )
      }
      const { data, error } = await query
      if (!error && data) setPatients(data as Patient[])
      setLoading(false)
    }
    load()
  }, [q])

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Patients</h1>

      <div className="flex gap-2">
        <input
          className="border p-2 rounded w-full"
          placeholder="Search by name, CNIC, or phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="border rounded">
          <div className="grid grid-cols-3 p-2 bg-gray-50 font-medium">
            <div>Name</div>
            <div>Phone</div>
            <div>CNIC</div>
          </div>
          {patients.map((p) => (
            <Link
              key={p.id}
              href={`/doctor/patients/${p.id}`}
              className="grid grid-cols-3 p-2 border-t hover:bg-gray-50"
            >
              <div>{p.name}</div>
              <div>{p.phone ?? "—"}</div>
              <div>{p.cnic ?? "—"}</div>
            </Link>
          ))}
          {patients.length === 0 && (
            <div className="p-4 text-sm text-gray-500">No patients found.</div>
          )}
        </div>
      )}
    </div>
  )
}
