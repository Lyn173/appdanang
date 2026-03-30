import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  content: string;
  isLoading: boolean;
  onGenerate: () => void;
  canGenerate: boolean;
  title?: string;
}

export function ResultDisplay({ content, isLoading, onGenerate, canGenerate, title }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          {title || "Kết quả mô tả"}
        </h3>
        <button
          onClick={onGenerate}
          disabled={!canGenerate || isLoading}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all shadow-md",
            canGenerate && !isLoading
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang xử lý...</span>
            </div>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Tạo mô tả</span>
            </>
          )}
        </button>
      </div>

      <div className="relative min-h-[200px] p-6 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all">
        {content ? (
          <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed">
            <ReactMarkdown>{content}</ReactMarkdown>
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-blue-600"
              title="Sao chép"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 space-y-2">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <Sparkles className="w-6 h-6 opacity-20" />
            </div>
            <p className="text-sm italic">Mô tả sẽ xuất hiện ở đây sau khi bạn nhấn nút tạo</p>
          </div>
        )}
      </div>
    </div>
  );
}
