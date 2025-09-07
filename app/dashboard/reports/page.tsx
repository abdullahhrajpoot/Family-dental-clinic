"use client"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ReportsPage(){
  const [from,setFrom]=useState(new Date(new Date().setDate(new Date().getDate()-30)).toISOString().slice(0,10))
  const [to,setTo]=useState(new Date().toISOString().slice(0,10))
  const [rows,setRows]=useState<any[]>([])
  const [byProc,setByProc]=useState<any[]>([])
  const [loading,setLoading]=useState(false)

  async function load(){
    setLoading(true)
    // invoices header
    const { data: inv } = await supabase
      .from("invoices")
      .select("id,total_cents,payment_status,created_at")
      .gte("created_at", `${from}T00:00:00+05:00`).lte("created_at", `${to}T23:59:59+05:00`)
    setRows(inv||[])
    // breakdown by service (sum of line items)
    const { data: items } = await supabase
      .from("invoice_items")
      .select("description,line_total_cents,invoice_id,invoices!inner(created_at)")
      .gte("invoices.created_at", `${from}T00:00:00+05:00`).lte("invoices.created_at", `${to}T23:59:59+05:00`)
    const map: Record<string, number> = {}
    ;(items||[]).forEach(it=>{
      map[it.description] = (map[it.description]||0) + Math.round((it.line_total_cents||0)/100)
    })
    const arr = Object.entries(map).map(([k,v])=>({procedure:k,total:v})).sort((a,b)=>b.total-a.total)
    setByProc(arr)
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  const totalPaid = useMemo(()=> (rows||[]).filter(r=>r.payment_status==='Paid').reduce((s,r)=>s + Math.round((r.total_cents||0)/100),0), [rows])
  const totalAll = useMemo(()=> (rows||[]).reduce((s,r)=>s + Math.round((r.total_cents||0)/100),0), [rows])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Revenue Report</h1>
      <div className="flex gap-2 items-end">
        <div><label className="text-sm">From</label><input type="date" className="border p-2 rounded" value={from} onChange={e=>setFrom(e.target.value)}/></div>
        <div><label className="text-sm">To</label><input type="date" className="border p-2 rounded" value={to} onChange={e=>setTo(e.target.value)}/></div>
        <button onClick={load} className="border px-4 py-2 rounded">Run</button>
      </div>

      {loading ? <p>Loading…</p> : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded p-4">
              <div className="text-sm text-gray-600">Total (Paid)</div>
              <div className="text-2xl font-bold">Rs {totalPaid.toLocaleString()}</div>
            </div>
            <div className="border rounded p-4">
              <div className="text-sm text-gray-600">Total (All statuses)</div>
              <div className="text-2xl font-bold">Rs {totalAll.toLocaleString()}</div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mt-4 mb-2">Breakdown by Procedure</h2>
            <div className="border rounded">
              <div className="grid grid-cols-2 p-2 bg-gray-50 font-medium">
                <div>Procedure</div><div className="text-right">Total (Rs)</div>
              </div>
              {byProc.map((r,i)=>(
                <div key={i} className="grid grid-cols-2 p-2 border-t">
                  <div>{r.procedure}</div><div className="text-right">{r.total.toLocaleString()}</div>
                </div>
              ))}
              {byProc.length===0 && <div className="p-3 text-sm text-gray-500">No data for this range.</div>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
