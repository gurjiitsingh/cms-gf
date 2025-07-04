// app/templates/page.tsx (or any route)

import { Suspense } from "react";
import EmailTemplateGallery from "./components/EmailTemplateGallery";


export default function TemplateGalleryPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Design</h1>
      <Suspense>
      <EmailTemplateGallery />
      </Suspense>
    </main>
   
  )
}