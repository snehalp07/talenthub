import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const pageTitles = {
  "/": { title: "Dashboard", description: "Build and manage your professional profile" },
  "/dashboard": { title: "Dashboard", description: "Build and manage your professional profile" },
  "/personal": { title: "Personal Information", description: "Manage your basic profile details" },
  "/education": { title: "Education", description: "Add your educational background" },
  "/skills": { title: "Skills", description: "Showcase your technical and soft skills" },
  "/experience": { title: "Work Experience", description: "Detail your professional journey" },
  "/projects": { title: "Projects", description: "Highlight your key projects and achievements" },
  "/certifications": { title: "Certifications", description: "Display your professional certifications" },
  "/links": { title: "External Links", description: "Connect your social and professional profiles" },
  "/resume": { title: "Resume Upload", description: "Upload and parse your resume automatically" },
  "/preview": { title: "Profile Preview", description: "Preview and share your completed profile" },
};

export default function Header() {
  const [location] = useLocation();
  const { toast } = useToast();
  
  const currentPage = pageTitles[location as keyof typeof pageTitles] || pageTitles["/dashboard"];

  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description: "Your profile PDF is being generated...",
    });
    // TODO: Implement PDF export functionality
  };

  const handleShareProfile = () => {
    const publicUrl = `${window.location.origin}/public/profile/1`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link Copied",
      description: "Profile link has been copied to clipboard",
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{currentPage.title}</h1>
          <p className="text-sm text-gray-600 mt-1">{currentPage.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleShareProfile}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </Button>
        </div>
      </div>
    </header>
  );
}
