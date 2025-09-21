// "use client"
// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabaseClient"
// import dayjs from "dayjs"

// export default function PatientProfile({ params }: { params: { id: string }}) {
//   const id = params.id
//   const [p, setP] = useState<any>(null)
//   const [appts, setAppts] = useState<any[]>([])
//   const [invoices, setInvoices] = useState<any[]>([])

//   useEffect(()=>{ (async ()=>{
//     const { data: patient } = await supabase.from("patients").select("*").eq("id", id).single()
//     setP(patient)
//     const { data: a } = await supabase
//       .from("appointments")
//       .select("id,start_ts,end_ts,status,practitioners(name),services(title)")
//       .eq("patient_id", id).order("start_ts",{ascending:false})
//     setAppts(a || [])
//     const { data: inv } = await supabase
//       .from("invoices")
//       .select("id,date_of_procedure,payment_status,total_cents,practitioners:doctor_id(name)")
//       .eq("patient_id", id).order("created_at",{ascending:false})
//     setInvoices(inv || [])
//   })() }, [id])

//   if(!p) return <p>Loading…</p>

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-xl font-semibold">{p.name}</h1>
//         <p className="text-sm text-gray-600">Phone: {p.phone ?? "-"} · CNIC: {p.cnic ?? "-"}</p>
//       </div>

//       <div>
//         <h2 className="font-semibold mb-2">Appointments</h2>
//         <div className="border rounded">
//           <div className="grid grid-cols-5 p-2 bg-gray-50 font-medium">
//             <div>Date</div><div>Time</div><div>Doctor</div><div>Service</div><div>Status</div>
//           </div>
//           {appts.map(a=>(
//             <div key={a.id} className="grid grid-cols-5 p-2 border-t">
//               <div>{dayjs(a.start_ts).format("YYYY-MM-DD")}</div>
//               <div>{dayjs(a.start_ts).format("HH:mm")}–{dayjs(a.end_ts).format("HH:mm")}</div>
//               <div>{a.practitioners?.name ?? "-"}</div>
//               <div>{a.services?.title ?? "-"}</div>
//               <div>{a.status}</div>
//             </div>
//           ))}
//           {appts.length===0 && <div className="p-3 text-sm text-gray-500">No appointments yet.</div>}
//         </div>
//       </div>

//       <div>
//         <h2 className="font-semibold mb-2">Invoices</h2>
//         <div className="border rounded">
//           <div className="grid grid-cols-5 p-2 bg-gray-50 font-medium">
//             <div>Date</div><div>Doctor</div><div>Status</div><div>Total</div><div>Actions</div>
//           </div>
//           {invoices.map(i=>(
//             <div key={i.id} className="grid grid-cols-5 p-2 border-t">
//               <div>{i.date_of_procedure}</div>
//               <div>{i.practitioners?.name ?? "-"}</div>
//               <div>{i.payment_status}</div>
//               <div>Rs {(i.total_cents/100).toLocaleString()}</div>
//               <a className="text-blue-600 underline" href={`/dashboard/invoices/${i.id}`}>View / Print</a>
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

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
      const { data: patient } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single()
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
      if (mounted) {
        setP(patient)
        setAppts(a || [])
        setInvoices(inv || [])
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [id])

  if (loading)
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>{p.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Phone: {p.phone ?? "-"} · CNIC: {p.cnic ?? "-"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointment History</CardTitle>
        </CardHeader>
        <CardContent>
          {appts.length > 0 ? (
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
                {appts.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      {dayjs(a.start_ts).format("YYYY-MM-DD")}
                    </TableCell>
                    <TableCell>
                      {dayjs(a.start_ts).format("HH:mm")}–
                      {dayjs(a.end_ts).format("HH:mm")}
                    </TableCell>
                    <TableCell>{a.practitioners?.name ?? "-"}</TableCell>
                    <TableCell>{a.services?.title ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-gray-500">No appointments yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell>{i.date_of_procedure}</TableCell>
                    <TableCell>{i.payment_status}</TableCell>
                    <TableCell>
                      Rs {(i.total_cents / 100).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <a
                        className="text-blue-600 underline"
                        href={`/dashboard/invoices/${i.id}`}
                      >
                        View
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-gray-500">No invoices yet.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
