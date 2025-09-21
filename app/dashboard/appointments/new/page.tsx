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
import { Loader2, Search, UserPlus, Calendar as CalendarIcon, Clock } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">📅 Book New Appointment</h1>
          <p className="text-gray-600 mt-1">Schedule a new appointment for a patient</p>
        </div>
      </motion.div>

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >

      {/* Patient Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="medical-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Search className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Select Patient</h2>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Search Patients</label>
              <Input
                placeholder="Search name, phone, or CNIC"
                value={sel.query}
                onChange={(e) => setSel((s) => ({ ...s, query: e.target.value }))}
                className="medical-input"
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" asChild className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <Link href="/dashboard/patients/new">
                  <UserPlus className="w-4 h-4 mr-1" /> New Patient
                </Link>
              </Button>
            </div>
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
        </div>
      </motion.div>

      {/* Doctor, Service, Date */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="medical-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Appointment Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Doctor</label>
            <Select
              onValueChange={(val) => setSel((s) => ({ ...s, doctorId: val }))}
              value={sel.doctorId}
            >
              <SelectTrigger className="medical-input">
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
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Service</label>
            <Select
              onValueChange={(val) => setSel((s) => ({ ...s, serviceId: val }))}
              value={sel.serviceId}
            >
              <SelectTrigger className="medical-input">
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
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                className="medical-input pl-10"
                value={sel.date}
                onChange={(e) => setSel((s) => ({ ...s, date: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Slots */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="medical-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Available Time Slots</h2>
        </div>

        <div className="flex items-center gap-6 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
            <span className="text-gray-600">Booked/Blocked</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="animate-spin w-5 h-5" />
              <span>Loading available slots...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {slots.map((s) => (
              <motion.button
                key={s.time}
                disabled={s.booked || !sel.patientId || !sel.doctorId || !sel.serviceId}
                onClick={() => book(s.time)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                  s.booked || !sel.patientId || !sel.doctorId || !sel.serviceId
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                    : "bg-green-50 hover:bg-green-100 border-green-300 text-green-700 hover:border-green-400 hover:shadow-md"
                }`}
              >
                {s.time}
              </motion.button>
            ))}
            {slots.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">
                  Select doctor, service & date to view available slots.
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
      </motion.div>
    </div>
  )
}
