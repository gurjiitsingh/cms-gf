'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  endBefore,
  getCountFromServer,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useAppContext } from '@/context/AppContext';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/Table';

type CustomerT = {
  id: string;
  name: string;
  email: string;
  userId: string;
  lastOrderDate?: Timestamp;
  noOfferEmails?: boolean;
};

const PAGE_SIZE = 10;

export default function AllCustomersList() {
  const [customers, setCustomers] = useState<CustomerT[]>([]);
  const [firstDoc, setFirstDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [pageStack, setPageStack] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [manualEmails, setManualEmails] = useState('');
  const [emailsToRemove, setEmailsToRemove] = useState('');
  const [finalEmailList, setFinalEmailList] = useState<string[]>([]);
  const { setRecipients } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers(direction: 'next' | 'prev' | 'init' = 'init') {
    try {
      let baseQuery = query(
        collection(db, 'customerRecentOrder'),
        orderBy('lastOrderDate', 'desc'),
        limit(PAGE_SIZE)
      );

      if (direction === 'next' && lastDoc) {
        baseQuery = query(baseQuery, startAfter(lastDoc));
      } else if (direction === 'prev' && pageStack.length >= 2) {
        const previous = pageStack[pageStack.length - 2];
        baseQuery = query(baseQuery, startAfter(previous));
        setPageStack((prev) => prev.slice(0, -1)); // Pop last page
      }

      const snapshot = await getDocs(baseQuery);
      const docs = snapshot.docs;

      setCustomers(docs.map((doc) => ({ id: doc.id, ...doc.data() })) as CustomerT[]);
      setFirstDoc(docs[0] || null);
      setLastDoc(docs[docs.length - 1] || null);

      if (direction === 'next' || direction === 'init') {
        setPageStack((prev) => [...prev, docs[0]]);
      }

      setHasMore(docs.length === PAGE_SIZE);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  }

  useEffect(() => {
    const baseEmails = customers
      .filter((cust) => !cust.noOfferEmails && cust.email)
      .map((cust) => cust.email);

    const extraEmails = manualEmails
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    const excludeEmails = emailsToRemove
      .split(/[\n,]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    const final = [...new Set([...baseEmails, ...extraEmails])].filter(
      (e) => !excludeEmails.includes(e.toLowerCase())
    );

    setFinalEmailList(final);
  }, [customers, manualEmails, emailsToRemove]);

  return (
    <div className="mt-2">
      <h3 className="text-2xl mb-2 font-semibold">All Customers</h3>
      <p className="mb-4 text-gray-700">
        Showing <span className="font-bold">{customers.length}</span> records
      </p>

      <div className="bg-slate-50 rounded-lg p-1 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Last Order Date</TableHead>
              <TableHead>Marketing Consent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((cust) => (
              <TableRow key={cust.id}>
                <TableCell>{cust.name}</TableCell>
                <TableCell>{cust.email}</TableCell>
                <TableCell>{cust.userId}</TableCell>
                <TableCell>
                  {cust.lastOrderDate instanceof Timestamp
                    ? cust.lastOrderDate.toDate().toLocaleString('de-DE', {
                        timeZone: 'Europe/Berlin',
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })
                    : 'N/A'}
                </TableCell>
                <TableCell>{cust.noOfferEmails ? '❌' : '✅'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => fetchCustomers('prev')}
          className="bg-gray-400 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={pageStack.length <= 1}
        >
          Previous
        </button>
        <button
          onClick={() => fetchCustomers('next')}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!hasMore}
        >
          Next
        </button>
      </div>

      {/* Email tools below (unchanged) */}
    </div>
  );
}
