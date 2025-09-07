"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"

export default function PatientProfile({ params }: { params: { id: string }}) {
  const id = params.id
  const [p, setP] = useState<any>(null)
  const [appts, setAppts] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(()=>{ (async ()=>{
    const { data: patient } = await supabase.from("patients").select("*").eq("id", id).single()
    setP(patient)
    const { data: a } = await supabase
      .from("appointments")
      .select("id,start_ts,end_ts,status,practitioners(name),services(title)")
      .eq("patient_id", id).order("start_ts",{ascending:false})
    setAppts(a || [])
    const { data: inv } = await supabase
      .from("invoices")
      .select("id,date_of_procedure,payment_status,total_cents,practitioners:doctor_id(name)")
      .eq("patient_id", id).order("created_at",{ascending:false})
    setInvoices(inv || [])
  })() }, [id])

  if(!p) return <p>Loading…</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{p.name}</h1>
        <p className="text-sm text-gray-600">Phone: {p.phone ?? "-"} · CNIC: {p.cnic ?? "-"}</p>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Appointments</h2>
        <div className="border rounded">
          <div className="grid grid-cols-5 p-2 bg-gray-50 font-medium">
            <div>Date</div><div>Time</div><div>Doctor</div><div>Service</div><div>Status</div>
          </div>
          {appts.map(a=>(
            <div key={a.id} className="grid grid-cols-5 p-2 border-t">
              <div>{dayjs(a.start_ts).format("YYYY-MM-DD")}</div>
              <div>{dayjs(a.start_ts).format("HH:mm")}–{dayjs(a.end_ts).format("HH:mm")}</div>
              <div>{a.practitioners?.name ?? "-"}</div>
              <div>{a.services?.title ?? "-"}</div>
              <div>{a.status}</div>
            </div>
          ))}
          {appts.length===0 && <div className="p-3 text-sm text-gray-500">No appointments yet.</div>}
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Invoices</h2>
        <div className="border rounded">
          <div className="grid grid-cols-5 p-2 bg-gray-50 font-medium">
            <div>Date</div><div>Doctor</div><div>Status</div><div>Total</div><div>Actions</div>
          </div>
          {invoices.map(i=>(
            <div key={i.id} className="grid grid-cols-5 p-2 border-t">
              <div>{i.date_of_procedure}</div>
              <div>{i.practitioners?.name ?? "-"}</div>
              <div>{i.payment_status}</div>
              <div>Rs {(i.total_cents/100).toLocaleString()}</div>
              <a className="text-blue-600 underline" href={`/dashboard/invoices/${i.id}`}>View / Print</a>
            </div>
          ))}
          {invoices.length===0 && <div className="p-3 text-sm text-gray-500">No invoices yet.</div>}
        </div>
      </div>
    </div>
  )
}
