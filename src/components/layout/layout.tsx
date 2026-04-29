import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import Header from "./header";
import { AppSidebar } from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {

  return (

    <div className="flex w-screen h-screen">
      <SidebarProvider>

        <AppSidebar />

        <div className="bg-[#F2F9FA] hidden">
          <SidebarTrigger />
        </div>

        <main className="bg-[#F4F7FE] text-[#0B1437] p-5  w-full h-screen overflow-y-scroll" >

            <Header />
            {/* Conteudo Principal */}
            {children}
            <Toaster position="bottom-right" />
        </main>
      </SidebarProvider >
    </div >


  )
}
