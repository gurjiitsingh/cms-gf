'use client';

import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import {
  CheckCircle,
  Users,
  LayoutTemplate,
  FileText,
} from 'lucide-react';

export default function CampaignSteps() {
  const router = useRouter();
  const { recipientsMarketing,  templateMarketing } = useAppContext();

  const steps = [
      {
      id: 1,
      title: 'Campaign Info',
      description: 'Fill in final campaign details.',
      icon: FileText,
      onClick: () => router.push('/campaigns/create-campaign/campaign-info'),
      buttonText: 'Fill Campaign Info',
      completed: false,
    },
    {
      id: 2,
      title: 'Recipients',
      description: recipientsMarketing?.length
        ? `${recipientsMarketing.length} recipient(s) selected`
        : 'Select customers for this campaign.',
      icon: Users,
      onClick: () => router.push('/lists/add-list-to-campaign'),
      buttonText: recipientsMarketing?.length ? 'Edit Recipients' : 'Add Recipients',
      completed: !!recipientsMarketing?.length,
    },
    // {
    //   id: 3,
    //   title: 'Coupon',
    //   description: couponsMarketing?.length
    //     ? `${couponsMarketing.length} coupon(s) selected`
    //     : 'Choose a discount coupon.',
    //   icon: Percent,
    //   onClick: () => router.push('/campaigns/create-campaign/coupon-builder'),
    //   buttonText: couponsMarketing?.length ? 'Edit Coupon' : 'Add Coupon',
    //   completed: !!couponsMarketing?.length,
    // },
    {
      id: 3,
      title: 'Template',
      description: templateMarketing ? 'Template selected.' : 'Choose a design template.',
      icon: LayoutTemplate,
      onClick: () => router.push('/template/select-for-campaign'),
      buttonText: templateMarketing ? 'Select Template' : 'Select Template',
      completed: !!templateMarketing,
    },
  
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {steps.map((step) => (
        <div
          key={step.id}
          className="relative border-l-4 border-orange-500 bg-white shadow-sm rounded-lg p-5 pl-8"
        >
          <div className="absolute -left-4 top-5 bg-orange-100 border border-orange-500 text-orange-600 rounded-full p-2">
            {step.completed ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <step.icon className="w-5 h-5" />
            )}
          </div>
          <h2 className="text-lg font-semibold text-orange-700">
            {step.id}. {step.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
          <button
            onClick={step.onClick}
            className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            {step.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}
