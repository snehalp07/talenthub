import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, RefreshCw, Eye, Download, Trash2, CheckCircle } from "lucide-react";
import { ResumeFile } from "@shared/schema";
import FileUpload from "@/components/ui/file-upload";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ResumeUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const { data: resumeFiles, isLoading } = useQuery<ResumeFile[]>({
    queryKey: ["/api/profile/1/resume"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("resume", file);
      
      const response = await fetch("/api/profile/1/resume", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile/1/resume"] });
      setSelectedFile(null);
      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (resumeId: number) => {
      return apiRequest("DELETE", `/api/resume/${resumeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile/1/resume"] });
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleDelete = (resumeId: number) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      deleteMutation.mutate(resumeId);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const currentResume = resumeFiles?.[0]; // Get the most recent resume

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <Card className="profile-card">
          <CardContent className="p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="profile-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">Resume Upload & Parsing</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Lightbulb className="w-4 h-4 mr-2" />
                Get Tips
              </Button>
              {currentResume && (
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-parse
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!currentResume ? (
            <div className="space-y-6">
              <FileUpload 
                onFileSelect={handleFileSelect}
                currentFile={selectedFile}
                onFileRemove={() => setSelectedFile(null)}
              />
              
              {selectedFile && (
                <div className="flex justify-center">
                  <Button 
                    onClick={handleUpload} 
                    disabled={uploadMutation.isPending}
                    size="lg"
                  >
                    {uploadMutation.isPending ? "Uploading..." : "Upload Resume"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Resume Display */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{currentResume.originalName}</h4>
                      <p className="text-sm text-gray-600">
                        Uploaded {formatDate(currentResume.uploadedAt)} • {formatFileSize(currentResume.fileSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(currentResume.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Parsing Results */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                    <h4 className="font-medium text-emerald-800">Resume Parsed Successfully</h4>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    {currentResume.parsingAccuracy || 95}% Accuracy
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-emerald-600">0</div>
                    <div className="text-sm text-emerald-700">Skills Detected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-emerald-600">0</div>
                    <div className="text-sm text-emerald-700">Experiences Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-emerald-600">0</div>
                    <div className="text-sm text-emerald-700">Education Records</div>
                  </div>
                </div>

                <Button className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Auto-fill Profile Sections
                </Button>
              </div>

              {/* Upload New Resume Option */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <h4 className="font-medium text-gray-800 mb-2">Upload a New Resume</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Replace your current resume with a newer version
                </p>
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  currentFile={selectedFile}
                  onFileRemove={() => setSelectedFile(null)}
                  className="border-none p-0"
                />
                
                {selectedFile && (
                  <div className="mt-4">
                    <Button 
                      onClick={handleUpload} 
                      disabled={uploadMutation.isPending}
                    >
                      {uploadMutation.isPending ? "Uploading..." : "Replace Resume"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resume Tips Card */}
      <Card className="profile-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
            Resume Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-sky-500 pl-4">
              <h4 className="font-medium text-gray-800 mb-1">ATS Optimization</h4>
              <p className="text-sm text-gray-600">
                Use standard fonts, clear headings, and avoid images or complex formatting for better ATS compatibility.
              </p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-4">
              <h4 className="font-medium text-gray-800 mb-1">Keyword Usage</h4>
              <p className="text-sm text-gray-600">
                Include relevant keywords from job descriptions in your experience and skills sections.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-800 mb-1">Quantify Achievements</h4>
              <p className="text-sm text-gray-600">
                Use numbers and metrics to demonstrate your impact (e.g., "Increased sales by 25%").
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
