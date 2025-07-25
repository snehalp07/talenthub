import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Edit, QrCode, Share2, ExternalLink, Linkedin, Github, Globe } from "lucide-react";
import { CompleteProfile } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePreviewPage() {
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery<CompleteProfile>({
    queryKey: ["/api/profile/1/complete"],
  });

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/public/profile/1`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link Copied",
      description: "Profile link has been copied to clipboard",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description: "Your profile PDF is being generated...",
    });
    // TODO: Implement PDF export functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Professional Profile",
        text: "Check out my professional profile",
        url: `${window.location.origin}/public/profile/1`,
      });
    } else {
      handleCopyLink();
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("linkedin")) return Linkedin;
    if (platformLower.includes("github")) return Github;
    return Globe;
  };

  const getPlatformColor = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes("linkedin")) return "text-blue-600";
    if (platformLower.includes("github")) return "text-gray-800";
    return "text-green-600";
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <Card className="profile-card">
          <CardContent className="p-6">
            <div className="h-96 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/public/profile/1`;

  return (
    <div className="space-y-6">
      {/* Sharing Options */}
      <Card className="profile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">Profile Preview & Sharing</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Mode
              </Button>
              <Button onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 mb-8">
            <h4 className="font-medium text-sky-800 mb-4">Share Your Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Public Profile Link</label>
                <div className="flex">
                  <Input 
                    value={publicUrl} 
                    readOnly 
                    className="rounded-r-none"
                  />
                  <Button onClick={handleCopyLink} className="rounded-l-none">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="form-label">QR Code</label>
                <div className="w-20 h-20 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <Button onClick={handleShare} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Preview */}
      <Card className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-400 p-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {profile?.profile.fullName 
                ? profile.profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                : 'U'
              }
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {profile?.profile.fullName || "Your Name"}
              </h2>
              <p className="text-xl text-sky-100 mb-2">
                {profile?.profile.title || "Your Professional Title"}
              </p>
              <p className="text-sky-100">
                {profile?.profile.location || "Your Location"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* About */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  About
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {profile?.profile.summary || "Add your professional summary to tell your story."}
                </p>
              </div>

              {/* Skills */}
              {profile?.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill.id} className="skill-tag">
                        {skill.name}
                        {skill.level && (
                          <span className="ml-1 text-xs opacity-75">
                            ({skill.level})
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* External Links */}
              {profile?.externalLinks && profile.externalLinks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    Links
                  </h3>
                  <div className="space-y-2">
                    {profile.externalLinks.map((link) => {
                      const PlatformIcon = getPlatformIcon(link.platform);
                      const platformColor = getPlatformColor(link.platform);
                      
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link"
                        >
                          <PlatformIcon className={`w-4 h-4 ${platformColor}`} />
                          {link.displayText || link.platform}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Experience */}
              {profile?.experience && profile.experience.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    Experience
                  </h3>
                  <div className="space-y-4">
                    {profile.experience.map((exp) => (
                      <div key={exp.id} className="experience-item">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{exp.jobTitle}</h4>
                            <p className="text-sky-600 font-medium">{exp.company}</p>
                            {exp.location && (
                              <p className="text-gray-600 text-sm">{exp.location}</p>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate || "Present"}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {profile?.education && profile.education.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    Education
                  </h3>
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <div key={edu.id} className="education-item">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                            <p className="text-sky-600 font-medium">{edu.institution}</p>
                            {edu.fieldOfStudy && (
                              <p className="text-gray-600 text-sm">{edu.fieldOfStudy}</p>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {edu.startDate} - {edu.isCurrentlyStudying ? "Present" : edu.endDate || "Present"}
                          </span>
                        </div>
                        {edu.description && (
                          <p className="text-sm text-gray-600">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {profile?.projects && profile.projects.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    Projects
                  </h3>
                  <div className="space-y-4">
                    {profile.projects.map((project) => (
                      <div key={project.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{project.title}</h4>
                            <div className="flex space-x-4 mt-1">
                              {project.projectUrl && (
                                <a
                                  href={project.projectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-600 hover:text-sky-700 text-sm flex items-center"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Live Demo
                                </a>
                              )}
                              {project.repositoryUrl && (
                                <a
                                  href={project.repositoryUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 hover:text-gray-700 text-sm flex items-center"
                                >
                                  <Github className="w-3 h-3 mr-1" />
                                  Code
                                </a>
                              )}
                            </div>
                          </div>
                          {(project.startDate || project.endDate) && (
                            <span className="text-sm text-gray-500">
                              {project.startDate} - {project.endDate || "Ongoing"}
                            </span>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                        )}
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {profile?.certifications && profile.certifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    Certifications
                  </h3>
                  <div className="space-y-3">
                    {profile.certifications.map((cert) => (
                      <div key={cert.id} className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">{cert.name}</h4>
                          <p className="text-sky-600 font-medium text-sm">{cert.issuer}</p>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-600 hover:text-sky-700 text-sm flex items-center mt-1"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Credential
                            </a>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 text-right">
                          {cert.issueDate && <div>Issued: {cert.issueDate}</div>}
                          {cert.expiryDate && <div>Expires: {cert.expiryDate}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
