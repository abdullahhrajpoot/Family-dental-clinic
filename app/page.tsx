"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  FileText, 
  BarChart3, 
  Shield,
  Clock,
  Heart,
  ArrowRight,
  CheckCircle
} from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Efficient booking system with real-time availability"
    },
    {
      icon: Users,
      title: "Patient Management",
      description: "Complete patient records and history tracking"
    },
    {
      icon: FileText,
      title: "Digital Invoicing",
      description: "Professional billing with multiple payment options"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Comprehensive insights and revenue tracking"
    }
  ]

  const stats = [
    { number: "500+", label: "Patients Served" },
    { number: "1000+", label: "Appointments Booked" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "System Availability" }
  ]

  return (
    <div className="min-h-screen medical-gradient-light">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-100/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                  <Stethoscope className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                Family Dental
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Clinic Management
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Streamline your dental practice with our comprehensive management system. 
                From appointment scheduling to patient records, we've got you covered.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link 
                href="/login" 
                className="group medical-button px-8 py-4 text-lg font-semibold flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/signup" 
                className="px-8 py-4 text-lg font-semibold text-blue-600 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Create Account
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Practice
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive system handles all aspects of your dental practice management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="medical-card p-6 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of dental professionals who trust our system
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login" 
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Start Free Trial
              </Link>
              <Link 
                href="/signup" 
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-blue-600 rounded-full">
                <Heart className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Family Dental Clinic</h3>
            <p className="text-gray-400 mb-4">
              Professional dental care management system
            </p>
            <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Available 24/7</span>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
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
