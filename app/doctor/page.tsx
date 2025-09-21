"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"
import { motion } from "framer-motion"
import { Calendar, Clock, User, Phone, Stethoscope, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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

  if (loading) {
    return (
      <div className="min-h-screen medical-gradient-light p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto space-y-6"
        >
          {/* Header Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="medical-card p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </motion.div>

          {/* Appointments Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="medical-card p-6"
          >
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen medical-gradient-light p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="medical-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Today's Schedule</h1>
              <p className="text-gray-600 mt-1">
                {dayjs().format("dddd, MMMM DD, YYYY")} • {rows.length} appointments
              </p>
            </div>
          </div>
        </motion.div>

        {/* Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="medical-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Stethoscope className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Patient Appointments</h2>
          </div>

          {rows.length > 0 ? (
            <div className="medical-table overflow-hidden">
              <table className="w-full">
                <thead className="medical-table-header">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Patient</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Phone</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Service</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {rows.map((r, idx) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: idx * 0.05 }}
                      className="medical-table-row hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-4 text-gray-900">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {dayjs(r.start_ts).format("HH:mm")}–{dayjs(r.end_ts).format("HH:mm")}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {r.patients?.name ?? "—"}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {r.patients?.phone ?? "—"}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700">{r.services?.title ?? "—"}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          r.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : r.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments today</h3>
              <p className="text-gray-600">You have a free day! Enjoy your time off.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
