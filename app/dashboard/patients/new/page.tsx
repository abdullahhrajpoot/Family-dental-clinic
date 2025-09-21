// "use client"
// import { useState } from "react"
// import { supabase } from "@/lib/supabaseClient"
// import { useRouter } from "next/navigation"

// export default function NewPatient() {
//   const r = useRouter()
//   const [form, setForm] = useState({ name:"", phone:"", cnic:"", dob:"", gender:"", notes:"" })
//   const [loading, setLoading] = useState(false)
//   const [err, setErr] = useState<string | null>(null)

//   async function submit(e: React.FormEvent) {
//     e.preventDefault()
//     setLoading(true); setErr(null)
//     const { data, error } = await supabase.from("patients").insert({
//       name: form.name, phone: form.phone || null, cnic: form.cnic || null,
//       dob: form.dob ? form.dob : null, gender: form.gender || null, notes: form.notes || null
//     }).select("id").single()
//     setLoading(false)
//     if (error) { setErr(error.message); return }
//     r.push(`/dashboard/patients/${data!.id}`)
//   }

//   function upd(k: string, v: string){ setForm(prev=>({ ...prev, [k]: v })) }

//   return (
//     <div className="max-w-xl">
//       <h1 className="text-xl font-semibold mb-4">Add New Patient</h1>
//       <form onSubmit={submit} className="space-y-3">
//         <input className="border p-2 rounded w-full" placeholder="Full Name *" value={form.name} onChange={e=>upd("name", e.target.value)} required/>
//         <div className="grid grid-cols-2 gap-3">
//           <input className="border p-2 rounded" placeholder="Phone" value={form.phone} onChange={e=>upd("phone", e.target.value)}/>
//           <input className="border p-2 rounded" placeholder="CNIC" value={form.cnic} onChange={e=>upd("cnic", e.target.value)}/>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <input type="date" className="border p-2 rounded" value={form.dob} onChange={e=>upd("dob", e.target.value)}/>
//           <select className="border p-2 rounded" value={form.gender} onChange={e=>upd("gender", e.target.value)}>
//             <option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option>
//           </select>
//         </div>
//         <textarea className="border p-2 rounded w-full" placeholder="Notes" value={form.notes} onChange={e=>upd("notes", e.target.value)} />
//         <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? "Saving…" : "Save Patient"}</button>
//         {err && <p className="text-red-600 text-sm">{err}</p>}
//       </form>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { UserPlus, User, Phone, FileText, Calendar, Users, FileEdit, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPatient() {
  const r = useRouter()
  const [form, setForm] = useState({
    name: "",
    phone: "",
    cnic: "",
    dob: "",
    gender: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr(null)
    const { data, error } = await supabase
      .from("patients")
      .insert({
        name: form.name,
        phone: form.phone || null,
        cnic: form.cnic || null,
        dob: form.dob ? form.dob : null,
        gender: form.gender || null,
        notes: form.notes || null,
      })
      .select("id")
      .single()
    setLoading(false)
    if (error) {
      setErr(error.message)
      return
    }
    r.push(`/dashboard/patients/${data!.id}`)
  }

  function upd(k: string, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Patient</h1>
          <p className="text-gray-600 mt-1">Create a new patient record in the system</p>
        </div>
        <Link 
          href="/dashboard/patients" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patients
        </Link>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="medical-card p-6"
      >
        <form onSubmit={submit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
            </div>

            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
                Full Name *
              </Label>
              <Input
                id="name"
                placeholder="Enter patient's full name"
                value={form.name}
                onChange={(e) => upd("name", e.target.value)}
                required
                className="medical-input h-12"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1 block">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={(e) => upd("phone", e.target.value)}
                    className="medical-input h-12 pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cnic" className="text-sm font-medium text-gray-700 mb-1 block">
                  CNIC
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="cnic"
                    placeholder="Enter CNIC number"
                    value={form.cnic}
                    onChange={(e) => upd("cnic", e.target.value)}
                    className="medical-input h-12 pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Additional Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dob" className="text-sm font-medium text-gray-700 mb-1 block">
                  Date of Birth
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="dob"
                    type="date"
                    value={form.dob}
                    onChange={(e) => upd("dob", e.target.value)}
                    className="medical-input h-12 pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700 mb-1 block">
                  Gender
                </Label>
                <select
                  id="gender"
                  className="medical-input h-12 w-full"
                  value={form.gender}
                  onChange={(e) => upd("gender", e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700 mb-1 block">
                Medical Notes
              </Label>
              <div className="relative">
                <FileEdit className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <Textarea
                  id="notes"
                  placeholder="Enter any medical notes or additional information"
                  value={form.notes}
                  onChange={(e) => upd("notes", e.target.value)}
                  className="medical-input pl-10 min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button 
              disabled={loading} 
              type="submit" 
              className="medical-button h-12 text-lg font-semibold flex items-center justify-center gap-2 flex-1"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Patient...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Save Patient
                </>
              )}
            </Button>
            <Link href="/dashboard/patients">
              <Button 
                type="button" 
                variant="outline" 
                className="h-12 px-8 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Cancel
              </Button>
            </Link>
          </motion.div>

          {err && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
            >
              <div className="w-4 h-4 bg-red-200 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-xs">!</span>
              </div>
              {err}
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  )
}
