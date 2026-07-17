import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type Props = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export default function MainLayout({
  children,
  title,
  subtitle,
}: Props) {
  return (
    <div className="flex h-screen bg-[#F5F7FA]">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Header
          title={title}
          subtitle={subtitle}
        />

        <main className="flex-1 overflow-auto p-8">

          {children}

        </main>

      </div>

    </div>
  );
}