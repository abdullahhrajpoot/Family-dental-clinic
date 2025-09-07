"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"

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

      const { data: prac } = await supabase.from("practitioners").select("id").eq("user_id", user.id).single()
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

  if (loading) return <p>Loading…</p>

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Appointments</h1>
      <div className="flex gap-2 mb-4">
        <button onClick={()=>setFilter("upcoming")} className="px-3 py-1 border rounded">Upcoming</button>
        <button onClick={()=>setFilter("past")} className="px-3 py-1 border rounded">Past</button>
        <button onClick={()=>setFilter("all")} className="px-3 py-1 border rounded">All</button>
      </div>

      <div className="border rounded">
        <div className="grid grid-cols-5 p-2 bg-gray-50 font-medium">
          <div>Date</div><div>Time</div><div>Patient</div><div>Service</div><div>Status</div>
        </div>
        {rows.map(r=>(
          <div key={r.id} className="grid grid-cols-5 p-2 border-t">
            <div>{dayjs(r.start_ts).format("YYYY-MM-DD")}</div>
            <div>{dayjs(r.start_ts).format("HH:mm")}</div>
            <div>{r.patients?.name}</div>
            <div>{r.services?.title}</div>
            <div className="capitalize">{r.status}</div>
          </div>
        ))}
        {rows.length===0 && <div className="p-4 text-sm text-gray-500">No appointments.</div>}
      </div>
    </div>
  )
}
