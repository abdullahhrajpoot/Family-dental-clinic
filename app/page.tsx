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
