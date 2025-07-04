'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebaseConfig'
import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore'

export default function UploadImageOnly() {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const router = useRouter()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    setUploading(true)

    try {
      const res = await fetch('/api/zoho/image/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Image upload failed')

      const data = await res.json()
      const imageUrl = data.url

      setImages((prev) => [imageUrl, ...prev])
      setSelectedImage(imageUrl) // Auto-select uploaded image
    } catch (err) {
      console.error('Upload error:', err)
      alert('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'templateImages'), orderBy('uploadedAt', 'desc'))
        const snapshot = await getDocs(q)
        const urls = snapshot.docs.map((doc) => doc.data().url as string)
        setImages(urls)
      } catch (err) {
        console.error('Error fetching images:', err)
      }
    }

    fetchImages()
  }, [])

  const handleUseImage = () => {
    if (selectedImage) {
      const encodedUrl = encodeURIComponent(selectedImage)
      router.push(`/template/image/templates?url=${encodedUrl}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-bold">Step 1: Upload New Offer Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
      />

      {uploading && <p className="text-sm text-gray-500">Uploading image...</p>}

      {selectedImage && (
        <div className="border p-4 rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">✅ Selected Image</h3>
          <img src={selectedImage} alt="Selected" className="max-h-64 rounded" />
          <button
            onClick={handleUseImage}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Use Selected Image
          </button>
        </div>
      )}

      <h2 className="text-xl font-bold">Step 2: Select from the List</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <label key={index} className="block border rounded overflow-hidden shadow cursor-pointer">
            <img src={url} alt={`Image ${index}`} className="w-full h-48 object-cover" />
            <div className="p-2">
              <input
                type="radio"
                name="selectedImage"
                value={url}
                checked={selectedImage === url}
                onChange={() => setSelectedImage(url)}
                className="mr-2"
              />
              <span>Select this image</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
