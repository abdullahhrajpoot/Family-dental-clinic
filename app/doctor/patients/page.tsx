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
import { Loader2 } from "lucide-react"

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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Patients</h1>

      {/* Search Input */}
      <Input
        placeholder="Search by name, CNIC, or phone"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Patient List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center p-6 text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading patients…
            </div>
          ) : (
            <>
              {/* Header Row */}
              <div className="grid grid-cols-3 p-3 bg-muted font-medium text-sm border-b">
                <div>Name</div>
                <div>Phone</div>
                <div>CNIC</div>
              </div>

              {/* Patients List */}
              <AnimatePresence>
                {patients.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={`/doctor/patients/${p.id}`}
                      className="grid grid-cols-3 p-3 border-b hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <div>{p.name}</div>
                      <div>{p.phone ?? "—"}</div>
                      <div>{p.cnic ?? "—"}</div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty State */}
              {patients.length === 0 && (
                <div className="p-6 text-sm text-center text-muted-foreground">
                  No patients found.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
