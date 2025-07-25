import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  currentFile?: File | null;
  className?: string;
  disabled?: boolean;
}

export default function FileUpload({
  onFileSelect,
  onFileRemove,
  acceptedFileTypes = [".pdf", ".doc", ".docx"],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  currentFile = null,
  className,
  disabled = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
      setDragActive(false);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: maxFileSize,
    multiple: false,
    disabled,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return <File className="w-6 h-6 text-red-600" />;
  };

  if (currentFile) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getFileIcon(currentFile.name)}
            <div>
              <h4 className="font-medium text-gray-800">{currentFile.name}</h4>
              <p className="text-sm text-gray-600">{formatFileSize(currentFile.size)}</p>
            </div>
          </div>
          {onFileRemove && (
            <Button variant="outline" size="sm" onClick={onFileRemove}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "file-upload-area",
        isDragActive && "drag-over",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="max-w-md mx-auto">
        <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-800 mb-2">Upload Your Resume</h4>
        <p className="text-sm text-gray-600 mb-4">
          Drag and drop your resume here, or click to browse
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Supports {acceptedFileTypes.join(", ")} (Max {formatFileSize(maxFileSize)})
        </p>
        <Button disabled={disabled}>
          <CloudUpload className="w-4 h-4 mr-2" />
          Choose File
        </Button>
      </div>
    </div>
  );
}
