"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

interface FileUploadButtonProps {
  onFileSelect: (file: File) => Promise<void>;
  acceptedFileTypes?: string;
  maxFileSizeInBytes?: number;
  buttonText?: string;
}

export function FileUpload({
  onFileSelect,
  acceptedFileTypes = "*",
  maxFileSizeInBytes = 5 * 1024 * 1024, // 5MB default
  buttonText = "Upload File",
}: FileUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > maxFileSizeInBytes) {
      setError(
        `File size exceeds ${maxFileSizeInBytes / (1024 * 1024)}MB limit.`
      );
      return;
    }

    setIsUploading(true);
    try {
      await onFileSelect(file);
      // Reset the file input after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError("An error occurred while uploading the file.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    // Reset error state when opening file dialog
    setError(null);
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={acceptedFileTypes}
        className="hidden"
        key={isUploading ? "uploading" : "idle"}
      />
      <Button
        onClick={handleButtonClick}
        disabled={isUploading}
        className="flex items-center gap-2"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {isUploading ? "Uploading..." : buttonText}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
