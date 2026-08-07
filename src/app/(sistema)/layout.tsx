import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function SistemaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white flex">
      <Sidebar />

      <main className="flex-1 overflow-auto p-10">{children}</main>
    </div>
  );
}
