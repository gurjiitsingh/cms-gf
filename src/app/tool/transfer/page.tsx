// components/AdminSyncButton.tsx
"use client";

import { syncCustomerLastOrders } from "@/app/action/order/syncCustomerLastOrders"
import { useTransition } from "react";

export default function AdminSyncButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
      onClick={() => {
        startTransition(async () => {
          try {
            await syncCustomerLastOrders();
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
