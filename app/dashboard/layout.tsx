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
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Calendar, 
  Users, 
  Plus, 
  FileText, 
  Receipt, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Stethoscope
} from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const r = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser()
      if (!data?.user) r.push("/login")
      else setOk(true)
    })()
  }, [r])

  if (!ok) return null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    r.push("/login")
  }

  const navItems = [
    { href: "/dashboard", label: "Today", icon: Calendar },
    { href: "/dashboard/patients", label: "Patients", icon: Users },
    { href: "/dashboard/appointments/new", label: "Book", icon: Plus },
    { href: "/dashboard/invoices/new", label: "Generate Bill", icon: FileText },
    { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
    { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen medical-gradient-light">
      {/* Mobile Header */}
      <div className="lg:hidden medical-nav p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white font-bold text-lg">Clinic Desk</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="fixed lg:relative lg:translate-x-0 z-50 lg:z-auto w-70 h-full medical-sidebar border-r border-blue-200 p-4 lg:p-6"
            >
              <div className="hidden lg:block mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="font-bold text-xl text-gray-800">Clinic Desk</h2>
                </div>
                <p className="text-sm text-gray-600">Receptionist Dashboard</p>
              </div>

              <nav className="space-y-2">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href || 
                    (item.href !== "/dashboard" && pathname.startsWith(item.href) && 
                     !(item.href === "/dashboard/invoices" && pathname.startsWith("/dashboard/invoices/new")))
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`medical-sidebar-item flex items-center gap-3 transition-colors ${
                          isActive 
                            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                          />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  className="pt-4 border-t border-blue-200"
                >
                  <button
                    onClick={handleLogout}
                    className="medical-sidebar-item flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </motion.div>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
