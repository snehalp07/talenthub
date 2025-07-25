import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import PersonalInfo from "@/pages/personal-info";
import Education from "@/pages/education";
import Skills from "@/pages/skills";
import Experience from "@/pages/experience";
import Projects from "@/pages/projects";
import Certifications from "@/pages/certifications";
import ExternalLinks from "@/pages/external-links";
import ResumeUpload from "@/pages/resume-upload";
import ProfilePreview from "@/pages/profile-preview";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/personal" component={PersonalInfo} />
            <Route path="/education" component={Education} />
            <Route path="/skills" component={Skills} />
            <Route path="/experience" component={Experience} />
            <Route path="/projects" component={Projects} />
            <Route path="/certifications" component={Certifications} />
            <Route path="/links" component={ExternalLinks} />
            <Route path="/resume" component={ResumeUpload} />
            <Route path="/preview" component={ProfilePreview} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
