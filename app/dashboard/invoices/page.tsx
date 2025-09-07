"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    fetchInvoices();
  }, [searchTerm]);

  async function fetchInvoices() {
    let query = supabase
      .from("invoices")
      .select("*, patients(name, cnic, phone)");

    if (searchTerm.trim() !== "") {
      query = query.or(
        `patients.name.ilike.%${searchTerm}%,patients.cnic.ilike.%${searchTerm}%,patients.phone.ilike.%${searchTerm}%`
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching invoices:", error);
    } else {
      setInvoices(data || []);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by Name, CNIC, or Phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Results */}
      {invoices.length === 0 ? (
        <p className="text-gray-500">No invoices found</p>
      ) : (
        <ul className="space-y-3">
          {invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="p-4 border rounded shadow-sm flex justify-between"
            >
              <div>
                <p className="font-semibold">{invoice.patients?.name}</p>
                <p className="text-sm text-gray-600">
                  CNIC: {invoice.patients?.cnic || "N/A"} | Phone:{" "}
                  {invoice.patients?.phone || "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Amount: $ {invoice.total_cents}</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(invoice.created_at).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
