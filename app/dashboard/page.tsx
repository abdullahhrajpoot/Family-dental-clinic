// "use client"
// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabaseClient"
// import dayjs from "dayjs"

// type Row = {
//   id: string
//   start_ts: string
//   end_ts: string
//   patients: { name: string } | null
//   practitioners: { name: string } | null
//   services: { title: string } | null
// }

// export default function TodayPage() {
//   const [rows, setRows] = useState<Row[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const load = async () => {
//       const start = dayjs().startOf("day").toISOString()
//       const end = dayjs().endOf("day").toISOString()
//       const { data, error } = await supabase
//         .from("appointments")
//         .select("id,start_ts,end_ts,patients(name),practitioners(name),services(title),status")
//         .gte("start_ts", start)
//         .lte("start_ts", end)
//         .order("start_ts", { ascending: true })
//       if (!error && data) setRows(data as any)
//       setLoading(false)
//     }
//     load()
//   }, [])

//   if (loading) return <p>Loading…</p>

//   return (
//     <div>
//       <h1 className="text-xl font-semibold mb-4">Today’s Schedule</h1>
//       <div className="border rounded">
//         <div className="grid grid-cols-5 font-medium bg-gray-50 p-2">
//           <div>Time</div><div>Patient</div><div>Doctor</div><div>Service</div><div>Status</div>
//         </div>
//         {rows.map(r => (
//           <div key={r.id} className="grid grid-cols-5 p-2 border-t">
//             <div>
//               {dayjs(r.start_ts).format("hh:mm A")}–{dayjs(r.end_ts).format("hh:mm A")}
//             </div>
//             <div>{r.patients?.name ?? "-"}</div>
//             <div>{r.practitioners?.name ?? "-"}</div>
//             <div>{r.services?.title ?? "-"}</div>
//             <div>{(r as any).status ?? "-"}</div>
//           </div>
//         ))}
//         {rows.length === 0 && <div className="p-4 text-sm text-gray-500">No appointments today.</div>}
//       </div>
//     </div>
//   )
// }




// "use client"
// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabaseClient"
// import dayjs from "dayjs"

// type Row = {
//   id: string
//   start_ts: string
//   end_ts: string
//   patients: { name: string } | null
//   practitioners: { name: string } | null
//   services: { title: string } | null
//   status?: string
// }

// export default function DashboardPage() {
//   const [rows, setRows] = useState<Row[]>([])
//   const [loading, setLoading] = useState(true)
//   const [mode, setMode] = useState<"today" | "history">("today")
//   const [date, setDate] = useState(dayjs().subtract(1, "day").format("YYYY-MM-DD"))
//   const [filter, setFilter] = useState("")

//   // Load data
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true)

//       let query = supabase
//         .from("appointments")
//         .select("id,start_ts,end_ts,patients(name),practitioners(name),services(title),status")
//         .order("start_ts", { ascending: true })

//       if (mode === "today") {
//         // only today's appointments
//         const start = dayjs().startOf("day").toISOString()
//         const end = dayjs().endOf("day").toISOString()
//         query = query.gte("start_ts", start).lte("start_ts", end)
//       } else {
//         // if no filter, restrict by date
//         if (!filter.trim()) {
//           const start = dayjs(date).startOf("day").toISOString()
//           const end = dayjs(date).endOf("day").toISOString()
//           query = query.gte("start_ts", start).lte("start_ts", end)
//         }
//       }

//       const { data, error } = await query

//       if (!error && data) {
//         let filtered = data as unknown as Row[]

//         if (filter.trim()) {
//           const f = filter.toLowerCase()
//           filtered = filtered.filter(
//             (r) =>
//               r.patients?.name?.toLowerCase().includes(f) ||
//               r.practitioners?.name?.toLowerCase().includes(f)
//           )

//           // optional secondary filter by date if still selected
//           if (date) {
//             filtered = filtered.filter((r) =>
//               dayjs(r.start_ts).isSame(dayjs(date), "day")
//             )
//           }
//         }

//         setRows(filtered)
//       } else {
//         setRows([])
//       }

//       setLoading(false)
//     }

//     load()
//   }, [mode, date, filter])

//   // Export to CSV
//   const exportCSV = () => {
//     const headers = ["Time", "Patient", "Doctor", "Service", "Status"]
//     const csvRows = [headers.join(",")]

//     rows.forEach((r) => {
//       const row = [
//         `${dayjs(r.start_ts).format("hh:mm A")}–${dayjs(r.end_ts).format("hh:mm A")}`,
//         r.patients?.name ?? "-",
//         r.practitioners?.name ?? "-",
//         r.services?.title ?? "-",
//         r.status ?? "-"
//       ]
//       csvRows.push(row.map((cell) => `"${cell}"`).join(","))
//     })

//     const blob = new Blob([csvRows.join("\n")], { type: "text/csv" })
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = `appointments_${mode}_${dayjs().format("YYYYMMDD")}.csv`
//     a.click()
//     window.URL.revokeObjectURL(url)
//   }

//   return (
//     <div>
//       {/* Header with toggle */}
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl font-semibold">
//           {mode === "today" ? "Today’s Schedule" : "Appointment History"}
//         </h1>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setMode("today")}
//             className={`px-3 py-1 rounded ${mode === "today" ? "bg-green-600 text-white" : "bg-gray-200"}`}
//           >
//             Today
//           </button>
//           <button
//             onClick={() => setMode("history")}
//             className={`px-3 py-1 rounded ${mode === "history" ? "bg-green-600 text-white" : "bg-gray-200"}`}
//           >
//             History
//           </button>
//         </div>
//       </div>

//       {/* Filters for history mode */}
//       {mode === "history" && (
//         <div className="flex items-center space-x-2 mb-4">
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="border rounded p-2"
           
//           />
//           <input
//             type="text"
//             placeholder="Filter by patient or doctor"
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="border rounded p-2 flex-1"
//           />
//           <button
//             onClick={exportCSV}
//             className="bg-blue-600 text-white px-3 py-2 rounded"
//           >
//             Export CSV
//           </button>
//         </div>
//       )}

//       {/* Data table */}
//       <div className="border rounded">
//         <div className="grid grid-cols-5 font-medium bg-gray-50 p-2">
//           <div>Time</div>
//           <div>Patient</div>
//           <div>Doctor</div>
//           <div>Service</div>
//           <div>Status</div>
//         </div>
//         {loading ? (
//           <div className="p-4 text-sm text-gray-500">Loading…</div>
//         ) : rows.length > 0 ? (
//           rows.map((r) => (
//             <div key={r.id} className="grid grid-cols-5 p-2 border-t">
//               <div>
//                 {dayjs(r.start_ts).format("hh:mm A")}–{dayjs(r.end_ts).format("hh:mm A")}
//               </div>
//               <div>{r.patients?.name ?? "-"}</div>
//               <div>{r.practitioners?.name ?? "-"}</div>
//               <div>{r.services?.title ?? "-"}</div>
//               <div>{r.status ?? "-"}</div>
//             </div>
//           ))
//         ) : (
//           <div className="p-4 text-sm text-gray-500">No appointments found.</div>
//         )}
//       </div>
//     </div>
//   )
// }




"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"
import {Card} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import { motion } from "framer-motion"

type Row = {
  id: string
  start_ts: string
  end_ts: string
  patients: { name: string } | null
  practitioners: { name: string } | null
  services: { title: string } | null
  status?: string
}

export default function DashboardPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<"today" | "history">("today")
  const [date, setDate] = useState(dayjs().subtract(1, "day").format("YYYY-MM-DD"))
  const [filter, setFilter] = useState("")

  // Load data
  useEffect(() => {
    const load = async () => {
      setLoading(true)

      let query = supabase
        .from("appointments")
        .select("id,start_ts,end_ts,patients(name),practitioners(name),services(title),status")
        .order("start_ts", { ascending: true })

      if (mode === "today") {
        // only today's appointments
        const start = dayjs().startOf("day").toISOString()
        const end = dayjs().endOf("day").toISOString()
        query = query.gte("start_ts", start).lte("start_ts", end)
      } else {
        // if no filter, restrict by date
        if (!filter.trim()) {
          const start = dayjs(date).startOf("day").toISOString()
          const end = dayjs(date).endOf("day").toISOString()
          query = query.gte("start_ts", start).lte("start_ts", end)
        }
      }

      const { data, error } = await query

      if (!error && data) {
        let filtered = data as unknown as Row[]

        if (filter.trim()) {
          const f = filter.toLowerCase()
          filtered = filtered.filter(
            (r) =>
              r.patients?.name?.toLowerCase().includes(f) ||
              r.practitioners?.name?.toLowerCase().includes(f)
          )

          // optional secondary filter by date if still selected
          if (date) {
            filtered = filtered.filter((r) =>
              dayjs(r.start_ts).isSame(dayjs(date), "day")
            )
          }
        }

        setRows(filtered)
      } else {
        setRows([])
      }

      setLoading(false)
    }

    load()
  }, [mode, date, filter])

  // Export to CSV
  const exportCSV = () => {
    const headers = ["Time", "Patient", "Doctor", "Service", "Status"]
    const csvRows = [headers.join(",")]

    rows.forEach((r) => {
      const row = [
        `${dayjs(r.start_ts).format("hh:mm A")}–${dayjs(r.end_ts).format("hh:mm A")}`,
        r.patients?.name ?? "-",
        r.practitioners?.name ?? "-",
        r.services?.title ?? "-",
        r.status ?? "-"
      ]
      csvRows.push(row.map((cell) => `"${cell}"`).join(","))
    })

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `appointments_${mode}_${dayjs().format("YYYYMMDD")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header with toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {mode === "today" ? "Today's Schedule" : "Appointment History"}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === "today" 
              ? "View and manage today's appointments" 
              : "Browse through appointment history and generate reports"
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setMode("today")} 
            variant={mode === "today" ? "default" : "outline"}
            className={mode === "today" ? "medical-button" : "border-blue-200 text-blue-600 hover:bg-blue-50"}
          >
            Today
          </Button>
          <Button 
            onClick={() => setMode("history")} 
            variant={mode === "history" ? "default" : "outline"}
            className={mode === "history" ? "medical-button" : "border-blue-200 text-blue-600 hover:bg-blue-50"}
          >
            History
          </Button>
        </div>
      </motion.div>

      {/* Filters for history mode */}
      {mode === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="medical-card p-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                  className="medical-input p-2"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Search</label>
                <Input
                  type="text"
                  placeholder="Filter by patient or doctor"
                  value={filter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
                  className="medical-input"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={exportCSV} className="medical-button">
                Export CSV
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Data table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="medical-card overflow-hidden"
      >
        <div className="medical-table-header grid grid-cols-5 p-4 font-semibold text-gray-700">
          <div>Time</div>
          <div>Patient</div>
          <div>Doctor</div>
          <div>Service</div>
          <div>Status</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <div>Loading appointments...</div>
          </div>
        ) : rows.length > 0 ? (
          <div className="divide-y divide-blue-100">
            {rows.map((r, index) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.05 }}
                className="medical-table-row grid grid-cols-5 p-4 hover:bg-blue-50/50 transition-colors"
              >
                <div className="font-medium text-blue-600">
                  {dayjs(r.start_ts).format("hh:mm A")}–{dayjs(r.end_ts).format("hh:mm A")}
                </div>
                <div className="font-medium text-gray-900">{r.patients?.name ?? "-"}</div>
                <div className="text-gray-700">{r.practitioners?.name ?? "-"}</div>
                <div className="text-gray-700">{r.services?.title ?? "-"}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    r.status === 'completed' ? 'bg-green-100 text-green-800' :
                    r.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    r.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {r.status ?? "-"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">📅</div>
            <div className="font-medium">No appointments found</div>
            <div className="text-sm">Try adjusting your filters or check back later</div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
