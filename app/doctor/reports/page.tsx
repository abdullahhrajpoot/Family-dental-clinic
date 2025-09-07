"use client"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"

function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export default function DoctorReports() {
  const [from,setFrom] = useState(dayjs().subtract(30, "day").format("YYYY-MM-DD"))
  const [to,setTo] = useState(dayjs().format("YYYY-MM-DD"))
  const [rows,setRows] = useState<any[]>([])
  const [loading,setLoading] = useState(false)

  useEffect(()=>{ load() }, [])

  async function load(){
    setLoading(true)
    const { data } = await supabase.auth.getUser()
    const user = data?.user
    if(!user){ setRows([]); setLoading(false); return }
    const { data: prac } = await supabase.from("practitioners").select("id").eq("user_id", user.id).single()
    if(!prac){ setRows([]); setLoading(false); return }

    // invoices for this doctor via invoices.doctor_id
    const { data: inv } = await supabase
      .from("invoices")
      .select("id,date_of_procedure,payment_status,total_cents")
      .eq("doctor_id", prac.id)
      .gte("date_of_procedure", from)
      .lte("date_of_procedure", to)
      .order("date_of_procedure", { ascending: true })

    // breakdown (aggregate invoice_items descriptions)
    const { data: items } = await supabase
      .from("invoice_items")
      .select("description,line_total_cents,invoices(date_of_procedure,doctor_id)")
      .gte("invoices.date_of_procedure", from)
      .lte("invoices.date_of_procedure", to)
      .eq("invoices.doctor_id", prac.id)

    // simple aggregations in JS
    const agg: Record<string, number> = {};
    (items || []).forEach((it: any) => {
      const k = it.description || "Unknown"
      agg[k] = (agg[k] || 0) + Math.round((it.line_total_cents || 0) / 100)
    })
    const breakdown = Object.entries(agg).map(([k,v])=>({procedure:k,total:v})).sort((a,b)=>b.total-a.total)

    setRows(inv || [])
    setLoading(false)

    // store breakdown to state if you want to render
    ;(window as any).__doctor_breakdown = breakdown
  }

  const totalPaid = useMemo(()=> (rows||[]).filter(r=>r.payment_status==='Paid').reduce((s,r)=>s + Math.round((r.total_cents||0)/100),0), [rows])

  function exportCSV(){
    const header = [["Date","Invoice ID","Status","Amount (PKR)"]]
    const body = (rows||[]).map(r=>[r.date_of_procedure, r.id, r.payment_status, (r.total_cents/100).toString()])
    downloadCSV(`doctor_report_${from}_${to}.csv`, header.concat(body))
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Doctor Reports</h1>

      <div className="flex gap-2 items-end mb-4">
        <div><label className="text-sm">From</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="border p-2 rounded" /></div>
        <div><label className="text-sm">To</label><input type="date" value={to} onChange={e=>setTo(e.target.value)} className="border p-2 rounded" /></div>
        <button onClick={load} className="border px-3 py-2 rounded">Run</button>
        <button onClick={exportCSV} className="bg-blue-600 text-white px-3 py-2 rounded">Export CSV</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border p-4 rounded">
          <div className="text-sm text-gray-600">Total (Paid)</div>
          <div className="text-2xl font-bold">Rs {totalPaid.toLocaleString()}</div>
        </div>
        <div className="border p-4 rounded">
          <div className="text-sm text-gray-600">Total Invoices</div>
          <div className="text-2xl font-bold">{rows.length}</div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">List</h2>
        <div className="border rounded">
          <div className="grid grid-cols-4 p-2 bg-gray-50 font-medium">
            <div>Date</div><div>Invoice</div><div>Status</div><div>Amount</div>
          </div>
          {rows.map(r=>(
            <div key={r.id} className="grid grid-cols-4 p-2 border-t">
              <div>{r.date_of_procedure}</div>
              <div>{r.id}</div>
              <div>{r.payment_status}</div>
              <div>Rs {(r.total_cents/100).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
