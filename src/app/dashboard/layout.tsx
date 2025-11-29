import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden lg:pl-72">
        <TopBar />
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}