import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto pb-17 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
