"use client";

import React from "react";

type Props = {
  message: string;
  setMessage: (msg: string) => void;
};

export default function MessageEditor({ message, setMessage }: Props) {
  const insertAtCursor = (tag: string) => {
    const textarea = document.getElementById("message-box") as HTMLTextAreaElement;
    if (!textarea) return;

    const [start, end] = [textarea.selectionStart, textarea.selectionEnd];
    const selectedText = textarea.value.substring(start, end);
    const newText = `${textarea.value.substring(0, start)}${tag}${selectedText}${tag}${textarea.value.substring(end)}`;
    
    setMessage(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tag.length + selectedText.length + tag.length;
    }, 0);
  };

  return (
    <div className="mb-6">
      <label htmlFor="message-box" className="block font-medium mb-2">
        Marketing Message:
      </label>

      {/* Formatting Buttons */}
      <div className="mb-2 space-x-2">
        <button
          type="button"
          onClick={() => insertAtCursor("**")}
          className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => insertAtCursor("_")}
          className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => insertAtCursor("\n")}
          className="px-2 py-1 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Line Break
        </button>
      </div>

      {/* Message Textarea */}
      <textarea
        id="message-box"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        placeholder="Enter your marketing message here..."
        className="w-full border rounded p-2"
      />
    </div>
  );
}
