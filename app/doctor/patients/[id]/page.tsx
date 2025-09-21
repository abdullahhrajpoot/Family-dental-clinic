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
import { User, Phone, FileText, Calendar, Clock, Stethoscope, Receipt, ArrowLeft, Users, CreditCard } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DoctorPatientProfile() {
  const params = useParams()
  const id = params.id as string
  const [p, setP] = useState<any>(null)
  const [appts, setAppts] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
      <div className="min-h-screen medical-gradient-light p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto space-y-6"
        >
          {/* Patient Info Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="medical-card p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </motion.div>

          {/* Appointment History Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="medical-card p-6"
          >
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </motion.div>

          {/* Invoices Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="medical-card p-6"
          >
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen medical-gradient-light p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="medical-button border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Patients
          </Button>
        </div>

        {/* Patient Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="medical-card p-6"
        >
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{p.name}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{p.phone ?? "No phone number"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>CNIC: {p.cnic ?? "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Appointment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="medical-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Appointment History</h2>
            <div className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {appts.length} appointments
            </div>
          </div>

          {appts.length > 0 ? (
            <div className="medical-table overflow-hidden">
              <table className="w-full">
                <thead className="medical-table-header">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Doctor</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Service</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {appts.map((a, idx) => (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: idx * 0.05 }}
                      className="medical-table-row hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-4 text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {dayjs(a.start_ts).format("MMM DD, YYYY")}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {dayjs(a.start_ts).format("HH:mm")}–{dayjs(a.end_ts).format("HH:mm")}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-gray-400" />
                          {a.practitioners?.name ?? "—"}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">{a.services?.title ?? "—"}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          a.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : a.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
              <p className="text-gray-600">This patient hasn't had any appointments scheduled.</p>
            </div>
          )}
        </motion.div>

        {/* Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="medical-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Receipt className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Invoice History</h2>
            <div className="ml-auto bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {invoices.length} invoices
            </div>
          </div>

          {invoices.length > 0 ? (
            <div className="medical-table overflow-hidden">
              <table className="w-full">
                <thead className="medical-table-header">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Amount</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {invoices.map((i, idx) => (
                    <motion.tr
                      key={i.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: idx * 0.05 }}
                      className="medical-table-row hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-4 text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {i.date_of_procedure}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          i.payment_status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {i.payment_status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-900">
                        <div className="flex items-center justify-end gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Rs {(i.total_cents / 100).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <Button asChild variant="outline" size="sm" className="medical-button border-blue-200 text-blue-700 hover:bg-blue-50">
                          <Link href={`/doctor/invoices/${i.id}`} className="flex items-center gap-2">
                            <Receipt className="w-4 h-4" />
                            View
                          </Link>
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Receipt className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
              <p className="text-gray-600">This patient hasn't been billed for any services.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
