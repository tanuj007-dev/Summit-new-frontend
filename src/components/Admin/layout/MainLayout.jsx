import { Sidebar } from './Sidebar';

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <main className="pl-64">
        <div className="min-h-screen p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
