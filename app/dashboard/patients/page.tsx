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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <h1 className="text-xl font-semibold">Patients</h1>

      <div className="flex gap-2">
        <Input
          value={q}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
          placeholder="Search name / phone / CNIC"
          className="w-full"
        />
        <Button onClick={search}>Search</Button>
        <Button variant="outline" asChild>
          <a href="/dashboard/patients/new">+ Add New</a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : rows.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>CNIC</TableHead>
                  <TableHead>File #</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p.id} >
                   
                    <Link href={`/dashboard/patients/${p.id}`}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.phone ?? "-"}</TableCell>
                      <TableCell>{p.cnic ?? "-"}</TableCell>
                      <TableCell>{p.file_number ?? "-"}</TableCell>
                    </Link>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-gray-500">No patients yet.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
