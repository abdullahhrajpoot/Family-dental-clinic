// "use client"
// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { supabase } from "@/lib/supabaseClient"

// type Patient = {
//   id: string
//   name: string
//   phone: string | null
//   cnic: string | null
// }

// export default function PatientsPage() {
//   const [patients, setPatients] = useState<Patient[]>([])
//   const [q, setQ] = useState("")
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const load = async () => {
//       let query = supabase.from("patients").select("id,name,phone,cnic").order("name", { ascending: true })
//       if (q.trim()) {
//         query = query.or(
//           `name.ilike.%${q}%,cnic.ilike.%${q}%,phone.ilike.%${q}%`
//         )
//       }
//       const { data, error } = await query
//       if (!error && data) setPatients(data as Patient[])
//       setLoading(false)
//     }
//     load()
//   }, [q])

//   return (
//     <div className="space-y-3">
//       <h1 className="text-xl font-semibold">Patients</h1>

//       <div className="flex gap-2">
//         <input
//           className="border p-2 rounded w-full"
//           placeholder="Search by name, CNIC, or phone"
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//         />
//       </div>

//       {loading ? (
//         <p>Loading…</p>
//       ) : (
//         <div className="border rounded">
//           <div className="grid grid-cols-3 p-2 bg-gray-50 font-medium">
//             <div>Name</div>
//             <div>Phone</div>
//             <div>CNIC</div>
//           </div>
//           {patients.map((p) => (
//             <Link
//               key={p.id}
//               href={`/doctor/patients/${p.id}`}
//               className="grid grid-cols-3 p-2 border-t hover:bg-gray-50"
//             >
//               <div>{p.name}</div>
//               <div>{p.phone ?? "—"}</div>
//               <div>{p.cnic ?? "—"}</div>
//             </Link>
//           ))}
//           {patients.length === 0 && (
//             <div className="p-4 text-sm text-gray-500">No patients found.</div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Search, Users, Phone, FileText } from "lucide-react"

type Patient = {
  id: string
  name: string
  phone: string | null
  cnic: string | null
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      let query = supabase.from("patients").select("id,name,phone,cnic").order("name", { ascending: true })
      if (q.trim()) {
        query = query.or(
          `name.ilike.%${q}%,cnic.ilike.%${q}%,phone.ilike.%${q}%`
        )
      }
      const { data, error } = await query
      if (!error && data) setPatients(data as Patient[])
      setLoading(false)
    }
    load()
  }, [q])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-600 mt-1">View and manage your patient records</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="medical-card p-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Search Patients</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, CNIC, or phone"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="medical-input pl-10"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Patient List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="medical-card overflow-hidden"
      >
        <div className="medical-table-header p-4">
          <h2 className="text-lg font-semibold text-gray-800">Patient Directory</h2>
          <p className="text-sm text-gray-600">Total: {patients.length} patients</p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <div className="text-gray-500">Loading patients...</div>
          </div>
        ) : patients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="medical-table-header">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-left p-4 font-semibold text-gray-700">CNIC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                <AnimatePresence>
                  {patients.map((p, index) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15, delay: index * 0.05 }}
                      className="medical-table-row hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <Link href={`/doctor/patients/${p.id}`} className="flex items-center gap-3 hover:text-blue-600 transition-colors">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">{p.name}</span>
                        </Link>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{p.phone ?? "—"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{p.cnic ?? "—"}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">👥</div>
            <div className="font-medium">No patients found</div>
            <div className="text-sm">No patients match your search criteria</div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
