'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  FaUser,
  FaEnvelope,
  FaHome,
  FaClipboardList,
  FaCalendarTimes,
} from 'react-icons/fa';

// ADVANCE (default) routes – root-level
const advanceNavItems = [
  { href: '/', label: 'Home', icon: <FaHome /> },
  { href: '/users', label: 'Customers', icon: <FaUser /> },
  { href: '/campaigns', label: 'Campaigns', icon: <FaEnvelope /> },
  { href: '/campaigns/view', label: 'Campaigns View', icon: <FaEnvelope /> },
  { href: '/orders', label: 'Orders', icon: <FaClipboardList /> },
  { href: '/inactive-customers', label: 'Inactive Customers', icon: <FaCalendarTimes /> },
  { href: '/send-email', label: 'Send Email', icon: <FaUser /> },
];

// OLD routes – under /bulk
const oldNavItems = advanceNavItems.map(item => ({
  ...item,
  href: '/bulk' + (item.href === '/' ? '' : item.href),
}));

export default function Sidebar() {
  const pathname = usePathname();

  const [mode, setMode] = useState<'old' | 'advance'>('advance');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('emailMode');
      if (savedMode === 'old' || savedMode === 'advance') {
        setMode(savedMode);
      } else {
        localStorage.setItem('emailMode', 'advance');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('emailMode', mode);
    }
  }, [mode]);

  const navItems = mode === 'advance' ? advanceNavItems : oldNavItems;

  return (
    <aside className="h-screen w-64 bg-green-800 text-white flex flex-col shadow-xl">
      <div className="p-6 text-2xl font-bold border-b border-green-700 tracking-wide">
        MBC Dashboard
      </div>

      <div className="flex justify-center gap-4 p-4">
        <button
          // onClick={() => setMode('old')}
          className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ${
            mode === 'old'
              ? 'bg-green-600 shadow-inner'
              : 'bg-green-700 hover:bg-green-600'
          }`}
        >
          Old
        </button>
        <button
          onClick={() => setMode('advance')}
          className={`px-4 py-2 rounded font-semibold transition-all duration-300 ${
            mode === 'advance'
              ? 'bg-green-400 text-green-900 font-bold shadow-lg shadow-green-300/70 hover:brightness-110'
              : 'bg-green-700 hover:bg-green-600'
          }`}
        >
          Advance
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive ? 'bg-green-600 shadow-inner' : 'hover:bg-green-700 hover:pl-5'
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
