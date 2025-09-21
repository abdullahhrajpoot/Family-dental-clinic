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

export default function DoctorInvoiceView() {
  const { id } = useParams() as { id: string }
  const [inv, setInv] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])

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

  if (!inv) return <p>Loading…</p>

  return (
    <Card className="max-w-3xl mx-auto p-6">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Invoice</CardTitle>
        <Button variant="outline" onClick={() => window.print()}>Print</Button>
      </CardHeader>

      <CardContent>
        {/* Patient & Invoice Info */}
        <div className="grid grid-cols-2 gap-4 border-b pb-3 mb-3">
          <div>
            <h2 className="font-semibold">Patient</h2>
            <p>{inv.patients?.name}</p>
            <p className="text-sm text-muted-foreground">Phone: {inv.patients?.phone ?? "—"}</p>
            <p className="text-sm text-muted-foreground">CNIC: {inv.patients?.cnic ?? "—"}</p>
          </div>
          <div>
            <h2 className="font-semibold">Details</h2>
            <p>Date: {inv.date_of_procedure}</p>
            <p>Doctor: {inv.practitioners?.name ?? "—"}</p>
            <p>Status: {inv.payment_status}</p>
          </div>
        </div>

        {/* Items Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((it, i) => (
              <TableRow key={i}>
                <TableCell>{it.description}</TableCell>
                <TableCell className="text-right">{it.qty}</TableCell>
                <TableCell className="text-right">Rs {(it.price_cents/100).toLocaleString()}</TableCell>
                <TableCell className="text-right">Rs {(it.line_total_cents/100).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Total */}
        <div className="flex items-center justify-end mt-4">
          <div className="text-lg font-semibold">Total: Rs {(inv.total_cents/100).toLocaleString()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
