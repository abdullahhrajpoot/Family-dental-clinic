import Link from "next/link"
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-blue-600">Clinic Management System</h1>
      <p className="mt-2 text-gray-700">Welcome! Please login to continue.</p>
      <Link href="/login" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Login
      </Link>
      <Link href="/signup" className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Signup</Link>
    </main>
  )
}
// import Link from "next/link"
// import {Button} from "@/components/ui/button"
// import {Card} from "@/components/ui/card"
// import { motion } from "framer-motion"

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-slate-50">
//       <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
//         <Card className="p-8 text-center">
//           <h1 className="text-3xl font-bold text-blue-600">Clinic Management System</h1>
//           <p className="mt-2 text-gray-700">Welcome! Please login to continue.</p>

//           <div className="mt-6 flex justify-center gap-3">
//             <Link href="/login" legacyBehavior>
//               <a>
//                 <Button className="px-4 py-2">Login</Button>
//               </a>
//             </Link>

//             <Link href="/signup" legacyBehavior>
//               <a>
//                 <Button className="px-4 py-2" variant="secondary">
//                   Signup
//                 </Button>
//               </a>
//             </Link>
//           </div>
//         </Card>
//       </motion.div>
//     </main>
//   )
// }
