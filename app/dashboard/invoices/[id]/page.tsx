// "use client"
// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabaseClient"

// export default function InvoiceView({ params }:{ params:{ id:string }}) {
//   const [inv,setInv]=useState<any>(null)
//   const [items,setItems]=useState<any[]>([])

//   useEffect(()=>{(async()=>{
//     const { data: i } = await supabase
//       .from("invoices")
//       .select("id, date_of_procedure, payment_status, payment_mode, follow_up_date, total_cents, patients(name,phone,cnic), practitioners:doctor_id(name)")
//       .eq("id", params.id).single()
//     setInv(i)
//     const { data: it } = await supabase.from("invoice_items").select("description,qty,price_cents,line_total_cents").eq("invoice_id", params.id)
//     setItems(it||[])
//   })()},[params.id ])

//   async function markPaid(){
//     await supabase.from("invoices").update({ payment_status: 'Paid' }).eq("id", params.id)
//     setInv((p:any)=> ({...p, payment_status:'Paid'}))
//   }

//   if(!inv) return <p>Loading…</p>

//   return (
//     <div className="max-w-3xl mx-auto bg-white p-6">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h1 className="text-2xl font-bold">Clinic Invoice</h1>
//           <p className="text-sm text-gray-600">Lahore · +92-000-0000000</p>
//         </div>
//         <button onClick={()=>window.print()} className="border px-3 py-2 rounded">🖨 Print</button>
//       </div>

//       <div className="grid grid-cols-2 gap-4 border-b pb-3 mb-3">
//         <div>
//           <h2 className="font-semibold">Patient</h2>
//           <p>{inv.patients?.name}</p>
//           <p className="text-sm text-gray-600">Phone: {inv.patients?.phone ?? "—"} · CNIC: {inv.patients?.cnic ?? "—"}</p>
//         </div>
//         <div>
//           <h2 className="font-semibold">Details</h2>
//           <p>Date: {inv.date_of_procedure}</p>
//           <p>Doctor: {inv.practitioners?.name ?? "—"}</p>
//           <p>Status: <span className={inv.payment_status==='Paid' ? 'text-green-600' : 'text-red-600'}>{inv.payment_status}</span></p>
//           <p>Mode: {inv.payment_mode ?? "—"}</p>
//           {inv.follow_up_date && <p>Follow-up: {inv.follow_up_date}</p>}
//         </div>
//       </div>

//       <table className="w-full border mb-4">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="text-left p-2 border">Description</th>
//             <th className="text-right p-2 border">Qty</th>
//             <th className="text-right p-2 border">Price (Rs)</th>
//             <th className="text-right p-2 border">Line Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           {items.map((it,idx)=>(
//             <tr key={idx}>
//               <td className="p-2 border">{it.description}</td>
//               <td className="p-2 border text-right">{it.qty}</td>
//               <td className="p-2 border text-right">{Math.round(it.price_cents/100).toLocaleString()}</td>
//               <td className="p-2 border text-right">{Math.round(it.line_total_cents/100).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex items-center justify-between">
//         <div className="text-lg font-semibold">Total: Rs {(inv.total_cents/100).toLocaleString()}</div>
//         {inv.payment_status!=='Paid' && (
//           <button onClick={markPaid} className="bg-green-600 text-white px-4 py-2 rounded">Mark as Paid</button>
//         )}
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Printer, CheckCircle2, Receipt, User, Calendar, Stethoscope, CreditCard, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function InvoiceView({ params }: { params: { id: string } }) {
  const [inv, setInv] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const { data: i } = await supabase
        .from("invoices")
        .select(
          "id, date_of_procedure, payment_status, payment_mode, follow_up_date, total_cents, patients(name,phone,cnic), practitioners:doctor_id(name)"
        )
        .eq("id", params.id)
        .single()
      setInv(i)

      const { data: it , error } = await supabase
        .from("invoice_items")
        .select("description,qty,price_cents,line_total_cents")
        .eq("invoice_id", params.id)
        console.log(it, error);
      setItems(it || [])
    })()
  }, [params.id])

  async function markPaid() {
    await supabase
      .from("invoices")
      .update({ payment_status: "Paid" })
      .eq("id", params.id)
    setInv((p: any) => ({ ...p, payment_status: "Paid" }))
  }

  if (!inv) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading invoice...</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Invoice Details</h1>
          <p className="text-gray-600 mt-1">View and manage invoice information</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
          {inv.payment_status !== "Paid" && (
            <Button
              onClick={markPaid}
              className="medical-button flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark as Paid
            </Button>
          )}
        </div>
      </motion.div>

      {/* Invoice Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="medical-card p-8 print:shadow-none print:border-0"
      >
        {/* Invoice Header */}
        <div className="text-center mb-8 print:mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-full">
              <Receipt className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Family Dental Clinic</h2>
          </div>
          <p className="text-gray-600">Professional Dental Care Services</p>
          <p className="text-sm text-gray-500">Lahore · +92-000-0000000</p>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 print:mb-6">
          {/* Patient Info */}
          <div className="bg-blue-50 p-6 rounded-lg print:bg-white print:border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Patient Information</h3>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{inv.patients?.name}</p>
              <p className="text-sm text-gray-600">
                Phone: {inv.patients?.phone ?? "—"}
              </p>
              <p className="text-sm text-gray-600">
                CNIC: {inv.patients?.cnic ?? "—"}
              </p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-green-50 p-6 rounded-lg print:bg-white print:border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Invoice Details</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date:</span> {inv.date_of_procedure}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Doctor:</span> {inv.practitioners?.name ?? "—"}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    inv.payment_status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {inv.payment_status}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Payment Mode:</span> {inv.payment_mode ?? "—"}
              </p>
              {inv.follow_up_date && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Follow-up:</span> {inv.follow_up_date}
                </p>
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
          
          {inv.payment_status !== "Paid" && (
            <Button
              onClick={markPaid}
              className="medical-button flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark as Paid
            </Button>
          )}
          
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
    </div>
  )
}
