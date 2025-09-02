import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation } from "react-router";
import { Toaster } from "../ui/sonner";

const navigationTree = [
  {
    id: "map",
    title: "Map",
    href: "/map",
  },
  {
    id: "inputs",
    title: "Inputs",
    href: "/inputs",
  },
  {
    id: "calculate",
    title: "Calculate",
    href: "/calculate",
  },
  {
    id: "outputs",
    title: "Outputs",
    href: "/outputs",
  },
];

const MainLayout = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const activeParentId = pathSegments.length > 0 ? pathSegments[0] : null;

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-col sm:flex-row gap-4 min-h-14 items-center justify-between border-b bg-background p-4 sm:px-6">
          <h1 className="text-lg font-semibold">
            Non-industrial flow{" "}
            <span className="text-muted-foreground font-normal">
              - Baseline - Summer
            </span>
          </h1>
          <NavigationMenu>
            <NavigationMenuList>
              {navigationTree.map((route) => (
                <NavigationMenuItem key={route.id}>
                  <Link to={route.href}>
                    <NavigationMenuLink
                      className={cn(navigationMenuTriggerStyle(), {
                        "bg-accent text-accent-foreground":
                          route.id === activeParentId,
                      })}
                    >
                      {route.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
          <Toaster />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
