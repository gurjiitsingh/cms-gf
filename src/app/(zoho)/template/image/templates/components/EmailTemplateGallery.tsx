'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAppContext } from '@/context/AppContext'
import CreateEmailTemplate from '../../../create/coponents/CreateEmailTemplate'

type TemplateProps = {
  imageUrl?: string
}

const Template1 = ({ imageUrl }: TemplateProps) => (
  <div className="text-sm font-sans">
    <div className="text-center mb-6">
      <img
        src="https://www.masala-gf.de/logo.jpg"
        alt="Logo"
        className="mx-auto mb-4 w-20"
      />
      <h1 className="text-2xl font-bold text-orange-600"> Willkommen bei Masala!</h1>
    
      <p className="text-gray-700 mt-2">
        Vielen Dank, dass Sie ein geschätzter Kunde sind. Entdecken Sie jetzt unsere neuen Angebote.
      </p>
    </div>

    <div className="text-center my-6">
      <img
        src={imageUrl || "https://www.masala-gf.de/banner.jpg"}
        alt="Angebot"
        className="w-full max-w-[520px] mx-auto rounded"
      />
    </div>

    <div className="text-center mt-6">
      <p className="text-gray-500">Scannen Sie den QR-Code, um jetzt einzukaufen:</p>
      <img
        src="https://www.masala-gf.de/masala-gf-qr.png"
        alt="QR-Code"
        className="mx-auto mt-2"
      />
    </div>

    <div className="text-center mt-8">
      <a
        href="https://www.masala-gf.de/"
        target="_blank"
        className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
      >
        Jetzt besuchen: masala-gf.de
      </a>
    </div>

    <div className="text-center text-gray-400 text-xs mt-8">
      <p>© 2025 Masala Taste Of India. Alle Rechte vorbehalten.</p>
    </div>
  </div>
)

const Template2 = ({ imageUrl }: TemplateProps) => (
  <div className="text-sm font-sans">
    <div className="text-center mb-6">
      <img
        src="https://www.masala-gf.de/logo.jpg"
        alt="Logo"
        className="mx-auto mb-4 w-20"
      />
     
    </div>

    <div className="text-center my-6">
      <img
        src={imageUrl || "https://www.masala-gf.de/banner.jpg"}
        alt="Angebot"
        className="w-full max-w-[520px] mx-auto rounded"
      />
    </div>

    <div className="text-center mt-6">
      <p className="text-gray-500">Scannen Sie den QR-Code, um jetzt einzukaufen:</p>
      <img
        src="https://www.masala-gf.de/masala-gf-qr.png"
        alt="QR-Code"
        className="mx-auto mt-2"
      />
    </div>

    <div className="text-center mt-8">
      <a
        href="https://www.masala-gf.de/"
        target="_blank"
        className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
      >
        Jetzt besuchen: masala-gf.de
      </a>
    </div>

    <div className="text-center text-gray-400 text-xs mt-8">
      <p>© 2025 Masala Taste Of India. Alle Rechte vorbehalten.</p>
    </div>
  </div>
)


const templates = [
     {
    id: 1,
    name: 'Template 1',
    component: Template2,
    getHtml: (imageUrl: string) => `
      <div style="font-family: sans-serif; max-width:600px; margin:auto; background:white; padding:24px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <div style="text-align:center; margin-bottom:24px;">
          <img src="https://www.masala-gf.de/logo.jpg" alt="Logo" style="width:80px; margin:auto 16px;" />
      
        </div>
        <div style="text-align:center; margin:24px 0;">
          <img src="${imageUrl}" alt="Angebot" style="width:100%; max-width:520px; border-radius:8px;" />
        </div>
        <div style="text-align:center; margin-top:24px;">
          <p>Scannen Sie den QR-Code, um jetzt einzukaufen:</p>
          <img src="https://www.masala-gf.de/masala-gf-qr.png" alt="QR-Code" style="margin-top:8px;" />
        </div>
        <div style="text-align:center; margin-top:32px;">
          <a href="https://www.masala-gf.de/" target="_blank" style="background-color:#ea580c; color:white; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:bold;">
            Jetzt besuchen: masala-gf.de
          </a>
        </div>
        <div style="text-align:center; color:#9ca3af; font-size:12px; margin-top:32px;">
          <p>© 2025 Masala Taste Of India. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    `,
  },
   {
  id: 2,
  name: 'Template 2',
  component: ({ imageUrl }: TemplateProps) => (
    <div className="text-sm font-sans bg-teal-50 rounded shadow-md p-6 text-gray-800">
      <div className="text-center mb-6">
        <img
          src="https://www.masala-gf.de/logo.jpg"
          alt="Logo"
          className="mx-auto mb-4 w-20"
        />
       
      </div>

      <div className="text-center my-6">
        <img
          src={imageUrl || "https://www.masala-gf.de/banner.jpg"}
          alt="Angebot"
          className="w-full max-w-[520px] mx-auto rounded"
        />
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-600">Scannen Sie den QR-Code, um jetzt einzukaufen:</p>
        <img
          src="https://www.masala-gf.de/masala-gf-qr.png"
          alt="QR-Code"
          className="mx-auto mt-2 w-28"
        />
      </div>

      <div className="text-center mt-8">
        <a
          href="https://www.masala-gf.de/"
          target="_blank"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Jetzt besuchen: masala-gf.de
        </a>
      </div>

      <div className="text-center text-gray-500 text-xs mt-8">
        <p>© 2025 Masala Taste Of India. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  ),
  getHtml: (imageUrl: string) => `
    <div style="font-family: sans-serif; max-width:600px; margin:auto; background:#f0fdfa; padding:24px; border-radius:8px;">
      <div style="text-align:center; margin-bottom:24px;">
        <img src="https://www.masala-gf.de/logo.jpg" alt="Logo" style="width:80px; margin-bottom:16px;" />
       </div>

      <div style="text-align:center; margin:24px 0;">
        <img src="${imageUrl}" alt="Angebot" style="width:100%; max-width:520px; border-radius:8px;" />
      </div>

      <div style="text-align:center; margin-top:24px;">
        <p style="margin:0; color:#374151;">Scannen Sie den QR-Code, um jetzt einzukaufen:</p>
        <img src="https://www.masala-gf.de/masala-gf-qr.png" alt="QR-Code" style="margin-top:8px; width:120px;" />
      </div>

      <div style="text-align:center; margin-top:32px;">
        <a href="https://www.masala-gf.de/" target="_blank" style="background-color:#0f766e; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold;">
          Jetzt besuchen: masala-gf.de
        </a>
      </div>

      <div style="text-align:center; color:#6b7280; font-size:12px; margin-top:32px;">
        <p style="margin:0;">© 2025 Masala Taste Of India. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  `,
},
   {
  id: 3,
  name: 'Template 3',
  component: ({ imageUrl }: TemplateProps) => (
    <div className="text-sm font-sans bg-teal-50 rounded shadow-md  text-gray-800">
  

      <div className="text-center ">
        <img
          src={imageUrl || "https://www.masala-gf.de/banner.jpg"}
          alt="Angebot"
          className="w-full max-w-[520px] mx-auto rounded"
        />
      </div>


      <div className="text-center mt-8">
        <a
          href="https://www.masala-gf.de/"
          target="_blank"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Jetzt besuchen: masala-gf.de
        </a>
      </div>

      <div className="text-center text-gray-500 text-xs mt-8">
        <p>2025 Masala Taste Of India. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  ),
  getHtml: (imageUrl: string) => `
    <div style="font-family: sans-serif; max-width:600px; margin:auto; background:#f0fdfa; padding:24px; border-radius:8px;">
    

      <div style="text-align:center; margin:24px 0;">
        <img src="${imageUrl}" alt="Angebot" style="width:100%; max-width:520px; border-radius:8px;" />
      </div>

    

      <div style="text-align:center; margin-top:32px;">
        <a href="https://www.masala-gf.de/" target="_blank" style="background-color:#0f766e; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold;">
          Jetzt besuchen: masala-gf.de
        </a>
      </div>

      <div style="text-align:center; color:#6b7280; font-size:12px; margin-top:32px;">
        <p style="margin:0;"> 2025 Masala Taste Of India. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  `,
}, 
{
    id: 4,
    name: 'Template 4',
    component: Template1,
    getHtml: (imageUrl: string) => `
      <div style="font-family: sans-serif; max-width:600px; margin:auto; background:white; padding:24px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <div style="text-align:center; margin-bottom:24px;">
          <img src="https://www.masala-gf.de/logo.jpg" alt="Logo" style="width:80px; margin:auto 16px;" />
          <h1 style="font-size:24px; color:#ea580c;">🧡 Willkommen bei Masala!</h1>
          <p>Vielen Dank, dass Sie ein geschätzter Kunde sind. Entdecken Sie jetzt unsere neuen Angebote.</p>
        </div>
        <div style="text-align:center; margin:24px 0;">
          <img src="${imageUrl}" alt="Angebot" style="width:100%; max-width:520px; border-radius:8px;" />
        </div>
        <div style="text-align:center; margin-top:24px;">
          <p>Scannen Sie den QR-Code, um jetzt einzukaufen:</p>
          <img src="https://www.masala-gf.de/masala-gf-qr.png" alt="QR-Code" style="margin-top:8px;" />
        </div>
        <div style="text-align:center; margin-top:32px;">
          <a href="https://www.masala-gf.de/" target="_blank" style="background-color:#ea580c; color:white; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:bold;">
            Jetzt besuchen: masala-gf.de
          </a>
        </div>
        <div style="text-align:center; color:#9ca3af; font-size:12px; margin-top:32px;">
          <p>© 2025 Masala Taste Of India. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    `,
  },

   {
  id: 5,
  name: 'Template 5',
  component: ({ imageUrl }: TemplateProps) => (
    <div className="text-sm font-sans bg-teal-50 rounded shadow-md p-6 text-gray-800">
      <div className="text-center mb-6">
        <img
          src="https://www.masala-gf.de/logo.jpg"
          alt="Logo"
          className="mx-auto mb-4 w-20"
        />
        <h1 className="text-2xl font-bold text-teal-700">Willkommen bei Masala!</h1>
        <p className="mt-2">
          Vielen Dank, dass Sie ein geschätzter Kunde sind. Entdecken Sie jetzt unsere neuen Angebote.
        </p>
      </div>

      <div className="text-center my-6">
        <img
          src={imageUrl || "https://www.masala-gf.de/banner.jpg"}
          alt="Angebot"
          className="w-full max-w-[520px] mx-auto rounded"
        />
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-600">Scannen Sie den QR-Code, um jetzt einzukaufen:</p>
        <img
          src="https://www.masala-gf.de/masala-gf-qr.png"
          alt="QR-Code"
          className="mx-auto mt-2 w-28"
        />
      </div>

      <div className="text-center mt-8">
        <a
          href="https://www.masala-gf.de/"
          target="_blank"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Jetzt besuchen: masala-gf.de
        </a>
      </div>

      <div className="text-center text-gray-500 text-xs mt-8">
        <p>© 2025 Masala Taste Of India. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  ),
  getHtml: (imageUrl: string) => `
    <div style="font-family: sans-serif; max-width:600px; margin:auto; background:#f0fdfa; padding:24px; border-radius:8px;">
      <div style="text-align:center; margin-bottom:24px;">
        <img src="https://www.masala-gf.de/logo.jpg" alt="Logo" style="width:80px; margin-bottom:16px;" />
        <h1 style="font-size:24px; color:#0f766e; margin:0;">Willkommen bei Masala!</h1>
        <p style="margin:8px 0 0;">Vielen Dank, dass Sie ein geschätzter Kunde sind. Entdecken Sie jetzt unsere neuen Angebote.</p>
      </div>

      <div style="text-align:center; margin:24px 0;">
        <img src="${imageUrl}" alt="Angebot" style="width:100%; max-width:520px; border-radius:8px;" />
      </div>

      <div style="text-align:center; margin-top:24px;">
        <p style="margin:0; color:#374151;">Scannen Sie den QR-Code, um jetzt einzukaufen:</p>
        <img src="https://www.masala-gf.de/masala-gf-qr.png" alt="QR-Code" style="margin-top:8px; width:120px;" />
      </div>

      <div style="text-align:center; margin-top:32px;">
        <a href="https://www.masala-gf.de/" target="_blank" style="background-color:#0f766e; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold;">
          Jetzt besuchen: masala-gf.de
        </a>
      </div>

      <div style="text-align:center; color:#6b7280; font-size:12px; margin-top:32px;">
        <p style="margin:0;">© 2025 Masala Taste Of India. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  `,
}
,

  {
    id: 6,
    name: 'Template 6',
    component: ({ imageUrl }: TemplateProps) => (
      <div className="p-6 text-sm bg-yellow-50 rounded shadow">
        <h2 className="text-xl font-semibold text-yellow-700 text-center mb-4"> Special Deal!</h2>
        <p className="text-gray-700 text-center mb-4">Nutzen Sie <strong>JETZT10</strong> für 10% Rabatt auf Ihre nächste Bestellung!</p>
        <img src={imageUrl} className="w-full max-w-[400px] mx-auto rounded mb-4" alt="Promo" />
        <p className="text-center">
          <a href="https://www.masala-gf.de/" className="bg-yellow-600 text-white px-4 py-2 rounded font-bold">Jetzt Einkaufen</a>
        </p>
      </div>
    ),
    getHtml: (imageUrl: string) => `
      <div style="padding:24px; font-family:sans-serif; background:#fefce8; border-radius:8px;">
        <h2 style="color:#b45309; text-align:center;"> Special Deal!</h2>
        <p style="color:#444; margin-top:12px; text-align:center;">Nutzen Sie <strong>JETZT10</strong> für 10% Rabatt auf Ihre nächste Bestellung!</p>
        <div style="text-align:center; margin:20px 0;">
          <img src="${imageUrl}" style="max-width:400px; width:100%; border-radius:8px;" />
        </div>
        <div style="text-align:center;">
          <a href="https://www.masala-gf.de/" target="_blank" style="background:#f59e0b; color:white; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:bold;">Jetzt Einkaufen</a>
        </div>
      </div>
    `,
  },
  {
    id: 7,
    name: 'Template 7',
    component: ({ imageUrl }: TemplateProps) => (
      <div className="p-6 text-sm bg-green-50 rounded shadow">
        <h2 className="text-xl font-semibold text-green-700 text-center mb-4"> Neues Jahr, Neue Angebote</h2>
        <p className="text-gray-700 text-center mb-4">Begrüßen Sie das neue Jahr mit tollen Rabatten. Nur diese Woche!</p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li> 20% auf alle Gewürze</li>
          <li> Kostenloser Versand ab €30</li>
        </ul>
        <img src={imageUrl} className="w-full max-w-[400px] mx-auto rounded mb-4" alt="Offer" />
        <p className="text-center">
          <a href="https://www.masala-gf.de/" className="bg-green-600 text-white px-4 py-2 rounded font-bold">Jetzt Einkaufen</a>
        </p>
      </div>
    ),
    getHtml: (imageUrl: string) => `
      <div style="padding:24px; font-family:sans-serif; background:#ecfdf5; border-radius:8px;">
        <h2 style="color:#047857; text-align:center;"> Neues Jahr, Neue Angebote</h2>
        <p style="color:#333; text-align:center;">Begrüßen Sie das neue Jahr mit tollen Rabatten. Nur diese Woche!</p>
        <ul style="margin-top:16px; padding-left:20px;">
          <li> 20% auf alle Gewürze</li>
          <li> Kostenloser Versand ab €30</li>
        </ul>
        <div style="text-align:center; margin:20px 0;">
          <img src="${imageUrl}" style="max-width:400px; width:100%; border-radius:8px;" />
        </div>
        <div style="text-align:center;">
          <a href="https://www.masala-gf.de/" target="_blank" style="background:#10b981; color:white; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:bold;">Jetzt Einkaufen</a>
        </div>
      </div>
    `,
  },
]

export default function EmailTemplateGallery() {
  const { setTemplateMarketing } = useAppContext()
  const searchParams = useSearchParams()
  const imageUrl =
    searchParams.get('url') || 'https://via.placeholder.com/500x300.png?text=Dynamic+Image'

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    setSelectedIndex(index)
    const tpl = templates[index]
    const htmlContent = tpl.getHtml(imageUrl)
    const tempId = (tpl.id).toString();;
    setTemplateMarketing({
      templateId: tempId,
      content: htmlContent,
    })
  }

  return (
    <div className=" space-y-6">
      <h2 className="text-lg font-semibold">Select Design for marketing email</h2>
      {selectedIndex !== null && (
        <div className="mt-6">
          <CreateEmailTemplate />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl, index) => {
          const TemplateComponent = tpl.component
          const isSelected = selectedIndex === index

          return (
            <div
              key={tpl.id}
              className={`border rounded-lg p-4 shadow bg-white overflow-auto w-full relative ${
                isSelected ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              <label className="flex items-center gap-2 absolute top-3 right-3">
                <input
                  type="radio"
                  name="template"
                  checked={isSelected}
                  onChange={() => handleSelect(index)}
                />
                <span className="text-sm">Select</span>
              </label>

              <div onClick={() => handleSelect(index)} className="cursor-pointer">
                <TemplateComponent imageUrl={imageUrl} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
