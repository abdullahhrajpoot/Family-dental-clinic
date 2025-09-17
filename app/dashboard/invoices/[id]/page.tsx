"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function InvoiceView({ params }:{ params:{ id:string }}) {
  const [inv,setInv]=useState<any>(null)
  const [items,setItems]=useState<any[]>([])

  useEffect(()=>{(async()=>{
    const { data: i } = await supabase
      .from("invoices")
      .select("id, date_of_procedure, payment_status, payment_mode, follow_up_date, total_cents, patients(name,phone,cnic), practitioners:doctor_id(name)")
      .eq("id", params.id).single()
    setInv(i)
    const { data: it } = await supabase.from("invoice_items").select("description,qty,price_cents,line_total_cents").eq("invoice_id", params.id)
    setItems(it||[])
  })()},[params.id ])

  async function markPaid(){
    await supabase.from("invoices").update({ payment_status: 'Paid' }).eq("id", params.id)
    setInv((p:any)=> ({...p, payment_status:'Paid'}))
  }

  if(!inv) return <p>Loading…</p>

  return (
    <div className="max-w-3xl mx-auto bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Clinic Invoice</h1>
          <p className="text-sm text-gray-600">Lahore · +92-000-0000000</p>
        </div>
        <button onClick={()=>window.print()} className="border px-3 py-2 rounded">🖨 Print</button>
      </div>

      <div className="grid grid-cols-2 gap-4 border-b pb-3 mb-3">
        <div>
          <h2 className="font-semibold">Patient</h2>
          <p>{inv.patients?.name}</p>
          <p className="text-sm text-gray-600">Phone: {inv.patients?.phone ?? "—"} · CNIC: {inv.patients?.cnic ?? "—"}</p>
        </div>
        <div>
          <h2 className="font-semibold">Details</h2>
          <p>Date: {inv.date_of_procedure}</p>
          <p>Doctor: {inv.practitioners?.name ?? "—"}</p>
          <p>Status: <span className={inv.payment_status==='Paid' ? 'text-green-600' : 'text-red-600'}>{inv.payment_status}</span></p>
          <p>Mode: {inv.payment_mode ?? "—"}</p>
          {inv.follow_up_date && <p>Follow-up: {inv.follow_up_date}</p>}
        </div>
      </div>

      <table className="w-full border mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2 border">Description</th>
            <th className="text-right p-2 border">Qty</th>
            <th className="text-right p-2 border">Price (Rs)</th>
            <th className="text-right p-2 border">Line Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it,idx)=>(
            <tr key={idx}>
              <td className="p-2 border">{it.description}</td>
              <td className="p-2 border text-right">{it.qty}</td>
              <td className="p-2 border text-right">{Math.round(it.price_cents/100).toLocaleString()}</td>
              <td className="p-2 border text-right">{Math.round(it.line_total_cents/100).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Total: Rs {(inv.total_cents/100).toLocaleString()}</div>
        {inv.payment_status!=='Paid' && (
          <button onClick={markPaid} className="bg-green-600 text-white px-4 py-2 rounded">Mark as Paid</button>
        )}
      </div>
    </div>
  )
}
