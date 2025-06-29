"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Cloud,
  HardDrive,
  Settings,
  Check,
  X,
  Loader2,
} from "lucide-react";

interface CloudStorageProps {
  recording: {
    id: string;
    blob: Blob;
    timestamp: Date;
    duration: number;
  };
  onUploadComplete?: (platform: string, url?: string) => void;
}

interface StorageConfig {
  googleDrive: {
    enabled: boolean;
    accessToken?: string;
  };
  icloud: {
    enabled: boolean;
    configured: boolean;
  };
  local: {
    enabled: boolean;
    path: string;
  };
}

export default function CloudStorage({
  recording,
  onUploadComplete,
}: CloudStorageProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadStatus, setUploadStatus] = useState<{
    [key: string]: "pending" | "uploading" | "success" | "error";
  }>({});
  const [config, setConfig] = useState<StorageConfig>({
    googleDrive: {
      enabled: false,
    },
    icloud: {
      enabled: false,
      configured: false,
    },
    local: {
      enabled: true,
      path: "Downloads",
    },
  });
  const [showSettings, setShowSettings] = useState(false);

  const uploadToGoogleDrive = async () => {
    if (!config.googleDrive.enabled || !config.googleDrive.accessToken) {
      throw new Error("Google Drive not configured");
    }

    setUploadStatus((prev) => ({ ...prev, googleDrive: "uploading" }));

    const formData = new FormData();
    formData.append(
      "file",
      recording.blob,
      `recording-${recording.timestamp.toISOString()}.webm`
    );

    try {
      const response = await fetch("/api/upload/google-drive", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.googleDrive.accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      setUploadStatus((prev) => ({ ...prev, googleDrive: "success" }));
      onUploadComplete?.("googleDrive", result.url);
    } catch (error) {
      console.error("Google Drive upload failed:", error);
      setUploadStatus((prev) => ({ ...prev, googleDrive: "error" }));
    }
  };

  const uploadToiCloud = async () => {
    if (!config.icloud.enabled || !config.icloud.configured) {
      throw new Error("iCloud not configured");
    }

    setUploadStatus((prev) => ({ ...prev, icloud: "uploading" }));

    try {
      const formData = new FormData();
      formData.append(
        "file",
        recording.blob,
        `recording-${recording.timestamp.toISOString()}.webm`
      );

      const response = await fetch("/api/upload/icloud", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      setUploadStatus((prev) => ({ ...prev, icloud: "success" }));
      onUploadComplete?.("icloud", result.url);
    } catch (error) {
      console.error("iCloud upload failed:", error);
      setUploadStatus((prev) => ({ ...prev, icloud: "error" }));
    }
  };

  const saveToLocal = async () => {
    setUploadStatus((prev) => ({ ...prev, local: "uploading" }));

    try {
      // Use the File System Access API if available (Chrome)
      if ("showSaveFilePicker" in window) {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: `recording-${recording.timestamp.toISOString()}.webm`,
          types: [
            {
              description: "Video files",
              accept: { "video/webm": [".webm"] },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(recording.blob);
        await writable.close();
      } else {
        // Fallback to download
        const url = URL.createObjectURL(recording.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `recording-${recording.timestamp.toISOString()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setUploadStatus((prev) => ({ ...prev, local: "success" }));
      onUploadComplete?.("local");
    } catch (error) {
      console.error("Local save failed:", error);
      setUploadStatus((prev) => ({ ...prev, local: "error" }));
    }
  };

  const handleUploadAll = async () => {
    setIsUploading(true);
    const uploads = [];

    if (config.googleDrive.enabled) {
      uploads.push(uploadToGoogleDrive());
    }
    if (config.icloud.enabled) {
      uploads.push(uploadToiCloud());
    }
    if (config.local.enabled) {
      uploads.push(saveToLocal());
    }

    try {
      await Promise.allSettled(uploads);
    } finally {
      setIsUploading(false);
    }
  };

  const connectGoogleDrive = async () => {
    try {
      // This would typically use Google OAuth
      const response = await fetch("/api/auth/google-drive");
      const { accessToken } = await response.json();

      setConfig((prev) => ({
        ...prev,
        googleDrive: {
          enabled: true,
          accessToken,
        },
      }));
    } catch (error) {
      console.error("Failed to connect Google Drive:", error);
    }
  };

  const connectiCloud = async () => {
    try {
      // This would connect to iCloud API
      const response = await fetch("/api/auth/icloud");

      setConfig((prev) => ({
        ...prev,
        icloud: {
          enabled: true,
          configured: true,
        },
      }));
    } catch (error) {
      console.error("Failed to connect iCloud:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return <Loader2 className='w-4 h-4 animate-spin' />;
      case "success":
        return <Check className='w-4 h-4 text-green-500' />;
      case "error":
        return <X className='w-4 h-4 text-red-500' />;
      default:
        return null;
    }
  };

  return (
    <div className='space-y-4'>
      {/* Upload Options */}
      <div className='flex flex-col space-y-2'>
        <h4 className='text-sm font-medium'>Upload Options</h4>

        {/* Google Drive */}
        <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
          <div className='flex items-center space-x-3'>
            <Cloud className='w-5 h-5 text-blue-500' />
            <div>
              <p className='text-sm font-medium'>Google Drive</p>
              <p className='text-xs text-gray-500'>
                {config.googleDrive.enabled ? "Connected" : "Not connected"}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {getStatusIcon(uploadStatus.googleDrive)}
            {!config.googleDrive.enabled ? (
              <Button variant='outline' size='sm' onClick={connectGoogleDrive}>
                Connect
              </Button>
            ) : (
              <Button
                variant='outline'
                size='sm'
                onClick={uploadToGoogleDrive}
                disabled={isUploading}
              >
                Upload
              </Button>
            )}
          </div>
        </div>

        {/* iCloud */}
        <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
          <div className='flex items-center space-x-3'>
            <Cloud className='w-5 h-5 text-gray-500' />
            <div>
              <p className='text-sm font-medium'>iCloud Drive</p>
              <p className='text-xs text-gray-500'>
                {config.icloud.configured ? "Connected" : "Not connected"}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {getStatusIcon(uploadStatus.icloud)}
            {!config.icloud.configured ? (
              <Button variant='outline' size='sm' onClick={connectiCloud}>
                Connect
              </Button>
            ) : (
              <Button
                variant='outline'
                size='sm'
                onClick={uploadToiCloud}
                disabled={isUploading}
              >
                Upload
              </Button>
            )}
          </div>
        </div>

        {/* Local Storage */}
        <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
          <div className='flex items-center space-x-3'>
            <HardDrive className='w-5 h-5 text-green-500' />
            <div>
              <p className='text-sm font-medium'>Local Storage</p>
              <p className='text-xs text-gray-500'>
                Save to {config.local.path}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {getStatusIcon(uploadStatus.local)}
            <Button
              variant='outline'
              size='sm'
              onClick={saveToLocal}
              disabled={isUploading}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Upload All Button */}
      <Button
        onClick={handleUploadAll}
        disabled={isUploading}
        className='w-full'
      >
        {isUploading ? (
          <>
            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
            Uploading...
          </>
        ) : (
          <>
            <Upload className='w-4 h-4 mr-2' />
            Upload to All Connected Services
          </>
        )}
      </Button>

      {/* Settings */}
      <Button
        variant='outline'
        size='sm'
        onClick={() => setShowSettings(!showSettings)}
        className='w-full'
      >
        <Settings className='w-4 h-4 mr-2' />
        Storage Settings
      </Button>

      {showSettings && (
        <div className='p-4 bg-gray-50 rounded-lg space-y-3'>
          <h5 className='text-sm font-medium'>Storage Configuration</h5>

          <div className='space-y-2'>
            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={config.googleDrive.enabled}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    googleDrive: {
                      ...prev.googleDrive,
                      enabled: e.target.checked,
                    },
                  }))
                }
              />
              <span className='text-sm'>Auto-upload to Google Drive</span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={config.icloud.enabled}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    icloud: { ...prev.icloud, enabled: e.target.checked },
                  }))
                }
              />
              <span className='text-sm'>Auto-upload to iCloud Drive</span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                checked={config.local.enabled}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    local: { ...prev.local, enabled: e.target.checked },
                  }))
                }
              />
              <span className='text-sm'>Always save locally</span>
            </label>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium'>
              Local Save Path:
            </label>
            <input
              type='text'
              value={config.local.path}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  local: { ...prev.local, path: e.target.value },
                }))
              }
              className='w-full px-3 py-2 text-sm border border-gray-300 rounded-md'
              placeholder='Downloads'
            />
          </div>
        </div>
      )}
    </div>
  );
}
