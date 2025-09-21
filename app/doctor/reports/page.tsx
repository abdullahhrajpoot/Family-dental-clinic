// "use client"
// import { useEffect, useMemo, useState } from "react"
// import { supabase } from "@/lib/supabaseClient"
// import dayjs from "dayjs"

// function downloadCSV(filename: string, rows: string[][]) {
//   const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n")
//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
//   const link = document.createElement("a")
//   link.href = URL.createObjectURL(blob)
//   link.setAttribute("download", filename)
//   document.body.appendChild(link)
//   link.click()
//   link.remove()
// }

// export default function DoctorReports() {
//   const [from,setFrom] = useState(dayjs().subtract(30, "day").format("YYYY-MM-DD"))
//   const [to,setTo] = useState(dayjs().format("YYYY-MM-DD"))
//   const [rows,setRows] = useState<any[]>([])
//   const [loading,setLoading] = useState(false)

//   useEffect(()=>{ load() }, [])

//   async function load(){
//     setLoading(true)
//     const { data } = await supabase.auth.getUser()
//     const user = data?.user
//     if(!user){ setRows([]); setLoading(false); return }
//     const { data: prac } = await supabase.from("practitioners").select("id").eq("user_id", user.id).single()
//     if(!prac){ setRows([]); setLoading(false); return }

//     // invoices for this doctor via invoices.doctor_id
//     const { data: inv } = await supabase
//       .from("invoices")
//       .select("id,date_of_procedure,payment_status,total_cents")
//       .eq("doctor_id", prac.id)
//       .gte("date_of_procedure", from)
//       .lte("date_of_procedure", to)
//       .order("date_of_procedure", { ascending: true })

//     // breakdown (aggregate invoice_items descriptions)
//     const { data: items } = await supabase
//       .from("invoice_items")
//       .select("description,line_total_cents,invoices(date_of_procedure,doctor_id)")
//       .gte("invoices.date_of_procedure", from)
//       .lte("invoices.date_of_procedure", to)
//       .eq("invoices.doctor_id", prac.id)

//     // simple aggregations in JS
//     const agg: Record<string, number> = {};
//     (items || []).forEach((it: any) => {
//       const k = it.description || "Unknown"
//       agg[k] = (agg[k] || 0) + Math.round((it.line_total_cents || 0) / 100)
//     })
//     const breakdown = Object.entries(agg).map(([k,v])=>({procedure:k,total:v})).sort((a,b)=>b.total-a.total)

//     setRows(inv || [])
//     setLoading(false)

//     // store breakdown to state if you want to render
//     ;(window as any).__doctor_breakdown = breakdown
//   }

//   const totalPaid = useMemo(()=> (rows||[]).filter(r=>r.payment_status==='Paid').reduce((s,r)=>s + Math.round((r.total_cents||0)/100),0), [rows])

//   function exportCSV(){
//     const header = [["Date","Invoice ID","Status","Amount (PKR)"]]
//     const body = (rows||[]).map(r=>[r.date_of_procedure, r.id, r.payment_status, (r.total_cents/100).toString()])
//     downloadCSV(`doctor_report_${from}_${to}.csv`, header.concat(body))
//   }

//   return (
//     <div>
//       <h1 className="text-xl font-semibold mb-4">Doctor Reports</h1>

//       <div className="flex gap-2 items-end mb-4">
//         <div><label className="text-sm">From</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="border p-2 rounded" /></div>
//         <div><label className="text-sm">To</label><input type="date" value={to} onChange={e=>setTo(e.target.value)} className="border p-2 rounded" /></div>
//         <button onClick={load} className="border px-3 py-2 rounded">Run</button>
//         <button onClick={exportCSV} className="bg-blue-600 text-white px-3 py-2 rounded">Export CSV</button>
//       </div>

//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <div className="border p-4 rounded">
//           <div className="text-sm text-gray-600">Total (Paid)</div>
//           <div className="text-2xl font-bold">Rs {totalPaid.toLocaleString()}</div>
//         </div>
//         <div className="border p-4 rounded">
//           <div className="text-sm text-gray-600">Total Invoices</div>
//           <div className="text-2xl font-bold">{rows.length}</div>
//         </div>
//       </div>

//       <div>
//         <h2 className="font-semibold mb-2">List</h2>
//         <div className="border rounded">
//           <div className="grid grid-cols-4 p-2 bg-gray-50 font-medium">
//             <div>Date</div><div>Invoice</div><div>Status</div><div>Amount</div>
//           </div>
//           {rows.map(r=>(
//             <div key={r.id} className="grid grid-cols-4 p-2 border-t">
//               <div>{r.date_of_procedure}</div>
//               <div>{r.id}</div>
//               <div>{r.payment_status}</div>
//               <div>Rs {(r.total_cents/100).toLocaleString()}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, FileDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export default function DoctorReports() {
  const [from, setFrom] = useState(dayjs().subtract(30, "day").format("YYYY-MM-DD"))
  const [to, setTo] = useState(dayjs().format("YYYY-MM-DD"))
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.auth.getUser()
    const user = data?.user
    if (!user) { setRows([]); setLoading(false); return }
    const { data: prac } = await supabase.from("practitioners").select("id").eq("user_id", user.id).single()
    if (!prac) { setRows([]); setLoading(false); return }

    const { data: inv } = await supabase
      .from("invoices")
      .select("id,date_of_procedure,payment_status,total_cents")
      .eq("doctor_id", prac.id)
      .gte("date_of_procedure", from)
      .lte("date_of_procedure", to)
      .order("date_of_procedure", { ascending: true })

    setRows(inv || [])
    setLoading(false)
  }

  const totalPaid = useMemo(() =>
    (rows || [])
      .filter(r => r.payment_status === "Paid")
      .reduce((s, r) => s + Math.round((r.total_cents || 0) / 100), 0),
    [rows]
  )

  function exportCSV() {
    const header = [["Date", "Invoice ID", "Status", "Amount (PKR)"]]
    const body = (rows || []).map(r => [
      r.date_of_procedure,
      r.id,
      r.payment_status,
      (r.total_cents / 100).toString()
    ])
    downloadCSV(`doctor_report_${from}_${to}.csv`, header.concat(body))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Doctor Reports</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-sm text-muted-foreground">From</label>
          <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">To</label>
          <Input type="date" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Run
        </Button>
        <Button onClick={exportCSV}>
          <FileDown className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total (Paid)</div>
              <div className="text-2xl font-bold">Rs {totalPaid.toLocaleString()}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Invoices</div>
              <div className="text-2xl font-bold">{rows.length}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-4 p-2 bg-muted font-medium text-sm border-b">
            <div>Date</div><div>Invoice</div><div>Status</div><div>Amount</div>
          </div>
          <AnimatePresence>
            {loading ? (
              <div className="flex items-center justify-center p-6 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
              </div>
            ) : rows.length > 0 ? (
              rows.map(r => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-4 p-3 border-b hover:bg-accent hover:text-accent-foreground"
                >
                  <div>{r.date_of_procedure}</div>
                  <div>{r.id}</div>
                  <div className="capitalize">{r.payment_status}</div>
                  <div>Rs {(r.total_cents / 100).toLocaleString()}</div>
                </motion.div>
              ))
            ) : (
              <div className="p-6 text-sm text-center text-muted-foreground">
                No invoices found for this period.
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
