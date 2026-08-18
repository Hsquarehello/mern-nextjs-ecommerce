import { AdminSidebar } from "@/components/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/20">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area (Orders, Products, Page များ ပေါ်မည့်နေရာ) */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
