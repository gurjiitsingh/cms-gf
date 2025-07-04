'use client';

import { useRouter } from 'next/navigation';
import { Percent, Image } from 'lucide-react';

export default function TemplateOptions() {
  const router = useRouter();

  const options = [
    {
      id: 1,
      title: 'Auto-generated Coupon',
      description: 'Create a template using a built-in coupon generator.',
      icon: Percent,
      onClick: () => router.push('/template/create/select-coupon'),
      buttonText: 'Use Coupon',
    },
    {
      id: 2,
      title: 'Upload an Image',
      description: 'Design your template using a custom image.',
      icon: Image,
      onClick: () => router.push('/template/image/upload'),
      buttonText: 'Use Image',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-8">
      {options.map((option) => (
        <div
          key={option.id}
          className="relative border-l-4 border-orange-500 bg-white shadow-sm rounded-lg p-5 pl-8"
        >
          <div className="absolute -left-4 top-5 bg-orange-100 border border-orange-500 text-orange-600 rounded-full p-2">
            <option.icon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-orange-700">
            {option.id}. {option.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
          <button
            onClick={option.onClick}
            className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            {option.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}
