// "use client"
// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabaseClient"
// import dayjs from "dayjs"
// import { useRouter } from "next/navigation"

// type Doc = { id: string, name: string }
// type Service = { id: string, title: string, duration_minutes: number }
// type Patient = { id: string, name: string, phone: string | null, cnic: string | null }

// export default function NewAppointment() {
//   const [doctors, setDoctors] = useState<Doc[]>([])
//   const [services, setServices] = useState<Service[]>([])
//   const [patients, setPatients] = useState<Patient[]>([])
//   const [sel, setSel] = useState({
//     doctorId: "",
//     serviceId: "",
//     date: dayjs().format("YYYY-MM-DD"),
//     patientId: "",
//     query: ""
//   })
//   const [slots, setSlots] = useState<{ time: string, booked: boolean }[]>([])
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

  
//   useEffect(() => {
//     (async () => {
//       const { data: d } = await supabase.from("practitioners").select("id,name").order("name")
//       const { data: s } = await supabase.from("services").select("id,title,duration_minutes").order("title")
//       setDoctors(d || []); setServices(s || [])
//     })()
//   }, [])

  
//   async function searchPatients() {
//     const q = sel.query.trim()
//     if (!q) { setPatients([]); return }
//     const { data } = await supabase
//       .from("patients")
//       .select("id,name,phone,cnic")
//       .or(`name.ilike.%${q}%,phone.ilike.%${q}%,cnic.ilike.%${q}%`)
//       .limit(10)
//     setPatients(data || [])
//   }
//   useEffect(() => { searchPatients() }, [sel.query])

  
//   async function loadSlots() {
//     if (!sel.doctorId || !sel.serviceId || !sel.date) return
//     setLoading(true)

//     const svc = services.find(s => s.id === sel.serviceId)!
//     const weekday = dayjs(sel.date).day() // 

//     const { data: base } = await supabase.from("availability_slots")
//       .select("start_time,end_time").eq("practitioner_id", sel.doctorId).eq("weekday", weekday)

//     const { data: ex } = await supabase.from("availability_exceptions")
//       .select("start_time,end_time,type").eq("practitioner_id", sel.doctorId).eq("date", sel.date)

//     const dayStart = dayjs(sel.date).startOf("day").toISOString()
//     const dayEnd = dayjs(sel.date).endOf("day").toISOString()
//     const { data: appts } = await supabase.from("appointments")
//       .select("start_ts,end_ts").eq("practitioner_id", sel.doctorId).gte("start_ts", dayStart).lte("start_ts", dayEnd)

//     const out: { time: string, booked: boolean }[] = []
//     base?.forEach(win => {
//       const start = dayjs(`${sel.date}T${win.start_time}`)
//       const end = dayjs(`${sel.date}T${win.end_time}`)
//       let t = start

//       while (t.add(svc.duration_minutes, "minute").isBefore(end) || 
//              t.add(svc.duration_minutes, "minute").isSame(end)) {
//         const slotStart = t
//         const slotEnd = slotStart.add(svc.duration_minutes, "minute")

//         const isBlocked = (ex || []).some(e => {
//           const es = dayjs(`${sel.date}T${e.start_time}`)
//           const ee = dayjs(`${sel.date}T${e.end_time}`)
//           return e.type === "blocked" && slotStart.isBefore(ee) && slotEnd.isAfter(es)
//         })

//         const overlap = (appts || []).some(a => {
//           const as = dayjs(a.start_ts)
//           const ae = dayjs(a.end_ts)
//           return slotStart.isBefore(ae) && slotEnd.isAfter(as)
//         })

//         out.push({ time: slotStart.format("HH:mm"), booked: isBlocked || overlap })

        
//         t = slotStart.add(svc.duration_minutes, "minute")
//       }
//     })

//     setSlots(out)
//     setLoading(false)
//   }
//   useEffect(() => { loadSlots() }, [sel.doctorId, sel.serviceId, sel.date, services])

 
//   async function book(slotTime: string) {
//     if (!sel.patientId) { alert("Select patient"); return }
//     if (!sel.doctorId || !sel.serviceId) { alert("Select doctor and service"); return }

//     const svc = services.find(s => s.id === sel.serviceId)!
//     const start = dayjs(`${sel.date}T${slotTime}`)
//     const end = start.add(svc.duration_minutes, "minute")

//     const { error } = await supabase.from("appointments").insert({
//       practitioner_id: sel.doctorId,
//       patient_id: sel.patientId,
//       service_id: sel.serviceId,
//       start_ts: start.toISOString(),
//       end_ts: end.toISOString(),
//       status: "booked"
//     }).single()

//     if (error) { alert(error.message); return }

//     alert("✅ Appointment booked successfully")
//     router.push("/dashboard")
//   }

//   return (
//     <div className="space-y-4">
//       <h1 className="text-xl font-semibold">Book Appointment</h1>

//       {/* Patient select */}
//       <div className="border p-3 rounded space-y-2">
//         <label className="font-medium">Patient</label>
//         <div className="flex gap-2">
//           <input
//             className="border p-2 rounded w-full"
//             placeholder="Search name, phone, or CNIC"
//             value={sel.query}
//             onChange={e => setSel(s => ({ ...s, query: e.target.value }))}
//           />
//           <a href="/dashboard/patients/new" className="px-3 py-2 border rounded">+ New Patient</a>
//         </div>
//         {patients.length > 0 && (
//           <div className="border rounded divide-y max-h-40 overflow-y-auto">
//             {patients.map(p => (
//               <button
//                 key={p.id}
//                 className={`w-full text-left p-2 ${sel.patientId === p.id ? "bg-blue-50" : ""}`}
//                 onClick={() => setSel(s => ({
//                   ...s,
//                   patientId: p.id,
//                   query: `${p.name} (${p.phone ?? ""})`
//                 }))}
//               >
//                 {p.name} · {p.phone ?? "—"} · {p.cnic ?? "—"}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

     
//       <div className="grid grid-cols-3 gap-3">
//         <select className="border p-2 rounded" value={sel.doctorId} onChange={e => setSel(s => ({ ...s, doctorId: e.target.value }))}>
//           <option value="">Select Doctor</option>
//           {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
//         </select>
//         <select className="border p-2 rounded" value={sel.serviceId} onChange={e => setSel(s => ({ ...s, serviceId: e.target.value }))}>
//           <option value="">Select Service</option>
//           {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
//         </select>
//         <input type="date" className="border p-2 rounded" value={sel.date} onChange={e => setSel(s => ({ ...s, date: e.target.value }))} />
//       </div>

//       {/* Slots grid */}
//       <div>
//         <div className="flex items-center gap-3 mb-2">
//           <span className="inline-block w-3 h-3 bg-green-500 rounded-sm"></span><span className="text-sm">Available</span>
//           <span className="inline-block w-3 h-3 bg-gray-400 rounded-sm"></span><span className="text-sm">Booked/Blocked</span>
//         </div>
//         {loading ? <p>Loading slots…</p> : (
//           <div className="flex flex-wrap gap-2">
//             {slots.map(s => (
//               <button
//                 key={s.time}
//                 disabled={s.booked || !sel.patientId || !sel.doctorId || !sel.serviceId}
//                 onClick={() => book(s.time)}
//                 className={`px-3 py-2 rounded border ${s.booked || !sel.patientId || !sel.doctorId || !sel.serviceId
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-green-50 hover:bg-green-100 border-green-600"}`}
//               >
//                 {s.time}
//               </button>
//             ))}
//             {slots.length === 0 && <p className="text-sm text-gray-500">Select doctor, service & date to view slots.</p>}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }




"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2, Search, UserPlus, Calendar as CalendarIcon } from "lucide-react"
import { toast } from "sonner"

type Doc = { id: string; name: string }
type Service = { id: string; title: string; duration_minutes: number }
type Patient = { id: string; name: string; phone: string | null; cnic: string | null }

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
  const [slots, setSlots] = useState<{ time: string; booked: boolean }[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Load doctors & services
  useEffect(() => {
    (async () => {
      const { data: d } = await supabase.from("practitioners").select("id,name").order("name")
      const { data: s } = await supabase.from("services").select("id,title,duration_minutes").order("title")
      setDoctors(d || [])
      setServices(s || [])
    })()
  }, [])

  // Patient search
  async function searchPatients() {
    const q = sel.query.trim()
    if (!q) {
      setPatients([])
      return
    }
    const { data } = await supabase
      .from("patients")
      .select("id,name,phone,cnic")
      .or(`name.ilike.%${q}%,phone.ilike.%${q}%,cnic.ilike.%${q}%`)
      .limit(10)
    setPatients(data || [])
  }
  useEffect(() => {
    searchPatients()
  }, [sel.query])

  // Load availability slots
  async function loadSlots() {
    if (!sel.doctorId || !sel.serviceId || !sel.date) return
    setLoading(true)

    const svc = services.find((s) => s.id === sel.serviceId)!
    const weekday = dayjs(sel.date).day()

    const { data: base } = await supabase
      .from("availability_slots")
      .select("start_time,end_time")
      .eq("practitioner_id", sel.doctorId)
      .eq("weekday", weekday)

    const { data: ex } = await supabase
      .from("availability_exceptions")
      .select("start_time,end_time,type")
      .eq("practitioner_id", sel.doctorId)
      .eq("date", sel.date)

    const dayStart = dayjs(sel.date).startOf("day").toISOString()
    const dayEnd = dayjs(sel.date).endOf("day").toISOString()
    const { data: appts } = await supabase
      .from("appointments")
      .select("start_ts,end_ts")
      .eq("practitioner_id", sel.doctorId)
      .gte("start_ts", dayStart)
      .lte("start_ts", dayEnd)

    const out: { time: string; booked: boolean }[] = []
    base?.forEach((win) => {
      const start = dayjs(`${sel.date}T${win.start_time}`)
      const end = dayjs(`${sel.date}T${win.end_time}`)
      let t = start

      while (
        t.add(svc.duration_minutes, "minute").isBefore(end) ||
        t.add(svc.duration_minutes, "minute").isSame(end)
      ) {
        const slotStart = t
        const slotEnd = slotStart.add(svc.duration_minutes, "minute")

        const isBlocked = (ex || []).some((e) => {
          const es = dayjs(`${sel.date}T${e.start_time}`)
          const ee = dayjs(`${sel.date}T${e.end_time}`)
          return e.type === "blocked" && slotStart.isBefore(ee) && slotEnd.isAfter(es)
        })

        const overlap = (appts || []).some((a) => {
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
  useEffect(() => {
    loadSlots()
  }, [sel.doctorId, sel.serviceId, sel.date, services])

  // Book appointment
  async function book(slotTime: string) {
    if (!sel.patientId) {
      toast.error("⚠️ Please select a patient first")
      return
    }
    if (!sel.doctorId || !sel.serviceId) {
      toast.error("⚠️ Select doctor and service")
      return
    }

    const svc = services.find((s) => s.id === sel.serviceId)!
    const start = dayjs(`${sel.date}T${slotTime}`)
    const end = start.add(svc.duration_minutes, "minute")

    const { error } = await supabase
      .from("appointments")
      .insert({
        practitioner_id: sel.doctorId,
        patient_id: sel.patientId,
        service_id: sel.serviceId,
        start_ts: start.toISOString(),
        end_ts: end.toISOString(),
        status: "booked"
      })
      .single()

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("✅ Appointment booked successfully")
    router.push("/dashboard")
  }

  return (
    <motion.div
      className="space-y-6 max-w-3xl mx-auto p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold tracking-tight">📅 New Appointment</h1>

      {/* Patient Search */}
      <Card>
        <CardHeader>
          <CardTitle>Select Patient</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Search name, phone, or CNIC"
              value={sel.query}
              onChange={(e) => setSel((s) => ({ ...s, query: e.target.value }))}
            />
            <Button variant="outline" asChild>
              <a href="/dashboard/patients/new">
                <UserPlus className="w-4 h-4 mr-1" /> New
              </a>
            </Button>
          </div>

          <AnimatePresence>
            {patients.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border rounded divide-y max-h-40 overflow-y-auto"
              >
                {patients.map((p) => (
                  <button
                    key={p.id}
                    className={`w-full text-left p-2 hover:bg-muted ${
                      sel.patientId === p.id ? "bg-primary/10" : ""
                    }`}
                    onClick={() =>
                      setSel((s) => ({
                        ...s,
                        patientId: p.id,
                        query: `${p.name} (${p.phone ?? ""})`
                      }))
                    }
                  >
                    {p.name} · {p.phone ?? "—"} · {p.cnic ?? "—"}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Doctor, Service, Date */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            onValueChange={(val) => setSel((s) => ({ ...s, doctorId: val }))}
            value={sel.doctorId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(val) => setSel((s) => ({ ...s, serviceId: val }))}
            value={sel.serviceId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded px-3">
            <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
            <Input
              type="date"
              className="border-0 p-0 focus-visible:ring-0"
              value={sel.date}
              onChange={(e) => setSel((s) => ({ ...s, date: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Slots */}
      <Card>
        <CardHeader>
          <CardTitle>Available Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-3 text-sm">
            <span className="w-3 h-3 bg-green-500 rounded-sm"></span> Available
            <span className="w-3 h-3 bg-gray-400 rounded-sm ml-4"></span> Booked/Blocked
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin w-4 h-4" /> Loading slots…
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => (
                <motion.button
                  key={s.time}
                  disabled={s.booked || !sel.patientId || !sel.doctorId || !sel.serviceId}
                  onClick={() => book(s.time)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                    s.booked || !sel.patientId || !sel.doctorId || !sel.serviceId
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-50 hover:bg-green-100 border-green-600"
                  }`}
                >
                  {s.time}
                </motion.button>
              ))}
              {slots.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Select doctor, service & date to view slots.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
