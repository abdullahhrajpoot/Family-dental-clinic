// "use client"
// import { useEffect, useMemo, useState } from "react"
// import { supabase } from "@/lib/supabaseClient"

// type Patient = { id:string, name:string, phone:string|null }
// type Doctor = { id:string, name:string }
// type Service = { id:string, title:string, price_cents:number }

// export default function NewInvoice() {
//   const [patients,setPatients]=useState<Patient[]>([])
//   const [doctors,setDoctors]=useState<Doctor[]>([])
//   const [services,setServices]=useState<Service[]>([])
//   const [q,setQ]=useState("")
//   const [sel,setSel]=useState({ patientId:"", doctorId:"", date:new Date().toISOString().slice(0,10), payment_status:"Paid", payment_mode:"Cash", follow_up_date:"" })
//   const [items,setItems]=useState<{service_id:string|null, description:string, qty:number, price_cents:number}[]>([
//     { service_id: null, description:"", qty:1, price_cents:0 }
//   ])
//   const [saving,setSaving]=useState(false)

//   useEffect(()=>{ (async()=>{
//     const { data: d } = await supabase.from("practitioners").select("id,name").order("name")
//     const { data: s } = await supabase.from("services").select("id,title,price_cents").order("title")
//     setDoctors(d||[]); setServices(s||[])
//   })() },[])

//   async function searchPatients(){
//     const { data } = await supabase.from("patients").select("id,name,phone")
//       .or(`name.ilike.%${q}%,phone.ilike.%${q}%`).limit(10)
//     setPatients(data||[])
//   }

//   const totalCents = useMemo(()=> items.reduce((sum,i)=>sum + i.qty * i.price_cents,0),[items])

//   function setItem(idx:number, patch: Partial<typeof items[number]>) {
//     setItems(prev=>{
//       const clone = [...prev]
//       clone[idx] = { ...clone[idx], ...patch }
//       return clone
//     })
//   }

//   function addItem(){ setItems(prev=>[...prev,{service_id:null, description:"", qty:1, price_cents:0 }]) }
//   function removeItem(i:number){ setItems(prev=> prev.filter((_,idx)=>idx!==i)) }

//   async function save(){
//     if(!sel.patientId) { alert("Select patient"); return }
//     if(!sel.doctorId) { alert("Select doctor"); return }
//     if(items.length===0 || totalCents===0){ alert("Add at least one item"); return }
//     setSaving(true)
//     const { data: inv, error } = await supabase.from("invoices").insert({
//       patient_id: sel.patientId,
//       doctor_id: sel.doctorId,
//       date_of_procedure: sel.date,
//       payment_status: sel.payment_status,
//       payment_mode: sel.payment_mode,
//       follow_up_date: sel.follow_up_date || null,
//       total_cents: totalCents
//     }).select("id").single()
//     if(error){ setSaving(false); alert(error.message); return }
//     const invId = inv!.id
//     const payload = items.map(it=>({
//       invoice_id: invId,
//       service_id: it.service_id,
//       description: it.description || (services.find(s=>s.id===it.service_id)?.title ?? "Procedure"),
//       qty: it.qty,
//       price_cents: it.price_cents
//     }))
//     const { error: e2 } = await supabase.from("invoice_items").insert(payload)
//     setSaving(false)
//     if(e2){ alert(e2.message); return }
//     window.location.href = `/dashboard/invoices/${invId}`
//   }

//   return (
//     <div className="space-y-4 max-w-3xl">
//       <h1 className="text-xl font-semibold">Generate Bill</h1>

//       {/* Patient select */}
//       <div className="border p-3 rounded space-y-2">
//         <label className="font-medium">Patient</label>
//         <div className="flex gap-2">
//           <input className="border p-2 rounded w-full" placeholder="Search name/phone" value={q} onChange={e=>setQ(e.target.value)} />
//           <button onClick={searchPatients} className="px-3 py-2 border rounded">Search</button>
//           <a href="/dashboard/patients/new" className="px-3 py-2 border rounded">+ New Patient</a>
//         </div>
//         {patients.length>0 && (
//           <div className="border rounded divide-y mt-2">
//             {patients.map(p=>(
//               <button key={p.id} className={`w-full text-left p-2 ${sel.patientId===p.id?'bg-blue-50':''}`} onClick={()=>setSel(s=>({...s, patientId:p.id}))}>
//                 {p.name} · {p.phone ?? "—"}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Header fields */}
//       <div className="grid grid-cols-3 gap-3">
//         <select className="border p-2 rounded" value={sel.doctorId} onChange={e=>setSel(s=>({...s,doctorId:e.target.value}))}>
//           <option value="">Performed by (Doctor)</option>
//           {doctors.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
//         </select>
//         <input type="date" className="border p-2 rounded" value={sel.date} onChange={e=>setSel(s=>({...s,date:e.target.value}))}/>
//         <select className="border p-2 rounded" value={sel.payment_status} onChange={e=>setSel(s=>({...s,payment_status:e.target.value}))}>
//           <option>Paid</option><option>Pending</option>
//         </select>
//         <select className="border p-2 rounded" value={sel.payment_mode} onChange={e=>setSel(s=>({...s,payment_mode:e.target.value}))}>
//           <option>Cash</option><option>Card</option><option>Bank</option>
//         </select>
//         <input type="date" className="border p-2 rounded" placeholder="Follow-up date" value={sel.follow_up_date} onChange={e=>setSel(s=>({...s,follow_up_date:e.target.value}))}/>
//       </div>

//       {/* Items */}
//       <div className="space-y-2">
//         <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 font-medium text-sm">
//           <div>Description/Service</div><div>Qty</div><div>Price (Rs)</div><div></div>
//         </div>
//         {items.map((it,idx)=>(
//           <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2">
//             <div className="flex gap-2">
//               <select className="border p-2 rounded w-1/2" value={it.service_id ?? ""} onChange={e=>{
//                 const sid=e.target.value; const svc=services.find(s=>s.id===sid)
//                 setItem(idx,{ service_id: sid || null, description: svc?.title || it.description, price_cents: svc?.price_cents ?? it.price_cents })
//               }}>
//                 <option value="">Custom</option>
//                 {services.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}
//               </select>
//               <input className="border p-2 rounded w-full" placeholder="Description" value={it.description} onChange={e=>setItem(idx,{description:e.target.value})}/>
//             </div>
//             <input type="number" min={1} className="border p-2 rounded" value={it.qty} onChange={e=>setItem(idx,{qty:Number(e.target.value)})}/>
//             <input type="number" min={0} className="border p-2 rounded" value={Math.round(it.price_cents/100)} onChange={e=>setItem(idx,{price_cents: Number(e.target.value)*100})}/>
//             <button onClick={()=>removeItem(idx)} className="px-3 py-2 border rounded">Remove</button>
//           </div>
//         ))}
//         <button onClick={addItem} className="px-4 py-2 border rounded">+ Add Item</button>
//       </div>

//       {/* Total + Save */}
//       <div className="flex items-center justify-between border-t pt-4">
//         <div className="text-lg font-semibold">Total: Rs {(totalCents/100).toLocaleString()}</div>
//         <button disabled={saving} onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">
//           {saving ? "Saving…" : "Save & Print"}
//         </button>
//       </div>
//     </div>
//   )
// }
"use client"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

type Patient = { id: string; name: string; phone: string | null }
type Doctor = { id: string; name: string }
type Service = { id: string; title: string; price_cents: number }

export default function NewInvoice() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [q, setQ] = useState("")
  const [sel, setSel] = useState({
    patientId: "",
    doctorId: "",
    date: new Date().toISOString().slice(0, 10),
    payment_status: "Paid",
    payment_mode: "Cash",
    follow_up_date: "",
  })
  const [items, setItems] = useState<
    { service_id: string | null; description: string; qty: number; price_cents: number }[]
  >([{ service_id: null, description: "", qty: 1, price_cents: 0 }])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data: d } = await supabase
        .from("practitioners")
        .select("id,name")
        .order("name")
      const { data: s } = await supabase
        .from("services")
        .select("id,title,price_cents")
        .order("title")
      setDoctors(d || [])
      setServices(s || [])
    })()
  }, [])

  async function searchPatients() {
    const { data } = await supabase
      .from("patients")
      .select("id,name,phone")
      .or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
      .limit(10)
    setPatients(data || [])
  }

  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price_cents, 0),
    [items]
  )

  function setItem(idx: number, patch: Partial<typeof items[number]>) {
    setItems((prev) => {
      const clone = [...prev]
      clone[idx] = { ...clone[idx], ...patch }
      return clone
    })
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { service_id: null, description: "", qty: 1, price_cents: 0 },
    ])
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function save() {
    if (!sel.patientId) {
      toast.error("Select patient")
      return
    }
    if (!sel.doctorId) {
      toast.error("Select doctor")
      return
    }
    if (items.length === 0 || totalCents === 0) {
      toast.error("Add at least one item")
      return
    }
    setSaving(true)
    const { data: inv, error } = await supabase
      .from("invoices")
      .insert({
        patient_id: sel.patientId,
        doctor_id: sel.doctorId,
        date_of_procedure: sel.date,
        payment_status: sel.payment_status,
        payment_mode: sel.payment_mode,
        follow_up_date: sel.follow_up_date || null,
        total_cents: totalCents,
      })
      .select("id")
      .single()
    if (error) {
      setSaving(false)
      toast.error(error.message)
      return
    }
    const invId = inv!.id
    const payload = items.map((it) => ({
      invoice_id: invId,
      service_id: it.service_id,
      description:
        it.description ||
        services.find((s) => s.id === it.service_id)?.title ||
        "Procedure",
      qty: it.qty,
      price_cents: it.price_cents,
    }))
    const { error: e2 } = await supabase.from("invoice_items").insert(payload)
    setSaving(false)
    if (e2) {
      toast.error(e2.message)
      return
    }
    window.location.href = `/dashboard/invoices/${invId}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Bill</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Patient select */}
          <div className="space-y-2">
            <Label>Patient</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Search name/phone"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Button variant="outline" onClick={searchPatients}>
                Search
              </Button>
              <Button asChild variant="secondary">
                <a href="/dashboard/patients/new">+ New Patient</a>
              </Button>
            </div>
            {patients.length > 0 && (
              <div className="border rounded-md divide-y">
                {patients.map((p) => (
                  <Button
                    key={p.id}
                    variant={sel.patientId === p.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() =>
                      setSel((s) => ({ ...s, patientId: p.id }))
                    }
                  >
                    {p.name} · {p.phone ?? "—"}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Header fields */}
          <div className="grid grid-cols-3 gap-3">
            <Select
              value={sel.doctorId}
              onValueChange={(val) =>
                setSel((s) => ({ ...s, doctorId: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Performed by (Doctor)" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={sel.date}
              onChange={(e) =>
                setSel((s) => ({ ...s, date: e.target.value }))
              }
            />

            <Select
              value={sel.payment_status}
              onValueChange={(val) =>
                setSel((s) => ({ ...s, payment_status: val }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sel.payment_mode}
              onValueChange={(val) =>
                setSel((s) => ({ ...s, payment_mode: val }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Bank">Bank</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Follow-up date"
              value={sel.follow_up_date}
              onChange={(e) =>
                setSel((s) => ({ ...s, follow_up_date: e.target.value }))
              }
            />
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-3">
            <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 text-sm font-medium">
              <div>Description/Service</div>
              <div>Qty</div>
              <div>Price (Rs)</div>
              <div></div>
            </div>
            {items.map((it, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2"
              >
                <div className="flex gap-2">
                  <Select
                    value={it.service_id ?? "custom"}
                    onValueChange={(val) => {
                      if (val === "custom") {
                        setItem(idx, {
                          service_id: null,
                          description: "",
                          price_cents: 0,
                        })
                      } else {
                        const svc = services.find((s) => s.id === val)
                        setItem(idx, {
                          service_id: val,
                          description: svc?.title || it.description,
                          price_cents: svc?.price_cents ?? it.price_cents,
                        })
                      }
                    }}
                  >
                    <SelectTrigger className="w-1/2">
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom</SelectItem>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Description"
                    value={it.description}
                    onChange={(e) =>
                      setItem(idx, { description: e.target.value })
                    }
                  />
                </div>
                <Input
                  type="number"
                  min={1}
                  value={it.qty}
                  onChange={(e) =>
                    setItem(idx, { qty: Number(e.target.value) })
                  }
                />
                <Input
                  type="number"
                  min={0}
                  value={Math.round(it.price_cents / 100)}
                  onChange={(e) =>
                    setItem(idx, {
                      price_cents: Number(e.target.value) * 100,
                    })
                  }
                />
                <Button
                  variant="destructive"
                  onClick={() => removeItem(idx)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addItem}>
              + Add Item
            </Button>
          </div>

          <Separator />

          {/* Total + Save */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">
              Total: Rs {(totalCents / 100).toLocaleString()}
            </div>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save & Print"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
