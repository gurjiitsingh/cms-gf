'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { CheckCircle, Users, LayoutTemplate } from 'lucide-react';
import {
  addDoc,
  collection,
  Timestamp,
  getDocs,
  query,
  where,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useState } from 'react';

export default function Campaigns() {
  const router = useRouter();
  const { recipients, setRecipients, coupons, template } = useAppContext();
  const [campaignInProgress, setCampaignInProgress] = useState(false);

  const handleSendEmails = async () => {
    if (campaignInProgress) return; // prevent double click
    setCampaignInProgress(true);

    const templateId = 1;

    try {
      const res = await fetch("/api/brevo/send-marketing-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipients,
          coupons,
          templateId,
          content: template?.content,
          subject: " Masala Taste of India!",
        }),
      });

      if (!res.ok) throw new Error("Failed to send emails");

      await addDoc(collection(db, "campaignsSent"), {
        emails: recipients,
        createdAt: Timestamp.now(),
      });

      const uniqueRecipients = [...new Set(recipients)];
      const chunked = (arr: string[], size: number) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
          arr.slice(i * size, i * size + size)
        );

      const existingEmails = new Set<string>();
      for (const chunk of chunked(uniqueRecipients, 10)) {
        const q = query(collection(db, "newCustomer"), where("email", "in", chunk));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data?.email) {
            existingEmails.add(data.email);
          }
        });
      }

      const newEmailsToAdd = uniqueRecipients.filter((email) => !existingEmails.has(email));

      await Promise.all(
        newEmailsToAdd.map((email) =>
          addDoc(collection(db, "newCustomer"), {
            email,
            createdAt: Timestamp.now(),
          })
        )
      );

      setRecipients([]);

// ✅ Update user collection: set welcomeEmail = true
try {
  const userChunks = chunked(uniqueRecipients, 10);
console.log("inside-----------")
  for (const chunk of userChunks) {
    const q = query(collection(db, 'user'), where('email', 'in', chunk));
    const snapshot = await getDocs(q);

    const batch = await import('firebase/firestore').then(({ writeBatch }) => writeBatch(db));
    snapshot.forEach((docSnap) => {
      batch.update(doc(db, 'user', docSnap.id), {
        welcomeEmail: true,
      });
    });
    await batch.commit();
  }
} catch (err) {
  console.log('⚠️ Failed to update welcomeEmail flag in user collection:', err);
  console.warn('⚠️ Failed to update welcomeEmail flag in user collection:', err);
}


      alert("✅ Emails sent successfully!");
    } catch (err) {
      console.error("Sending failed:", err);
      alert("Error sending emails.");
    } finally {
      setCampaignInProgress(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Recipients',
      description: recipients?.length
        ? `${recipients.length} recipient(s) selected`
        : 'Select customers to receive this campaign.',
      icon: Users,
      buttonText: recipients?.length ? 'Edit Recipients' : 'Add Recipients',
      onClick: () => router.push('/users/by-month-send-offer'),
      completed: !!recipients?.length,
    },
    {
      id: 2,
      title: 'Template',
      description: template ? 'Template selected' : 'Choose a design template.',
      icon: LayoutTemplate,
      buttonText: template ? 'Select Template' : 'Select Template',
      onClick: () => router.push('/auto-campaign/template/select-for-campaign'),
      completed: !!template,
    },
  ];

  const allStepsCompleted = steps.every((step) => step.completed);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">📢 Build Your Campaign</h1>

      <div className="space-y-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className="relative border-l-4 border-green-500 bg-white shadow-md rounded-lg p-5 pl-8"
          >
            <div className="absolute -left-4 top-5 bg-green-100 border border-green-500 text-green-700 rounded-full p-2">
              {step.completed ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-green-700">
              {step.id}. {step.title}
            </h2>
            <p className="text-gray-600 mt-1">{step.description}</p>
            <button
              className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
              onClick={step.onClick}
            >
              {step.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleSendEmails}
          className={`px-6 py-3 rounded text-white font-semibold transition ${
            allStepsCompleted && !campaignInProgress
              ? 'bg-green-700 hover:bg-green-800'
              : 'bg-green-300 cursor-not-allowed'
          }`}
          disabled={!allStepsCompleted || campaignInProgress}
        >
          {campaignInProgress ? '⏳ Sending...' : '🎯 Launch Campaign'}
        </button>
      </div>
    </div>
  );
}
