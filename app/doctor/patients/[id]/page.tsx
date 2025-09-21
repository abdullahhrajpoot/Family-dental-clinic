// "use client"
// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import { supabase } from "@/lib/supabaseClient"
// import dayjs from "dayjs"

// export default function DoctorPatientProfile() {
//   const params = useParams() as { id: string }
//   const id = params.id
//   const [p, setP] = useState<any>(null)
//   const [appts, setAppts] = useState<any[]>([])
//   const [invoices, setInvoices] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     let mounted = true
//     ;(async () => {
//       const { data: patient } = await supabase.from("patients").select("*").eq("id", id).single()
//       const { data: a } = await supabase
//         .from("appointments")
//         .select("id,start_ts,end_ts,status,practitioners(name),services(title)")
//         .eq("patient_id", id)
//         .order("start_ts", { ascending: false })
//       const { data: inv } = await supabase
//         .from("invoices")
//         .select("id,date_of_procedure,payment_status,total_cents")
//         .eq("patient_id", id)
//         .order("created_at", { ascending: false })
//       if (mounted) { setP(patient); setAppts(a || []); setInvoices(inv || []); setLoading(false) }
//     })()
//     return () => { mounted = false }
//   }, [id])

//   if (loading) return <p>Loading…</p>

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-xl font-semibold">{p.name}</h1>
//         <p className="text-sm text-gray-600">Phone: {p.phone ?? "-"} · CNIC: {p.cnic ?? "-"}</p>
//       </div>

//       <div>
//         <h2 className="font-semibold mb-2">Appointment History</h2>
//         <div className="border rounded">
//           {appts.map(a=>(
//             <div key={a.id} className="p-2 border-t grid grid-cols-4">
//               <div>{dayjs(a.start_ts).format("YYYY-MM-DD")}</div>
//               <div>{dayjs(a.start_ts).format("HH:mm")}–{dayjs(a.end_ts).format("HH:mm")}</div>
//               <div>{a.practitioners?.name ?? "-"}</div>
//               <div>{a.services?.title ?? "-"}</div>
//             </div>
//           ))}
//           {appts.length===0 && <div className="p-3 text-sm text-gray-500">No appointments yet.</div>}
//         </div>
//       </div>

//       <div>
//         <h2 className="font-semibold mb-2">Invoices</h2>
//         <div className="border rounded">
//           {invoices.map(i=>(
//             <div key={i.id} className="p-2 border-t flex justify-between">
//               <div>{i.date_of_procedure}</div>
//               <div>Rs {(i.total_cents/100).toLocaleString()}</div>
//               <a className="text-blue-600 underline" href={`/doctor/invoices/${i.id}`}>View</a>
//             </div>
//           ))}
//           {invoices.length===0 && <div className="p-3 text-sm text-gray-500">No invoices yet.</div>}
//         </div>
//       </div>
//     </div>
//   )
// }





"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"
import { motion } from "framer-motion"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

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

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Patient Info */}
      <Card>
        <CardHeader>
          <CardTitle>{p.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Phone: {p.phone ?? "-"} · CNIC: {p.cnic ?? "-"}
          </p>
        </CardHeader>
      </Card>

      {/* Appointment History */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Service</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appts.map(a => (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b"
                >
                  <TableCell>{dayjs(a.start_ts).format("YYYY-MM-DD")}</TableCell>
                  <TableCell>
                    {dayjs(a.start_ts).format("HH:mm")}–{dayjs(a.end_ts).format("HH:mm")}
                  </TableCell>
                  <TableCell>{a.practitioners?.name ?? "-"}</TableCell>
                  <TableCell>{a.services?.title ?? "-"}</TableCell>
                </motion.tr>
              ))}
              {appts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                    No appointments yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map(i => (
                <motion.tr
                  key={i.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b"
                >
                  <TableCell>{i.date_of_procedure}</TableCell>
                  <TableCell className="capitalize">{i.payment_status}</TableCell>
                  <TableCell className="text-right">Rs {(i.total_cents / 100).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="link" className="p-0 h-auto font-normal">
                      <a href={`/doctor/invoices/${i.id}`}>View</a>
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                    No invoices yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
