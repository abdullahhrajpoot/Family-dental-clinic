// "use client"

// import { useState } from "react"
// import { supabase } from "@/lib/supabaseClient"
// import { useRouter } from "next/navigation"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const router = useRouter()

//   async function handleLogin(e: React.FormEvent) {
//     e.preventDefault()
//     setError("")

//     // Sign in
//     const { error } = await supabase.auth.signInWithPassword({ email, password })
//     if (error) {
//       setError(error.message)
//       return
//     }

//     // Get user
//     const { data: userData } = await supabase.auth.getUser()
//     const user = userData?.user
//     if (!user) {
//       setError("Login failed. Please try again.")
//       return
//     }

//     // Check practitioners table
//     const { data: practitioner } = await supabase
//       .from("practitioners")
//       .select("id")
//       .eq("user_id", user.id)
//       .maybeSingle()

//     // Set role
//     const role = practitioner ? "doctor" : "receptionist"

//     // Store cookie for middleware
//     document.cookie = `userType=${role}; path=/; max-age=3600;`

//     // Redirect
//     if (role === "doctor") {
//       router.push("/doctor")
//     } else {
//       router.push("/dashboard")
//     }
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-xl font-bold mb-4">Login</h1>
//       <form onSubmit={handleLogin} className="flex flex-col space-y-2 w-64">
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="border p-2 rounded"
//         />
//         <button type="submit" className="bg-green-500 text-white py-2 rounded">
//           Login
//         </button>
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//       </form>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import {Card} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    // Sign in
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      return
    }

    // Get user
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) {
      setError("Login failed. Please try again.")
      return
    }

    // Check practitioners table
    const { data: practitioner } = await supabase
      .from("practitioners")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()

    // Set role
    const role = practitioner ? "doctor" : "receptionist"

    // Store cookie for middleware
    document.cookie = `userType=${role}; path=/; max-age=3600;`

    // Redirect
    if (role === "doctor") {
      router.push("/doctor")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-md"
      >
        <Card className="p-6">
          <h1 className="text-2xl font-semibold mb-4 text-center">Login</h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <div>
              <Label> Email </Label>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label> Password </Label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button type="submit" className="mt-2 w-full">
              Login
            </Button>

            {error && <p className="text-red-500 text-sm text-center mt-1">{error}</p>}
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
