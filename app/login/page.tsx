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
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import { motion } from "framer-motion"
import { Stethoscope, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
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
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen medical-gradient-light flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-100/50"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <Card className="medical-card p-8 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <div className="p-3 bg-blue-100 rounded-full">
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sign in to your dental clinic account
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="medical-input mt-2 h-12"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                    className="medical-input h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="medical-button w-full h-12 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </>
                  )}
                </Button>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center pt-4"
              >
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <a 
                    href="/signup" 
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  >
                    Create Account
                  </a>
                </p>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
