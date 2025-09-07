"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"

export default function DoctorToday() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      // get auth user
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      if (!user) return
      // find practitioner id
      const { data: prac } = await supabase
        .from("practitioners")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .single()
      if (!prac) { setRows([]); setLoading(false); return }

      const start = dayjs().startOf("day").toISOString()
      const end = dayjs().endOf("day").toISOString()

      const { data: appts, error } = await supabase
        .from("appointments")
        .select("id, start_ts, end_ts, status, patients(id,name,phone), services(id,title)")
        .eq("practitioner_id", prac.id)
        .gte("start_ts", start)
        .lte("start_ts", end)
        .order("start_ts", { ascending: true })

      if (error) console.error(error)
      if (mounted) {
        setRows(appts || [])
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) return <p>Loading…</p>

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Today's Patients</h1>
      <div className="border rounded">
        <div className="grid grid-cols-5 p-2 bg-gray-50 font-medium">
          <div>Time</div><div>Patient</div><div>Phone</div><div>Service</div><div>Status</div>
        </div>
        {rows.map(r => (
          <div key={r.id} className="grid grid-cols-5 p-2 border-t">
            <div>{dayjs(r.start_ts).format("HH:mm")}–{dayjs(r.end_ts).format("HH:mm")}</div>
            <div>{r.patients?.name ?? "-"}</div>
            <div>{r.patients?.phone ?? "-"}</div>
            <div>{r.services?.title ?? "-"}</div>
            <div className="capitalize">{r.status}</div>
          </div>
        ))}
        {rows.length === 0 && <div className="p-4 text-sm text-gray-500">No appointments today.</div>}
      </div>
    </div>
  )
}
