'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaUser,
  FaEnvelope,
  FaHome,
  FaClipboardList,
  FaUserSlash,
  FaUserClock,
  FaCalendarTimes,
} from 'react-icons/fa';

const navItems = [
  { href: '/', label: 'Home', icon: <FaHome /> },
  { href: '/users', label: 'Customers', icon: <FaUser /> },
  { href: '/campaigns', label: 'Campaigns', icon: <FaEnvelope /> },
   { href: '/campaigns/view', label: 'Campaigns View', icon: <FaEnvelope /> },
  { href: '/orders', label: 'Orders', icon: <FaClipboardList /> },
  { href: '/inactive-customers', label: 'Inactive Customers', icon: <FaCalendarTimes /> },
  { href: '/send-email', label: 'Send Email', icon: <FaUser /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-green-800 text-white flex flex-col shadow-xl">
      <div className="p-6 text-2xl font-bold border-b border-green-700 tracking-wide">
        MBC Dashboard
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-green-600 shadow-inner'
                  : 'hover:bg-green-700 hover:pl-5'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-sm text-green-100 border-t border-green-700">
        © 2025 MBC
      </div>
    </aside>
  );
}
