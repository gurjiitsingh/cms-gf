'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { CheckCircle, Users, Percent, LayoutTemplate } from 'lucide-react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

export default function Campaigns() {
  const router = useRouter();
  const { recipients, setRecipients, coupons, template } = useAppContext();


  const handleSendEmails = async () => {
  if (!recipients?.length) {
    alert("Please select at least one recipient.");
    return;
  }

  if (!coupons?.length) {
    alert("Please select at least one coupon.");
    return;
  }

  // if (!template) {
  //   alert("Please select a template.");
  //   return;
  // }
const templateId = 1;
  try {
    const res = await fetch("/api/send-marketing-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: recipients,
        coupons,
        templateId,
        subject: "🎉 Masala Taste of India!",
      }),
    });

    if (!res.ok) throw new Error("Failed to send emails");

     await addDoc(collection(db, "campaignsSent"), {
      emails: recipients,
      createdAt: Timestamp.now(),
    });

    setRecipients([]);

    alert("✅ Emails sent successfully!");
  } catch (err) {
    console.error("Sending failed:", err);
    alert("Error sending emails.");
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
      onClick: () => router.push('/select-inactive-customer'),
      completed: !!recipients?.length,
    },
    {
      id: 2,
      title: 'Coupon',
      description: coupons?.length
        ? `${coupons.length} coupon(s) selected`
        : 'Choose a coupon to apply.',
      icon: Percent,
      buttonText: coupons?.length ? 'Edit Coupon' : 'Add Coupon',
      onClick: () => router.push('/coupon-builder'),
      completed: !!coupons?.length,
    },
    {
      id: 3,
      title: 'Template',
      description: template ? 'Template selected' : 'Choose a design template.',
      icon: LayoutTemplate,
      buttonText: template ? 'Edit Template' : 'Select Template',
      onClick: () => router.push('/template-selector'),
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
              {step.completed ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
            </div>
            <h2 className="text-xl font-semibold text-green-700">{step.id}. {step.title}</h2>
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
          className={`px-6 py-3 rounded text-white font-semibold transition 
            ${allStepsCompleted
              ? 'bg-green-700 hover:bg-green-800'
              : 'bg-green-300 cursor-not-allowed'}`}
           disabled={!allStepsCompleted}
        >
          🎯 Launch Campaign
        </button>
      </div>
    </div>
  );
}
