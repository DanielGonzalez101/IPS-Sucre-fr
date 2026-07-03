import Sidebar from "@/components/admin/Sidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--color-gris-50)" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}