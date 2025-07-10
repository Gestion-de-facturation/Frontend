import Sidebar from '@/components/Sidebar';
import UserInfo from '@/components/user/UserInfo';
import '@/styles/normalize.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100">
        <div className="flex justify-end border-b-1 border-[#cccccc] h-16 shadow-md sticky top-0 z-40">
          <UserInfo />
        </div>
        <div className='dashboard'>
          {children}
        </div>
      </main>
    </div>
  );
}
