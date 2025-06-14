'use client';

import { useState } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  query,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export default function FixMissingCreatedAt() {
  const [fixing, setFixing] = useState(false);
  const [fixedCount, setFixedCount] = useState(0);
  const [errorLog, setErrorLog] = useState<string[]>([]);

  const fixCreatedAt = async () => {
    setFixing(true);
    setFixedCount(0);
    setErrorLog([]);
let i=0;
    try {

//const snapshot = await getDocs(collection(db, 'orderMasterDummy1'));
const collectionRef = collection(db, 'orderMasterDummy1');
      const baseQuery = query(collectionRef);
      const snapshot = await getDocs(baseQuery);
console.log('Total docs:', snapshot.size);



// snapshot.docs.forEach(docSnap => {
//   const data = docSnap.data();
//   if (!data.createdAt) {
//     console.log('No createdAt:', docSnap.id, data.time);
//   }
// });


     
      let count = 0;
      const errors: string[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
       i++;
       
 console.log("data----------",i,"----",data.createdAt)
 //console.log("data----------",i,"----",data.time)
        if (!data.createdAt && data.time) {
            console.log("data----------",i,"----",data.createdAt)
          try {
            const parsedDate = parseTimeString(data.time);
            if (parsedDate) {
              await updateDoc(doc(db, 'orderMasterDummy1', docSnap.id), {
                createdAt: Timestamp.fromDate(parsedDate),
              });
              count++;
            } else {
              errors.push(`Invalid time format in doc ID: ${docSnap.id}`);
            }
          } catch (err) {
            console.error(`Error updating doc ID ${docSnap.id}:`, err);
            errors.push(`Update failed for doc ID: ${docSnap.id}`);
          }
        }
      }

      setFixedCount(count);
      setErrorLog(errors);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setErrorLog(['Failed to fetch documents.']);
    }

    setFixing(false);
  };

  const parseTimeString = (timeStr: string): Date | null => {
    // Example: "31 Mar 2025, 12:43:53"
    const parsed = new Date(timeStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Fix Missing createdAt Fields</h1>

      <button
        onClick={fixCreatedAt}
        disabled={fixing}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {fixing ? 'Fixing...' : 'Start Fix'}
      </button>

      <div className="mt-4">
        <p className="font-semibold">Fixed Documents: {fixedCount}</p>
        {errorLog.length > 0 && (
          <div className="mt-2 text-red-600">
            <p className="font-bold">Errors:</p>
            <ul className="list-disc ml-5">
              {errorLog.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
