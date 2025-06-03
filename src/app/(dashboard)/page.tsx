// app/dashboard/page.tsx
export default function DashboardHome() {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Welcome to the Dashboard</h2>
        <p className="text-gray-700">
          Use the sidebar to manage customers, send emails, and view recent orders.
        </p>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-semibold">Customers</h3>
            <p className="text-gray-600">Manage customer records and contact info.</p>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-semibold">Orders</h3>
            <p className="text-gray-600">Review and track recent orders.</p>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-semibold">Send Email</h3>
            <p className="text-gray-600">Send notifications and promotions to users.</p>
          </div>
        </div>
      </div>
    )
  }
  