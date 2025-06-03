// components/AdminSyncButton.tsx
"use client";

import { useTransition } from "react";
import { syncNewOrders } from "../action/order/syncNewOrders";

export default function AdminSyncButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
      onClick={() => {
        startTransition(async () => {
          try {
            await syncNewOrders();
            alert("✅ Synced customer orders successfully!");
          } catch {
            alert("❌ Failed to sync.");
          }
        });
      }}
      disabled={isPending}
    >
      {isPending ? "Syncing..." : "Sync Customer Orders"}
    </button>
  );
}
