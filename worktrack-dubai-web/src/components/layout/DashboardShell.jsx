import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Topbar from './Topbar';

export default function DashboardShell({ title, children }) {
  return (
    <div className="flex min-h-screen bg-midnight">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} />
        <main className="flex-1 p-5 pb-20 md:pb-5 overflow-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
