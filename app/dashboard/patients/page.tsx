// "use client"
// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabaseClient"

// type Patient = {
//   id: string
//   name: string
//   phone: string | null
//   cnic: string | null
//   file_number: string | null
// }

// export default function PatientsPage() {
//   const [q, setQ] = useState("")
//   const [rows, setRows] = useState<Patient[]>([])
//   const [loading, setLoading] = useState(false)

//   async function search() {
//     setLoading(true)
//     let query = supabase.from("patients").select("id,name,phone,cnic,file_number").order("created_at", { ascending: false }).limit(50)
//     if (q.trim()) {
//       query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%,cnic.ilike.%${q}%`)
//     }
//     const { data } = await query
//     setRows((data || []) as any)
//     setLoading(false)
//   }

//   useEffect(() => { search() }, []) // initial

//   return (
//     <div className="space-y-4">
//       <h1 className="text-xl font-semibold">Patients</h1>
//       <div className="flex gap-2">
//         <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search name / phone / CNIC" className="border p-2 rounded w-full"/>
//         <button onClick={search} className="bg-blue-600 text-white px-4 rounded">Search</button>
//         <a href="/dashboard/patients/new" className="px-4 py-2 border rounded">+ Add New</a>
//       </div>
//       <div className="border rounded">
//         <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50 font-medium">
//           <div>Name</div><div>Phone</div><div>CNIC</div><div>File #</div>
//         </div>
//         {loading && <div className="p-4 text-sm">Loading…</div>}
//         {rows.map(p=>(
//           <a key={p.id} href={`/dashboard/patients/${p.id}`} className="grid grid-cols-4 gap-2 p-2 border-t hover:bg-gray-50">
//             <div>{p.name}</div><div>{p.phone ?? "-"}</div><div>{p.cnic ?? "-"}</div><div>{p.file_number ?? "-"}</div>
//           </a>
//         ))}
//         {(!loading && rows.length===0) && <div className="p-4 text-sm text-gray-500">No patients yet.</div>}
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

type Patient = {
  id: string
  name: string
  phone: string | null
  cnic: string | null
  file_number: string | null
}

export default function PatientsPage() {
  const [q, setQ] = useState("")
  const [rows, setRows] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)

  async function search() {
    setLoading(true)
    let query = supabase
      .from("patients")
      .select("id,name,phone,cnic,file_number")
      .order("created_at", { ascending: false })
      .limit(50)

    if (q.trim()) {
      query = query.or(
        `name.ilike.%${q}%,phone.ilike.%${q}%,cnic.ilike.%${q}%`
      )
    }
    const { data } = await query
    setRows((data || []) as any)
    setLoading(false)
  }

  useEffect(() => {
    search()
  }, [])

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage patient records and information</p>
        </div>
        <Button className="medical-button" asChild>
          <Link href="/dashboard/patients/new">+ Add New Patient</Link>
        </Button>
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
            <Input
              value={q}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
              placeholder="Search by name, phone, or CNIC"
              className="medical-input"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={search} className="medical-button">
              Search
            </Button>
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
          <p className="text-sm text-gray-600">Total: {rows.length} patients</p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <div className="text-gray-500">Loading patients...</div>
          </div>
        ) : rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="medical-table-header">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-left p-4 font-semibold text-gray-700">CNIC</th>
                  <th className="text-left p-4 font-semibold text-gray-700">File #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {rows.map((p, index) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.05 }}
                    className="medical-table-row hover:bg-blue-50/50 transition-colors"
                  >
                      <td className="p-4">
                        <Link href={`/dashboard/patients/${p.id}`} className="flex items-center gap-3 hover:text-blue-600 transition-colors">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {p.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{p.name}</span>
                        </Link>
                      </td>
                      <td className="p-4 text-gray-700">{p.phone ?? "-"}</td>
                      <td className="p-4 text-gray-700">{p.cnic ?? "-"}</td>
                      <td className="p-4 text-gray-700">{p.file_number ?? "-"}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">👥</div>
            <div className="font-medium">No patients found</div>
            <div className="text-sm">Start by adding your first patient</div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
