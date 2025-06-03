'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaUser, FaEnvelope, FaHome, FaClipboardList, FaUserSlash, FaUserClock, FaCalendarTimes } from 'react-icons/fa'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: <FaHome /> },
  { href: '/dashboard/customers', label: 'Customers', icon: <FaUser /> },
  { href: '/dashboard/campaigns', label: 'Campaigns', icon: <FaEnvelope /> },
  { href: '/dashboard/email', label: 'Send Email', icon: <FaEnvelope /> },
  { href: '/dashboard/orders', label: 'Orders', icon: <FaClipboardList /> },
  { href: '/dashboard/inactive-customers', label: 'Inactive Customers', icon: <FaCalendarTimes /> },
  { href: '/dashboard/send-email', label: 'Send Email', icon: <FaUser /> },
  // { href: '/dashboard/customers-by-month', label: 'By Month', icon: <FaUser /> },
  // { href: '/dashboard/orders-by-date', label: 'Orders by Date', icon: <FaClipboardList /> },
  // { href: '/dashboard/non-ordering-customers-dummy', label: 'Non-Ordering dummy', icon: <FaUserSlash /> }, // Add this
  // { href: '/dashboard/non-ordering', label: 'Non-Ordering', icon: <FaUserClock /> }, // Add in your `navItems`
  // { href: '/dashboard/inactive-customers-weak', label: 'Inactive Customers weak', icon: <FaCalendarTimes /> },
]






export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="p-6 text-xl font-bold border-b border-gray-700">
        MBC Dashboard
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-2 rounded hover:bg-gray-700 transition ${
              pathname === item.href ? 'bg-gray-700' : ''
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 text-sm text-gray-400 border-t border-gray-700">
        © 2025 MBC
      </div>
    </aside>
  )
}






// // app/dashboard/components/Sidebar.tsx
// 'use client'

// import Link from 'next/link'
// import { FaUser, FaEnvelope, FaClipboardList, FaHome } from 'react-icons/fa'

// const navItems = [
//   { name: 'Home', icon: FaHome, href: '/dashboard' },
//   { name: 'Customers', icon: FaUser, href: '/dashboard/customers' },
//   { name: 'Email', icon: FaEnvelope, href: '/dashboard/email' },
//   { name: 'Orders', icon: FaClipboardList, href: '/dashboard/orders' },
// ]

// export default function Sidebar() {
//   return (
//     <aside className="w-64 bg-white shadow-lg p-4">
//       <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
//       <nav className="space-y-4">
//         {navItems.map(({ name, icon: Icon, href }) => (
//           <Link key={name} href={href} className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
//             <Icon className="text-gray-600" />
//             <span className="text-gray-700">{name}</span>
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   )
// }
