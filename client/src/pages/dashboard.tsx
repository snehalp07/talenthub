import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Eye, Star, Award, Edit, Lightbulb, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompleteProfile } from "@shared/schema";

export default function Dashboard() {
  const { data: profile, isLoading } = useQuery<CompleteProfile>({
    queryKey: ["/api/profile/1/complete"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getCompletedSections = () => {
    if (!profile) return 0;
    
    let completed = 0;
    const sections = [
      profile.profile.fullName,
      profile.education.length > 0,
      profile.skills.length > 0,
      profile.experience.length > 0,
      profile.projects.length > 0,
      profile.certifications.length > 0,
      profile.externalLinks.length > 0,
      profile.resumeFiles.length > 0,
    ];
    
    sections.forEach(section => {
      if (section) completed++;
    });
    
    return completed;
  };

  const completedSections = getCompletedSections();
  const totalSections = 8;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  const sectionStatus = [
    {
      name: "Personal Information",
      completed: !!profile?.profile.fullName,
      icon: CheckCircle,
    },
    {
      name: "Education",
      completed: (profile?.education.length || 0) > 0,
      icon: CheckCircle,
    },
    {
      name: "Skills",
      completed: (profile?.skills.length || 0) > 0,
      icon: CheckCircle,
    },
    {
      name: "Experience",
      completed: (profile?.experience.length || 0) > 0,
      icon: CheckCircle,
    },
    {
      name: "Projects",
      completed: (profile?.projects.length || 0) > 0,
      icon: CheckCircle,
    },
    {
      name: "Certifications",
      completed: (profile?.certifications.length || 0) > 0,
      icon: CheckCircle,
    },
    {
      name: "External Links",
      completed: (profile?.externalLinks.length || 0) > 0,
      icon: CheckCircle,
    },
    {
      name: "Resume Upload",
      completed: (profile?.resumeFiles.length || 0) > 0,
      icon: CheckCircle,
    },
  ];

  const recentActivity = [
    {
      action: "Profile created",
      time: "Just now",
      icon: Edit,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="stats-icon bg-emerald-100 text-emerald-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Sections</p>
                <p className="text-2xl font-semibold text-gray-900">{completedSections}/{totalSections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="stats-icon bg-purple-100 text-purple-600">
                <Eye className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="stats-icon bg-orange-100 text-orange-600">
                <Star className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profile Score</p>
                <p className="text-2xl font-semibold text-gray-900">{completionPercentage}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="stats-icon bg-sky-100 text-sky-600">
                <Award className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certifications</p>
                <p className="text-2xl font-semibold text-gray-900">{profile?.certifications.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Sections Status */}
        <Card className="profile-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">Profile Sections</CardTitle>
              <span className="text-sm text-sky-600 font-medium">{totalSections} sections</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sectionStatus.map((section, index) => (
                <div key={index} className="section-status-item">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        section.completed 
                          ? "bg-emerald-100 text-emerald-600" 
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        <section.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-700">{section.name}</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      section.completed 
                        ? "text-emerald-600" 
                        : "text-gray-500"
                    }`}>
                      {section.completed ? "Complete" : "Not Started"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-6">
              View All Sections
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="profile-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">Recent Activity</CardTitle>
              <span className="text-sm text-gray-500">Last 7 days</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mr-3 mt-1">
                      <activity.icon className="w-4 h-4 text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {recentActivity.length === 1 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">Start building your profile to see activity here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="profile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-800">AI Recommendations</CardTitle>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="recommendation-card">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-1">Complete Your Profile</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Adding more sections can increase your profile visibility by 40%
                  </p>
                  <Button size="sm" variant="outline">Take Action</Button>
                </div>
              </div>
            </div>

            <div className="recommendation-card">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                  <Award className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-1">Upload Your Resume</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload your resume to auto-fill profile sections and get ATS tips
                  </p>
                  <Button size="sm" variant="outline">Learn More</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
