"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"

export default function DoctorPatientProfile() {
  const params = useParams() as { id: string }
  const id = params.id
  const [p, setP] = useState<any>(null)
  const [appts, setAppts] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data: patient } = await supabase.from("patients").select("*").eq("id", id).single()
      const { data: a } = await supabase
        .from("appointments")
        .select("id,start_ts,end_ts,status,practitioners(name),services(title)")
        .eq("patient_id", id)
        .order("start_ts", { ascending: false })
      const { data: inv } = await supabase
        .from("invoices")
        .select("id,date_of_procedure,payment_status,total_cents")
        .eq("patient_id", id)
        .order("created_at", { ascending: false })
      if (mounted) { setP(patient); setAppts(a || []); setInvoices(inv || []); setLoading(false) }
    })()
    return () => { mounted = false }
  }, [id])

  if (loading) return <p>Loading…</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{p.name}</h1>
        <p className="text-sm text-gray-600">Phone: {p.phone ?? "-"} · CNIC: {p.cnic ?? "-"}</p>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Appointment History</h2>
        <div className="border rounded">
          {appts.map(a=>(
            <div key={a.id} className="p-2 border-t grid grid-cols-4">
              <div>{dayjs(a.start_ts).format("YYYY-MM-DD")}</div>
              <div>{dayjs(a.start_ts).format("HH:mm")}–{dayjs(a.end_ts).format("HH:mm")}</div>
              <div>{a.practitioners?.name ?? "-"}</div>
              <div>{a.services?.title ?? "-"}</div>
            </div>
          ))}
          {appts.length===0 && <div className="p-3 text-sm text-gray-500">No appointments yet.</div>}
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Invoices</h2>
        <div className="border rounded">
          {invoices.map(i=>(
            <div key={i.id} className="p-2 border-t flex justify-between">
              <div>{i.date_of_procedure}</div>
              <div>Rs {(i.total_cents/100).toLocaleString()}</div>
              <a className="text-blue-600 underline" href={`/doctor/invoices/${i.id}`}>View</a>
            </div>
          ))}
          {invoices.length===0 && <div className="p-3 text-sm text-gray-500">No invoices yet.</div>}
        </div>
      </div>
    </div>
  )
}
