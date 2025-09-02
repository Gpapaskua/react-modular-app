import { useLocation, useNavigate } from "react-router";
import { INPUT_ROUTES, tabRoutes } from "./config";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InputsTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab =
    tabRoutes.find((tab) => location.pathname.endsWith(tab.value))?.value ??
    INPUT_ROUTES.CHEMISTRY;

  const onTabChange = (value: string) => {
    const newPath = tabRoutes.find((tab) => tab.value === value)?.path;
    if (newPath) {
      navigate(newPath);
    }
  };

  return (
    <Tabs
      value={currentTab}
      onValueChange={onTabChange}
      className="w-full max-w-xl"
    >
      <TabsList className="grid w-full grid-cols-5">
        {tabRoutes.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
