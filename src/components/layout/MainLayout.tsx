import { Outlet } from "react-router-dom";
import { Sidebar } from "../nav/Sidebar";

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-[70px] md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};
