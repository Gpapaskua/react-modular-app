import { Navigate, Route, Routes } from "react-router";
import MainLayout from "./layouts/main-layout";
import ComingSoonPage from "@/pages/coming-soon";
import InputsPage from "@/pages/inputs";
import ChemistryPage from "../pages/inputs/chemistry";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/inputs" replace />} />
        <Route path="/map" element={<ComingSoonPage />} />
        <Route path="/calculate" element={<ComingSoonPage />} />
        <Route path="/outputs" element={<ComingSoonPage />} />
        <Route path="/inputs" element={<InputsPage />}>
            <Route path='general' element={ <ComingSoonPage />} />
            <Route path='consumption' element={ <ComingSoonPage />} />
            <Route path='pipes' element={ <ComingSoonPage />} />
            <Route path='chemistry' element={ <ChemistryPage />} />
            <Route index element={ <ChemistryPage />} />
            <Route path='reuse' element={ <ComingSoonPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/inputs" replace />} />
    </Routes>
  );
};

export default AppRoutes;
