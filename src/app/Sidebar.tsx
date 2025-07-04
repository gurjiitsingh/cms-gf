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
  FaBars,
  FaAddressBook,
  FaListUl,
} from 'react-icons/fa';

// Section: General
const generalMenu = [
  { href: '/', label: 'Home', icon: <FaHome /> },
];

// Section: Advance Campaign Mode
const advanceCampaign = [
 
  { href: '/campaigns/create-campaign', label: 'Create Campaign', icon: <FaEnvelope /> },
  { href: '/campaigns/recent-campaigns', label: 'All Campaigns', icon: <FaEnvelope /> },
  { href: '/auto-campaign/campaigns', label: 'Welcome offer', icon: <FaEnvelope /> },
  // { href: '/auto-campaign/welcome-offer', label: 'Welcome Offer', icon: <FaEnvelope /> },
 
   { href: '/template/create/select-option', label: 'Create template', icon: <FaEnvelope /> },
 { href: '/template/select-for-campaign', label: 'All templates', icon: <FaEnvelope /> },

  { href: '/lists/view-lists', label: 'Final Lists', icon: <FaEnvelope /> },
   { href: '/auto-campaign/manage-lists', label: 'Raw List', icon: <FaListUl /> }, 

];

 
// Section: Auto Campaign Mode
const autoCampaign = [
  { href: '/old/campaigns', label: 'Campaigns', icon: <FaEnvelope /> },
  { href: '/old/campaigns1', label: 'Campaigns Auto', icon: <FaEnvelope /> },
  { href: '/old/campaigns/view', label: 'Campaigns View', icon: <FaEnvelope /> },
  { href: '/customers/inactive', label: 'Inactive Customers', icon: <FaCalendarTimes /> },
  { href: '/new-manaully-saved-emails', label: 'Save new email in db', icon: <FaUser /> },
  { href: '/old/manage-lists', label: 'Manage List', icon: <FaListUl /> },
];

// Section: Sale
const sale = [
   
  { href: '/sale', label: 'Sale Summary', icon: <FaClipboardList /> },
  { href: '/sale/by-month', label: 'Sale Detail', icon: <FaClipboardList /> },
   { href: '/sale/by-coupon', label: 'Coupon Search', icon: <FaClipboardList /> },
   { href: '/orders', label: 'Orders', icon: <FaClipboardList /> },
];

// Section: Customers
const customerItems = [
  { href: '/users', label: 'All Customers', icon: <FaUser /> },
   { href: '/users/address-search', label: 'Customers Address', icon: <FaUser /> },
  { href: '/users/by-name', label: 'Search Customers', icon: <FaUser /> },
   { href: '/users/by-month', label: 'New in month', icon: <FaUser /> },
   { href: '/users/by-date', label: 'New in day', icon: <FaUser /> },
  { href: '/users/new', label: 'New Customers', icon: <FaUser /> },
 // { href: '/users/full-list', label: 'Cus Order Count', icon: <FaClipboardList /> },
 { href: '/users/inactive', label: 'Inactive Customers', icon: <FaCalendarTimes /> },
  { href: '/users/more', label: 'More', icon: <FaCalendarTimes /> },

  


];



// Section: Transformed Old Mode
const oldNavItems = autoCampaign.map((item) => ({
  ...item,
  href: '' + (item.href === '/' ? '' : item.href),
}));

export default function Sidebar() {
  const pathname = usePathname();
  const [mode, setMode] = useState<'old' | 'advance'>('advance');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('emailMode');
    if (savedMode === 'old' || savedMode === 'advance') {
      setMode(savedMode);
    } else {
      localStorage.setItem('emailMode', 'advance');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('emailMode', mode);
  }, [mode]);

  const navItems = mode === 'advance' ? advanceCampaign : oldNavItems;

  const renderNavLinks = (items: typeof navItems) =>
    items.map((item) => {
      const isActive = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            isActive ? 'bg-green-600 shadow-inner' : 'hover:bg-green-700 hover:pl-5'
          }`}
          onClick={() => setIsMobileOpen(false)}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      );
    });

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-green-700 p-2 rounded text-white shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <FaBars />
      </button>

      <aside
        className={`fixed top-0 left-0 h-full bg-green-800 text-white w-64 z-40 transition-transform duration-300 transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:flex md:flex-col shadow-xl`}
      >
        <div className="p-6 text-2xl font-bold border-b border-green-700 tracking-wide">
          MBC Dashboard
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center gap-4 p-4">
          <button
            className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ${
              mode === 'old' ? 'bg-green-600 shadow-inner' : 'bg-green-700 hover:bg-green-600'
            }`}
            onClick={() => setMode('old')}
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

        {/* General */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-screen ">
          {renderNavLinks(generalMenu)}

          {/* Dynamic campaign section */}
          {renderNavLinks(navItems)}


  {/* Sale Section */}
          <div className="mt-6 pt-4 border-t border-green-700">
            <div className="text-sm uppercase tracking-wider text-green-300 mb-2 px-4">
              Sales
            </div>
            {renderNavLinks(sale)}
          </div>
          {/* Customer Section */}
          <div className="mt-6 pt-4 border-t border-green-700">
            <div className="text-sm uppercase tracking-wider text-green-300 mb-2 px-4">
              Customer
            </div>
            {renderNavLinks(customerItems)}
          </div>

        

         
        </nav>

        <div className="p-4 text-sm text-green-100 border-t border-green-700">
          © 2025 MBC
        </div>
      </aside>
    </>
  );
}
