// // "use client";

// // import { useState, useEffect } from "react";
// // import { supabase } from "@/lib/supabaseClient";

// // export default function InvoicesPage() {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [invoices, setInvoices] = useState<any[]>([]);

// //   useEffect(() => {
// //     fetchInvoices();
// //   }, [searchTerm]);

// //   async function fetchInvoices() {
// //     let query = supabase
// //       .from("invoices")
// //       .select("*, patients(name, cnic, phone)");

// //     if (searchTerm.trim() !== "") {
// //       query = query.or(
// //         `patients.name.ilike.%${searchTerm}%,patients.cnic.ilike.%${searchTerm}%,patients.phone.ilike.%${searchTerm}%`
// //       );
// //     }

// //     const { data, error } = await query;
// //     if (error) {
// //       console.error("Error fetching invoices:", error);
// //     } else {
// //       setInvoices(data || []);
// //     }
// //   }

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4">Invoices</h1>

// //       {/* Search bar */}
// //       <input
// //         type="text"
// //         placeholder="Search by Name, CNIC, or Phone"
// //         value={searchTerm}
// //         onChange={(e) => setSearchTerm(e.target.value)}
// //         className="border p-2 rounded w-full mb-4"
// //       />

// //       {/* Results */}
// //       {invoices.length === 0 ? (
// //         <p className="text-gray-500">No invoices found</p>
// //       ) : (
// //         <ul className="space-y-3">
// //           {invoices.map((invoice) => (
// //             <li
// //               key={invoice.id}
// //               className="p-4 border rounded shadow-sm flex justify-between"
// //             >
// //               <div>
// //                 <p className="font-semibold">{invoice.patients?.name}</p>
// //                 <p className="text-sm text-gray-600">
// //                   CNIC: {invoice.patients?.cnic || "N/A"} | Phone:{" "}
// //                   {invoice.patients?.phone || "N/A"}
// //                 </p>
// //               </div>
// //               <div className="text-right">
// //                 <p className="font-semibold">Amount: $ {invoice.total_cents}</p>
// //                 <p className="text-sm text-gray-600">
// //                   Date: {new Date(invoice.created_at).toLocaleDateString()}
// //                 </p>
// //               </div>
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // }
// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import Link from "next/link";

// export default function InvoicesPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [invoices, setInvoices] = useState<any[]>([]);
//   const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredInvoices(invoices);
//     } else {
//       const term = searchTerm.toLowerCase();
//       setFilteredInvoices(
//         invoices.filter((invoice) => {
//           const name = invoice.patients?.name?.toLowerCase() || "";
//           const cnic = invoice.patients?.cnic?.toLowerCase() || "";
//           const phone = invoice.patients?.phone?.toLowerCase() || "";
//           return (
//             name.includes(term) || cnic.includes(term) || phone.includes(term)
//           );
//         })
//       );
//     }
//   }, [searchTerm, invoices]);

//   async function fetchInvoices() {
//     const { data, error } = await supabase
//       .from("invoices")
//       .select("*, patients(name, cnic, phone)");

//     if (error) {
//       console.error("Error fetching invoices:", error);
//     } else {
//       setInvoices(data || []);
//       setFilteredInvoices(data || []);
//     }
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Invoices</h1>

//       {/* Search bar */}
//       <input
//         type="text"
//         placeholder="Search by Name, CNIC, or Phone"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="border p-2 rounded w-full mb-4"
//       />

//       {/* Results */}
//       {filteredInvoices.length === 0 ? (
//         <p className="text-gray-500">No invoices found</p>
//       ) : (
//         <ul className="space-y-3">
//           {filteredInvoices.map((invoice) => (
//             <li key={invoice.id}>
//               <Link
//                 href={`/dashboard/invoices/${invoice.id}`}
//                 className="block p-4 border rounded shadow-sm hover:bg-gray-100 transition"
//               >
//                 <div className="flex justify-between">
//                   <div>
//                     <p className="font-semibold">{invoice.patients?.name}</p>
//                     <p className="text-sm text-gray-600">
//                       CNIC: {invoice.patients?.cnic || "N/A"} | Phone:{" "}
//                       {invoice.patients?.phone || "N/A"}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold">
//                       Amount: $ {invoice.total_cents}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Date: {new Date(invoice.created_at).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }



"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { Search, Receipt, Plus, Calendar, DollarSign } from "lucide-react"

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [invoices, setInvoices] = useState<any[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([])

  useEffect(() => {
    fetchInvoices()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInvoices(invoices)
    } else {
      const term = searchTerm.toLowerCase()
      setFilteredInvoices(
        invoices.filter((invoice) => {
          const name = invoice.patients?.name?.toLowerCase() || ""
          const cnic = invoice.patients?.cnic?.toLowerCase() || ""
          const phone = invoice.patients?.phone?.toLowerCase() || ""
          return (
            name.includes(term) || cnic.includes(term) || phone.includes(term)
          )
        })
      )
    }
  }, [searchTerm, invoices])

  async function fetchInvoices() {
    const { data, error } = await supabase
      .from("invoices")
      .select("*, patients(name, cnic, phone)")

    if (error) {
      console.error("Error fetching invoices:", error)
    } else {
      setInvoices(data || [])
      setFilteredInvoices(data || [])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage billing and payment records</p>
        </div>
        <Button className="medical-button" asChild>
          <Link href="/dashboard/invoices/new">+ New Invoice</Link>
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="medical-card p-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Search Invoices</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by Name, CNIC, or Phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="medical-input pl-10"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Invoice List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="medical-card overflow-hidden"
      >
        <div className="medical-table-header p-4">
          <h2 className="text-lg font-semibold text-gray-800">Invoice Directory</h2>
          <p className="text-sm text-gray-600">Total: {filteredInvoices.length} invoices</p>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🧾</div>
            <div className="font-medium">No invoices found</div>
            <div className="text-sm">Start by creating your first invoice</div>
          </div>
        ) : (
          <div className="divide-y divide-blue-100">
            {filteredInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.05 }}
              >
                <Link href={`/dashboard/invoices/${invoice.id}`}>
                  <div className="medical-table-row p-4 hover:bg-blue-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Receipt className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {invoice.patients?.name || "Unknown Patient"}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                            <span>CNIC: {invoice.patients?.cnic || "N/A"}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Phone: {invoice.patients?.phone || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-green-600 text-lg">
                            Rs {(invoice.total_cents / 100).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(invoice.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
