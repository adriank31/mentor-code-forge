import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import PuzzleDetail from "./pages/PuzzleDetail";
import Labs from "./pages/Labs";
import LabDetail from "./pages/LabDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Paths from "./pages/Paths";
import PathDetail from "./pages/PathDetail";
import PathLesson from "./pages/PathLesson";
import CourseDetail from "./pages/CourseDetail";
import Pricing from "./pages/Pricing";
import Community from "./pages/Community";
import Progress from "./pages/Progress";
import Docs from "./pages/Docs";
import CppLabPlayground from "./pages/playground/CppLab";
import NotFound from "./pages/NotFound";
import Assessment from "./pages/Assessment";
import Auth from "./pages/Auth";

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/practice/puzzles/:slug" element={<PuzzleDetail />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/labs/:slug" element={<LabDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/paths" element={<Paths />} />
            <Route path="/paths/:slug" element={<PathDetail />} />
            <Route path="/paths/:slug/:moduleId/:lessonId" element={<PathLesson />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/community" element={<Community />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/playground/cpp" element={<CppLabPlayground />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
