import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import UnitsSidebar from "./units-sidebar";
import InputsTabs from "./inputs-tabs";

export default function InputsPage() {
  return (
    <SidebarProvider>
      <UnitsSidebar />
      <div className="flex w-full flex-col gap-4">
        <InputsTabs />
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
