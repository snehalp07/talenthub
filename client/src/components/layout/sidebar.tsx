import { Link, useLocation } from "wouter";
import { 
  User, 
  GraduationCap, 
  Settings, 
  Briefcase, 
  FolderOpen, 
  Award, 
  ExternalLink, 
  Upload, 
  Eye,
  BarChart3
} from "lucide-react";

const navigationItems = [
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/personal", label: "Personal Info", icon: User },
  { path: "/education", label: "Education", icon: GraduationCap },
  { path: "/skills", label: "Skills", icon: Settings },
  { path: "/experience", label: "Experience", icon: Briefcase },
  { path: "/projects", label: "Projects", icon: FolderOpen },
  { path: "/certifications", label: "Certifications", icon: Award },
  { path: "/links", label: "External Links", icon: ExternalLink },
  { path: "/resume", label: "Resume Upload", icon: Upload },
  { path: "/preview", label: "Preview & Share", icon: Eye },
];

export default function Sidebar() {
  const [location] = useLocation();

  const getCompletionPercentage = () => {
    // Calculate based on completed sections
    // This would be connected to actual profile data
    return 75;
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-sky-400 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-800">TalentHub</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path || (location === "/" && item.path === "/dashboard");
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Completeness */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="bg-sky-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Complete</span>
              <span className="text-sm font-semibold text-sky-600">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-sky-500 to-sky-400 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getCompletionPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
