"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

type Template = {
  id: string;
  name: string;
  url: string;
  createdAt: any;
};

export default function TemplateList() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const q = query(collection(db, "templates"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data: Template[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Template[];
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

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
              className="border rounded-xl shadow p-4 bg-white flex flex-col"
            >
              <h2 className="text-lg font-semibold mb-2">{template.name}</h2>
              <div className="text-sm text-gray-500 mb-2">
                {new Date(template.createdAt.seconds * 1000).toLocaleString()}
              </div>
              <iframe
                src={template.url}
                className="border w-full h-64 rounded"
                title={template.name}
              ></iframe>
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
