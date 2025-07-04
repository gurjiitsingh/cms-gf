'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

type Template = {
  id: string;
  name: string;
  url: string;
  createdAt: any;
};

export default function TemplateList() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const { setTemplateUrl } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const q = query(collection(db, 'emailTemplates'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data: Template[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Template, 'id'>),
        }));
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'emailTemplates', id));
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete template:', err);
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  const handleUseTemplate = () => {
    const selected = templates.find((t) => t.id === selectedTemplateId);
    if (selected) {
      setTemplateUrl(selected.url);
      router.push('/campaigns/create-campaign');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
         <h2 className="text-xl font-bold mb-6 text-slate-500">You can create new Template if not in list</h2>
    <button
      onClick={() => router.push('/template/create/select-option')}
      className="bg-green-300 text-white py-1 px-2  rounded hover:bg-green-500 transition"
    >
      ➕ Create New Template
    </button>
  </div>
      <h2 className="text-2xl font-bold mb-6 text-slate-500">Select Template from list to Send Campaign</h2>

      {selectedTemplateId && (
        <div className="mb-6">
          <button
            onClick={handleUseTemplate}
            className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Use Selected Template
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : templates.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative border rounded-xl shadow bg-white p-4 cursor-pointer ${
                selectedTemplateId === template.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedTemplateId(template.id)}
            >
              {/* Header: Radio & Date */}
              <div className="flex justify-between items-center mb-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="selectedTemplate"
                    value={template.id}
                    checked={selectedTemplateId === template.id}
                    onChange={() => setSelectedTemplateId(template.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>Select Template for Campaign</span>
                </label>
                <div className="text-sm text-gray-500">
                  {new Date(template.createdAt?.seconds * 1000).toLocaleString()}
                </div>
              </div>

              {/* Overflow Menu */}
              <div
                className="absolute top-3 right-3"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => toggleMenu(template.id)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ⋮
                </button>
                {openMenuId === template.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Template Preview */}
              <iframe
                src={template.url}
                className="w-full h-96 border rounded"
                title={template.name}
              />

              {/* Open Link */}
              <a
                href={template.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-600 underline mt-2 text-sm inline-block"
              >
                🔗 Open Full Template
              </a>

              {/* Line to click */}
              <p className="text-xs text-center text-gray-500 mt-2">
                Click anywhere to select this template
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
