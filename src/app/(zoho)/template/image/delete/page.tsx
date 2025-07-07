'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebaseConfig'
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import Link from 'next/link'

type ImageData = {
  id: string
  url: string
}

export default function ImageListWithDelete() {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const q = query(collection(db, 'templateImages'), orderBy('uploadedAt', 'desc'))
        const snapshot = await getDocs(q)
        const imageList: ImageData[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          url: docSnap.data().url as string,
        }))
        setImages(imageList)
      } catch (err) {
        console.error('Error fetching images:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this image?')
    if (!confirm) return

    try {
      await deleteDoc(doc(db, 'templateImages', id))
      setImages((prev) => prev.filter((img) => img.id !== id))
    } catch (err) {
      console.error('Error deleting image:', err)
      alert('Failed to delete image')
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
    <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Uploaded Images</h2>
        <Link
          href="/template/image/upload"
          className="text-sm text-orange-600 hover:underline font-medium"
        >
          ← Back to Upload Page
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading images...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img) => (
          <div key={img.id} className="border rounded shadow overflow-hidden bg-white">
            <img src={img.url} alt="Uploaded" className="w-full h-48 object-cover" />
            <div className="p-3 flex justify-between items-center">
              <span className="text-sm text-gray-600 truncate">{img.url.split('/').pop()}</span>
              <button
                onClick={() => handleDelete(img.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && images.length === 0 && (
        <p className="text-gray-500 mt-4">No images found.</p>
      )}
    </div>
  )
}
