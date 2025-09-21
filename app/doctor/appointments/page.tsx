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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === "upcoming" ? "default" : "outline"}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === "past" ? "default" : "outline"}
              onClick={() => setFilter("past")}
            >
              Past
            </Button>
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
          </div>

          {/* Appointments table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b"
                >
                  <TableCell>{dayjs(r.start_ts).format("YYYY-MM-DD")}</TableCell>
                  <TableCell>{dayjs(r.start_ts).format("HH:mm")}</TableCell>
                  <TableCell>{r.patients?.name}</TableCell>
                  <TableCell>{r.services?.title}</TableCell>
                  <TableCell className="capitalize">{r.status}</TableCell>
                </motion.tr>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-6"
                  >
                    No appointments.
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
