import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden bg-black dark:bg-black">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden lg:pl-72">
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-black dark:bg-black">
          {children}
        </main>
      </div>
    </div>
  );
}