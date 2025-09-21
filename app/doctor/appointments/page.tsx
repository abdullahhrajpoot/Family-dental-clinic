// "use client"
// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabaseClient"
// import dayjs from "dayjs"

// export default function DoctorAppointments() {
//   const [rows, setRows] = useState<any[]>([])
//   const [filter, setFilter] = useState("upcoming") // upcoming | past | all
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     let mounted = true
//     ;(async () => {
//       const { data } = await supabase.auth.getUser()
//       const user = data?.user
//       if (!user) return

//       const { data: prac } = await supabase.from("practitioners").select("id").eq("user_id", user.id).single()
//       if (!prac) { setRows([]); setLoading(false); return }

//       const now = dayjs().toISOString()
//       let query = supabase
//         .from("appointments")
//         .select("id,start_ts,end_ts,status,patients(id,name,phone),services(title)")
//         .eq("practitioner_id", prac.id)
//         .order("start_ts", { ascending: true })

//       if (filter === "upcoming") query = query.gte("start_ts", now)
//       if (filter === "past") query = query.lt("start_ts", now)
// console.log("hello");
//       const { data: appts, error } = await query
//       if (error) console.error(error)
//       if (mounted) { setRows(appts || []); setLoading(false) }
//     })()
//     return () => { mounted = false }
//   }, [filter])

//   if (loading) return <p>Loading…</p>

//   return (
//     <div>
//       <h1 className="text-xl font-semibold mb-4">Appointments</h1>
//       <div className="flex gap-2 mb-4">
//         <button onClick={()=>setFilter("upcoming")} className="px-3 py-1 border rounded">Upcoming</button>
//         <button onClick={()=>setFilter("past")} className="px-3 py-1 border rounded">Past</button>
//         <button onClick={()=>setFilter("all")} className="px-3 py-1 border rounded">All</button>
//       </div>

//       <div className="border rounded">
//         <div className="grid grid-cols-5 p-2 bg-gray-50 font-medium">
//           <div>Date</div><div>Time</div><div>Patient</div><div>Service</div><div>Status</div>
//         </div>
//         {rows.map(r=>(
//           <div key={r.id} className="grid grid-cols-5 p-2 border-t">
//             <div>{dayjs(r.start_ts).format("YYYY-MM-DD")}</div>
//             <div>{dayjs(r.start_ts).format("HH:mm")}</div>
//             <div>{r.patients?.name}</div>
//             <div>{r.services?.title}</div>
//             <div className="capitalize">{r.status}</div>
//           </div>
//         ))}
//         {rows.length===0 && <div className="p-4 text-sm text-gray-500">No appointments.</div>}
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"
import { motion } from "framer-motion"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Calendar, User, Stethoscope } from "lucide-react"

export default function DoctorAppointments() {
  const [rows, setRows] = useState<any[]>([])
  const [filter, setFilter] = useState("upcoming") // upcoming | past | all
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      if (!user) return

      const { data: prac } = await supabase
        .from("practitioners")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!prac) { setRows([]); setLoading(false); return }

      const now = dayjs().toISOString()
      let query = supabase
        .from("appointments")
        .select("id,start_ts,end_ts,status,patients(id,name,phone),services(title)")
        .eq("practitioner_id", prac.id)
        .order("start_ts", { ascending: true })

      if (filter === "upcoming") query = query.gte("start_ts", now)
      if (filter === "past") query = query.lt("start_ts", now)

      const { data: appts, error } = await query
      if (error) console.error(error)
      if (mounted) { setRows(appts || []); setLoading(false) }
    })()
    return () => { mounted = false }
  }, [filter])

  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-full mb-2" />
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-1">View and manage your scheduled appointments</p>
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="medical-card p-4"
      >
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "upcoming" ? "default" : "outline"}
            onClick={() => setFilter("upcoming")}
            className={filter === "upcoming" ? "medical-button" : "border-blue-200 text-blue-600 hover:bg-blue-50"}
          >
            <Clock className="w-4 h-4 mr-2" />
            Upcoming
          </Button>
          <Button
            variant={filter === "past" ? "default" : "outline"}
            onClick={() => setFilter("past")}
            className={filter === "past" ? "medical-button" : "border-blue-200 text-blue-600 hover:bg-blue-50"}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Past
          </Button>
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "medical-button" : "border-blue-200 text-blue-600 hover:bg-blue-50"}
          >
            <Stethoscope className="w-4 h-4 mr-2" />
            All
          </Button>
        </div>
      </motion.div>

      {/* Appointments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="medical-card overflow-hidden"
      >
        <div className="medical-table-header p-4">
          <h2 className="text-lg font-semibold text-gray-800">Appointment Schedule</h2>
          <p className="text-sm text-gray-600">Total: {rows.length} appointments</p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <div className="text-gray-500">Loading appointments...</div>
          </div>
        ) : rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="medical-table-header">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Time</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Patient</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Service</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {rows.map((r, index) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.05 }}
                    className="medical-table-row hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">
                          {dayjs(r.start_ts).format("YYYY-MM-DD")}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-600">
                          {dayjs(r.start_ts).format("HH:mm")}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="font-medium text-gray-900">{r.patients?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{r.services?.title || "-"}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        r.status === 'completed' ? 'bg-green-100 text-green-800' :
                        r.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        r.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {r.status || "-"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📅</div>
            <div className="font-medium">No appointments found</div>
            <div className="text-sm">Your appointment schedule is clear</div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
