import { Calendar, Home, Inbox } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSearchParams } from "react-router";

const items = [
  {
    title: "Reactor",
    value: "reactor",
    icon: Home,
  },
  {
    title: "Cooling Towers",
    value: "cooling_towers",
    icon: Inbox,
  },
  {
    title: "Compilance Points",
    value: "compilance_points",
    icon: Calendar,
  },
];

export default function UnitsSidebar() {
  const [_, setSearchParams] = useSearchParams();
  return (
    <Sidebar collapsible="icon">
      <SidebarInset className="top-0 sm:top-18">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Units</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => setSearchParams({ unit: item.value })}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarInset>
    </Sidebar>
  );
}
