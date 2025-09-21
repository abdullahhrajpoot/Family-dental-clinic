// "use client"
// import { useEffect, useState } from "react"
// import { useParams } from "next/navigation"
// import { supabase } from "@/lib/supabaseClient"

// export default function DoctorInvoiceView() {
//   const { id } = useParams() as { id: string }
//   const [inv, setInv] = useState<any>(null)
//   const [items, setItems] = useState<any[]>([])

//   useEffect(()=>{ (async ()=>{
//     const { data: i } = await supabase
//       .from("invoices")
//       .select("*, patients(name,phone,cnic), practitioners:doctor_id(name)")
//       .eq("id", id).single()
//     setInv(i)
//     const { data: it } = await supabase.from("invoice_items").select("*").eq("invoice_id", id)
//     setItems(it || [])
//   })() }, [id])

//   if(!inv) return <p>Loading…</p>

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h1 className="text-2xl font-bold">Invoice</h1>
//           <p className="text-sm text-gray-600">Clinic</p>
//         </div>
//         <button onClick={()=>window.print()} className="border px-3 py-2 rounded">Print</button>
//       </div>

//       {/* patient / invoice details */}
//       <div className="grid grid-cols-2 gap-4 border-b pb-3 mb-3">
//         <div>
//           <h2 className="font-semibold">Patient</h2>
//           <p>{inv.patients?.name}</p>
//           <p className="text-sm text-gray-600">Phone: {inv.patients?.phone ?? "—"}</p>
//         </div>
//         <div>
//           <h2 className="font-semibold">Details</h2>
//           <p>Date: {inv.date_of_procedure}</p>
//           <p>Doctor: {inv.practitioners?.name ?? "—"}</p>
//           <p>Status: {inv.payment_status}</p>
//         </div>
//       </div>

//       <table className="w-full border mb-4">
//         <thead className="bg-gray-50">
//           <tr><th className="p-2 border text-left">Description</th><th className="p-2 border text-right">Qty</th><th className="p-2 border text-right">Price</th><th className="p-2 border text-right">Total</th></tr>
//         </thead>
//         <tbody>
//           {items.map((it, i)=>(
//             <tr key={i}>
//               <td className="p-2 border">{it.description}</td>
//               <td className="p-2 border text-right">{it.qty}</td>
//               <td className="p-2 border text-right">{(it.price_cents/100).toLocaleString()}</td>
//               <td className="p-2 border text-right">{(it.line_total_cents/100).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex items-center justify-between">
//         <div></div>
//         <div className="text-lg font-semibold">Total: Rs {(inv.total_cents/100).toLocaleString()}</div>
//       </div>
//     </div>
//   )
// }



"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Printer, CheckCircle2, Receipt, User, Calendar, Stethoscope, CreditCard, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DoctorInvoiceView() {
  const params = useParams()
  const id = params.id as string
  const [inv, setInv] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    (async () => {
      const { data: i } = await supabase
        .from("invoices")
        .select("*, patients(name,phone,cnic), practitioners:doctor_id(name)")
        .eq("id", id)
        .single()
      setInv(i)

      const { data: it } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", id)

      setItems(it || [])
    })()
  }, [id])

  if (!inv) {
    return (
      <div className="min-h-screen medical-gradient-light flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="medical-card p-8 text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice details...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen medical-gradient-light p-4 print:p-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Print Header */}
        <div className="hidden print:block mb-8">
          <div className="text-center border-b-2 border-blue-200 pb-4">
            <h1 className="text-3xl font-bold text-blue-800">Family Dental Clinic</h1>
            <p className="text-gray-600 mt-2">Professional Dental Care Services</p>
            <p className="text-sm text-gray-500">Invoice #INV-{inv.id}</p>
          </div>
        </div>

        {/* Main Invoice Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="medical-card p-8 print:p-6"
        >
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 print:mb-6">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Receipt className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
                <p className="text-gray-600">Invoice #INV-{inv.id}</p>
                <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                inv.payment_status === 'Paid' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {inv.payment_status}
              </div>
            </div>
          </div>

          {/* Patient & Invoice Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:mb-6">
            {/* Patient Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Patient Information</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{inv.patients?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{inv.patients?.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CNIC</p>
                  <p className="font-medium text-gray-900">{inv.patients?.cnic || "—"}</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Invoice Details</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Date of Procedure</p>
                  <p className="font-medium text-gray-900">{inv.date_of_procedure || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-medium text-gray-900">{inv.practitioners?.name || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Mode</p>
                  <p className="font-medium text-gray-900">{inv.payment_mode || "—"}</p>
                </div>
                {inv.follow_up_date && (
                  <div>
                    <p className="text-sm text-gray-600">Follow-up Date</p>
                    <p className="font-medium text-gray-900">{inv.follow_up_date}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-8 print:mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Stethoscope className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Services Provided</h3>
            </div>
            
            <div className="medical-table overflow-hidden">
              <table className="w-full">
                <thead className="medical-table-header">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Description</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Qty</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Price (Rs)</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {items.map((it, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: idx * 0.05 }}
                      className="medical-table-row hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-4 text-gray-900">{it.description}</td>
                      <td className="p-4 text-right text-gray-700">{it.qty}</td>
                      <td className="p-4 text-right text-gray-700">
                        {Math.round(it.price_cents / 100).toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-medium text-gray-900">
                        {Math.round(it.line_total_cents / 100).toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Section */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg print:bg-white print:border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Total Amount</h3>
                  <p className="text-sm text-gray-600">Payment due upon receipt</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  Rs {(inv.total_cents / 100).toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Including all services</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 print:hidden">
            <Button
              onClick={() => window.print()}
              className="medical-button flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </Button>
            
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="medical-button flex-1 sm:flex-none border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Invoices
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
