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
import { Printer, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function InvoiceView({ params }: { params: { id: string } }) {
  const [inv, setInv] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])

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

  if (!inv) return <p className="p-6 text-muted-foreground">Loading…</p>

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto p-6"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Clinic Invoice</CardTitle>
            <CardDescription>
              Lahore · +92-000-0000000
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" /> Print
          </Button>
        </CardHeader>

        <CardContent>
          {/* Patient & Details */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="font-semibold mb-1">Patient</h2>
              <p>{inv.patients?.name}</p>
              <p className="text-sm text-muted-foreground">
                Phone: {inv.patients?.phone ?? "—"} · CNIC:{" "}
                {inv.patients?.cnic ?? "—"}
              </p>
            </div>
            <div>
              <h2 className="font-semibold mb-1">Details</h2>
              <p>Date: {inv.date_of_procedure}</p>
              <p>Doctor: {inv.practitioners?.name ?? "—"}</p>
              <p>
                Status:{" "}
                <span
                  className={
                    inv.payment_status === "Paid"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {inv.payment_status}
                </span>
              </p>
              <p>Mode: {inv.payment_mode ?? "—"}</p>
              {inv.follow_up_date && <p>Follow-up: {inv.follow_up_date}</p>}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price (Rs)</TableHead>
                <TableHead className="text-right">Line Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it, idx) => (
                <TableRow key={idx}>
                  <TableCell>{it.description}</TableCell>
                  <TableCell className="text-right">{it.qty}</TableCell>
                  <TableCell className="text-right">
                    {Math.round(it.price_cents / 100).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {Math.round(it.line_total_cents / 100).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-6">
            <div className="text-lg font-semibold">
              Total: Rs {(inv.total_cents / 100).toLocaleString()}
            </div>
            {inv.payment_status !== "Paid" && (
              <Button
                onClick={markPaid}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" /> Mark as Paid
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
