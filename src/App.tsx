import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Labs from "./pages/Labs";
import LabDetail from "./pages/LabDetail";
import Paths from "./pages/Paths";
import PathDetail from "./pages/PathDetail";
import Catalog from "./pages/Catalog";
import CourseDetail from "./pages/CourseDetail";
import Pricing from "./pages/Pricing";
import Community from "./pages/Community";
import Progress from "./pages/Progress";
import Docs from "./pages/Docs";
import CppLabPlayground from "./pages/playground/CppLab";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/labs/:slug" element={<LabDetail />} />
            <Route path="/paths" element={<Paths />} />
            <Route path="/paths/:slug" element={<PathDetail />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/community" element={<Community />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/playground/cpp" element={<CppLabPlayground />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
