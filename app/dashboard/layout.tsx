// import Link from "next/link"


// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="min-h-screen grid grid-cols-[240px_1fr]">
//       <aside className="border-r p-4">
//         <h2 className="font-bold mb-4">Clinic Desk</h2>
//         <nav className="space-y-2 text-sm">
//           <Link href="/dashboard" className="block">Today</Link>
//           <Link href="/dashboard/patients" className="block">Patients</Link>
//           <Link href="/dashboard/appointments/new" className="block">Book</Link>
//           <Link href="/dashboard/invoices/new" className="block">Generate Bill</Link>
//           <Link href="/dashboard/invoices" className="block">Invoices</Link>
//           <Link href="/dashboard/reports" className="block">Reports</Link>
//         </nav>
//       </aside>
//       <main className="p-6">{children}</main>
//     </div>
//   )
// }



"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [ok,setOk]=useState(false)
  const r = useRouter()
  useEffect(()=>{(async()=>{
    const { data } = await supabase.auth.getUser()
    if(!data?.user) r.push("/login"); else setOk(true)
  })()},[r])

  if(!ok) return null
  const handleLogout = async () => {
    await supabase.auth.signOut()
    r.push("/login")
  }

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r p-4">
        <h2 className="font-bold mb-4">Clinic Desk</h2>
        <nav className="space-y-2 text-sm text-cyan-700 flex flex-col">
          <Link href="/dashboard">Today</Link>
          <Link href="/dashboard/patients">Patients</Link>
          <Link href="/dashboard/appointments/new">Book</Link>
          <Link href="/dashboard/invoices/new">Generate Bill</Link>
          <Link href="/dashboard/invoices">Invoices</Link>
          <Link href="/dashboard/reports">Reports</Link>
          <Link href="/" onClick={handleLogout}>Logout</Link>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  )
}
