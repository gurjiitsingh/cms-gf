"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

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

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const q = query(collection(db, "emailTemplates"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data: Template[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Template, "id">),
        }));
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "emailTemplates", id));
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete template:", err);
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📂 Saved Templates</h1>
      {loading ? (
        <p>Loading...</p>
      ) : templates.length === 0 ? (
        <p>No templates found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="relative border rounded-xl shadow p-4 bg-white flex flex-col"
            >
              {/* Top bar with template name and 3-dot menu */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{template.name}</h2>
                <div className="relative">
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
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Template creation time */}
              <div className="text-sm text-gray-500 mb-2">
                {new Date(template.createdAt?.seconds * 1000).toLocaleString()}
              </div>

              {/* Template preview */}
              <iframe
                src={template.url}
                className="border w-full h-64 rounded"
                title={template.name}
              ></iframe>

              {/* Full view link */}
              <a
                href={template.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline mt-2 text-sm"
              >
                Open Full Template
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
