"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"

type Doc = { id: string, name: string }
type Service = { id: string, title: string, duration_minutes: number }
type Patient = { id: string, name: string, phone: string | null, cnic: string | null }

export default function NewAppointment() {
  const [doctors, setDoctors] = useState<Doc[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [sel, setSel] = useState({
    doctorId: "",
    serviceId: "",
    date: dayjs().format("YYYY-MM-DD"),
    patientId: "",
    query: ""
  })
  const [slots, setSlots] = useState<{ time: string, booked: boolean }[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  
  useEffect(() => {
    (async () => {
      const { data: d } = await supabase.from("practitioners").select("id,name").order("name")
      const { data: s } = await supabase.from("services").select("id,title,duration_minutes").order("title")
      setDoctors(d || []); setServices(s || [])
    })()
  }, [])

  
  async function searchPatients() {
    const q = sel.query.trim()
    if (!q) { setPatients([]); return }
    const { data } = await supabase
      .from("patients")
      .select("id,name,phone,cnic")
      .or(`name.ilike.%${q}%,phone.ilike.%${q}%,cnic.ilike.%${q}%`)
      .limit(10)
    setPatients(data || [])
  }
  useEffect(() => { searchPatients() }, [sel.query])

  
  async function loadSlots() {
    if (!sel.doctorId || !sel.serviceId || !sel.date) return
    setLoading(true)

    const svc = services.find(s => s.id === sel.serviceId)!
    const weekday = dayjs(sel.date).day() // 

    const { data: base } = await supabase.from("availability_slots")
      .select("start_time,end_time").eq("practitioner_id", sel.doctorId).eq("weekday", weekday)

    const { data: ex } = await supabase.from("availability_exceptions")
      .select("start_time,end_time,type").eq("practitioner_id", sel.doctorId).eq("date", sel.date)

    const dayStart = dayjs(sel.date).startOf("day").toISOString()
    const dayEnd = dayjs(sel.date).endOf("day").toISOString()
    const { data: appts } = await supabase.from("appointments")
      .select("start_ts,end_ts").eq("practitioner_id", sel.doctorId).gte("start_ts", dayStart).lte("start_ts", dayEnd)

    const out: { time: string, booked: boolean }[] = []
    base?.forEach(win => {
      const start = dayjs(`${sel.date}T${win.start_time}`)
      const end = dayjs(`${sel.date}T${win.end_time}`)
      let t = start

      while (t.add(svc.duration_minutes, "minute").isBefore(end) || 
             t.add(svc.duration_minutes, "minute").isSame(end)) {
        const slotStart = t
        const slotEnd = slotStart.add(svc.duration_minutes, "minute")

        const isBlocked = (ex || []).some(e => {
          const es = dayjs(`${sel.date}T${e.start_time}`)
          const ee = dayjs(`${sel.date}T${e.end_time}`)
          return e.type === "blocked" && slotStart.isBefore(ee) && slotEnd.isAfter(es)
        })

        const overlap = (appts || []).some(a => {
          const as = dayjs(a.start_ts)
          const ae = dayjs(a.end_ts)
          return slotStart.isBefore(ae) && slotEnd.isAfter(as)
        })

        out.push({ time: slotStart.format("HH:mm"), booked: isBlocked || overlap })

        
        t = slotStart.add(svc.duration_minutes, "minute")
      }
    })

    setSlots(out)
    setLoading(false)
  }
  useEffect(() => { loadSlots() }, [sel.doctorId, sel.serviceId, sel.date, services])

 
  async function book(slotTime: string) {
    if (!sel.patientId) { alert("Select patient"); return }
    if (!sel.doctorId || !sel.serviceId) { alert("Select doctor and service"); return }

    const svc = services.find(s => s.id === sel.serviceId)!
    const start = dayjs(`${sel.date}T${slotTime}`)
    const end = start.add(svc.duration_minutes, "minute")

    const { error } = await supabase.from("appointments").insert({
      practitioner_id: sel.doctorId,
      patient_id: sel.patientId,
      service_id: sel.serviceId,
      start_ts: start.toISOString(),
      end_ts: end.toISOString(),
      status: "booked"
    }).single()

    if (error) { alert(error.message); return }

    alert("✅ Appointment booked successfully")
    router.push("/dashboard")
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Book Appointment</h1>

      {/* Patient select */}
      <div className="border p-3 rounded space-y-2">
        <label className="font-medium">Patient</label>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-full"
            placeholder="Search name, phone, or CNIC"
            value={sel.query}
            onChange={e => setSel(s => ({ ...s, query: e.target.value }))}
          />
          <a href="/dashboard/patients/new" className="px-3 py-2 border rounded">+ New Patient</a>
        </div>
        {patients.length > 0 && (
          <div className="border rounded divide-y max-h-40 overflow-y-auto">
            {patients.map(p => (
              <button
                key={p.id}
                className={`w-full text-left p-2 ${sel.patientId === p.id ? "bg-blue-50" : ""}`}
                onClick={() => setSel(s => ({
                  ...s,
                  patientId: p.id,
                  query: `${p.name} (${p.phone ?? ""})`
                }))}
              >
                {p.name} · {p.phone ?? "—"} · {p.cnic ?? "—"}
              </button>
            ))}
          </div>
        )}
      </div>

     
      <div className="grid grid-cols-3 gap-3">
        <select className="border p-2 rounded" value={sel.doctorId} onChange={e => setSel(s => ({ ...s, doctorId: e.target.value }))}>
          <option value="">Select Doctor</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className="border p-2 rounded" value={sel.serviceId} onChange={e => setSel(s => ({ ...s, serviceId: e.target.value }))}>
          <option value="">Select Service</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        <input type="date" className="border p-2 rounded" value={sel.date} onChange={e => setSel(s => ({ ...s, date: e.target.value }))} />
      </div>

      {/* Slots grid */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-sm"></span><span className="text-sm">Available</span>
          <span className="inline-block w-3 h-3 bg-gray-400 rounded-sm"></span><span className="text-sm">Booked/Blocked</span>
        </div>
        {loading ? <p>Loading slots…</p> : (
          <div className="flex flex-wrap gap-2">
            {slots.map(s => (
              <button
                key={s.time}
                disabled={s.booked || !sel.patientId || !sel.doctorId || !sel.serviceId}
                onClick={() => book(s.time)}
                className={`px-3 py-2 rounded border ${s.booked || !sel.patientId || !sel.doctorId || !sel.serviceId
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-50 hover:bg-green-100 border-green-600"}`}
              >
                {s.time}
              </button>
            ))}
            {slots.length === 0 && <p className="text-sm text-gray-500">Select doctor, service & date to view slots.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
