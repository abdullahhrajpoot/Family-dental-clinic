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
    <div>
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">
          {mode === "today" ? "Today’s Schedule" : "Appointment History"}
        </h1>
        <div className="flex space-x-2">
          <Button onClick={() => setMode("today")} className={mode === "today" ? "bg-green-600 text-white" : "bg-gray-200"}>
            Today
          </Button>
          <Button onClick={() => setMode("history")} className={mode === "history" ? "bg-green-600 text-white" : "bg-gray-200"}>
            History
          </Button>
        </div>
      </div>

      {/* Filters for history mode */}
      {mode === "history" && (
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="date"
            value={date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
            className="border rounded p-2"
          />
          <Input
            type="text"
            placeholder="Filter by patient or doctor"
            value={filter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
            className="flex-1"
          />
          <Button onClick={exportCSV} className="bg-blue-600 text-white">
            Export CSV
          </Button>
        </div>
      )}

      {/* Data table */}
      <Card className="border rounded">
        <div className="grid grid-cols-5 font-medium bg-gray-50 p-2">
          <div>Time</div>
          <div>Patient</div>
          <div>Doctor</div>
          <div>Service</div>
          <div>Status</div>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-gray-500">Loading…</div>
        ) : rows.length > 0 ? (
          rows.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-5 p-2 border-t"
            >
              <div>
                {dayjs(r.start_ts).format("hh:mm A")}–{dayjs(r.end_ts).format("hh:mm A")}
              </div>
              <div>{r.patients?.name ?? "-"}</div>
              <div>{r.practitioners?.name ?? "-"}</div>
              <div>{r.services?.title ?? "-"}</div>
              <div>{r.status ?? "-"}</div>
            </motion.div>
          ))
        ) : (
          <div className="p-4 text-sm text-gray-500">No appointments found.</div>
        )}
      </Card>
    </div>
  )
}
