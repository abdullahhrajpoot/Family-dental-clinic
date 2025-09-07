"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [practitioner, setPractitioner] = useState<{ id: string; name: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      if (!user) { router.push("/login"); return }
      // find practitioner by user_id (requires practitioners.user_id to be populated)
      const { data: prac } = await supabase
        .from("practitioners")
        .select("id,name")
        .eq("user_id", user.id)
        .limit(1)
        .single()
      if (mounted) {
        if (!prac) {
          // not a doctor account — redirect or show friendly message
          router.push("/dashboard") // back to receptionist or home
        } else {
          setPractitioner(prac)
        }
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [router])
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }
  if (loading) return null

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="border-r p-4">
        <h2 className="font-bold mb-4">Doctor Dashboard</h2>
        <div className="mb-4 text-sm">Dr. {practitioner?.name}</div>
        <nav className="space-y-2 text-sm">
          <Link href="/doctor" className="block">Today</Link>
          <Link href="/doctor/appointments" className="block">Appointments</Link>
          <Link href="/doctor/patients" className="block">Patients</Link>
          <Link href="/doctor/reports" className="block">Reports</Link>
          <Link href="/" onClick={handleLogout}>Logout</Link>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  )
}
