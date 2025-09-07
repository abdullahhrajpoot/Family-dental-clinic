"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"

type Row = {
  id: string
  start_ts: string
  end_ts: string
  patients: { name: string } | null
  practitioners: { name: string } | null
  services: { title: string } | null
}

export default function TodayPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const start = dayjs().startOf("day").toISOString()
      const end = dayjs().endOf("day").toISOString()
      const { data, error } = await supabase
        .from("appointments")
        .select("id,start_ts,end_ts,patients(name),practitioners(name),services(title),status")
        .gte("start_ts", start)
        .lte("start_ts", end)
        .order("start_ts", { ascending: true })
      if (!error && data) setRows(data as any)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p>Loading…</p>

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Today’s Schedule</h1>
      <div className="border rounded">
        <div className="grid grid-cols-5 font-medium bg-gray-50 p-2">
          <div>Time</div><div>Patient</div><div>Doctor</div><div>Service</div><div>Status</div>
        </div>
        {rows.map(r => (
          <div key={r.id} className="grid grid-cols-5 p-2 border-t">
            <div>
              {dayjs(r.start_ts).format("hh:mm A")}–{dayjs(r.end_ts).format("hh:mm A")}
            </div>
            <div>{r.patients?.name ?? "-"}</div>
            <div>{r.practitioners?.name ?? "-"}</div>
            <div>{r.services?.title ?? "-"}</div>
            <div>{(r as any).status ?? "-"}</div>
          </div>
        ))}
        {rows.length === 0 && <div className="p-4 text-sm text-gray-500">No appointments today.</div>}
      </div>
    </div>
  )
}
