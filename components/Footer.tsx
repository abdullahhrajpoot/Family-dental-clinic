"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  FileText, 
  Receipt, 
  BarChart3,
  Heart,
  Github,
  Linkedin,
  Mail
} from "lucide-react"

export default function Footer() {
  const quickLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Calendar },
    { href: "/dashboard/patients", label: "Patients", icon: Users },
    { href: "/dashboard/appointments/new", label: "Book Appointment", icon: Calendar },
    { href: "/dashboard/invoices/new", label: "Generate Bill", icon: FileText },
    { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
    { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  ]

  const socialLinks = [
    { href: "https://github.com", label: "GitHub", icon: Github },
    { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
    { href: "mailto:abdullah@example.com", label: "Email", icon: Mail },
  ]

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="medical-gradient border-t border-blue-200/50 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Family Dental Clinic</h3>
            </motion.div>
            <p className="text-blue-100 mb-4 max-w-md">
              Professional dental care services with modern technology and compassionate care. 
              Your smile is our priority.
            </p>
            <div className="flex items-center gap-2 text-blue-200">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Made with care for your dental health</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h4
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white font-semibold mb-4"
            >
              Quick Links
            </motion.h4>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors group"
                  >
                    <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Contact & Social */}
          <div>
            <motion.h4
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white font-semibold mb-4"
            >
              Connect With Us
            </motion.h4>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-blue-100">
                <Mail className="w-4 h-4" />
                <span className="text-sm">abdullahh.hassan07@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <Stethoscope className="w-4 h-4" />
                <span className="text-sm">Professional Dental Care</span>
              </div>
              <div className="flex gap-3 mt-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="border-t border-blue-200/30 pt-6"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-blue-200">
              <span className="text-sm">© 2025 Family Dental Clinic. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-blue-200">
              <span className="text-sm">Built</span>
              <div className="flex items-center gap-1">
                {/* <Heart className="w-4 h-4 text-red-400" /> */}
                <span className="text-sm">by Abdullah Hassan</span>
              </div>
              <span className="text-sm">•</span>
              <span className="text-sm">Powered by Next.js</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}
