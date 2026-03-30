import React, { useCallback, useRef, useState } from "react";
import { Upload, X, Video, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoUploadProps {
  label: string;
  onUpload: (base64: string, mimeType: string) => void;
  onClear: () => void;
  className?: string;
  description?: string;
}

export function VideoUpload({ label, onUpload, onClear, className, description }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) {
      alert("Vui lòng tải lên tệp video.");
      return;
    }

    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(",")[1];
      onUpload(base64, file.type);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const clearFile = useCallback(() => {
    setFileName(null);
    setPreviewUrl(null);
    onClear();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [onClear]);

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      
      {!fileName ? (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all cursor-pointer",
            isDragging 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept="video/*"
            className="hidden"
          />
          <div className="flex flex-col items-center space-y-2 text-gray-500">
            <Upload className="w-8 h-8" />
            <span className="text-sm">Kéo thả hoặc nhấn để tải video</span>
          </div>
        </div>
      ) : (
        <div className="relative group rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
          <video 
            src={previewUrl!} 
            className="w-full h-48 object-cover opacity-80"
            muted
            loop
            onMouseOver={(e) => e.currentTarget.play()}
            onMouseOut={(e) => e.currentTarget.pause()}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Video className="w-8 h-8 mb-2" />
            <span className="text-xs font-medium truncate max-w-[80%]">{fileName}</span>
          </div>
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-gray-600 hover:text-red-500 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span className="text-[10px] font-semibold text-gray-700">Đã tải lên</span>
          </div>
        </div>
      )}
    </div>
  );
}
