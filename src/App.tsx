import React, { useState, useCallback } from "react";
import { 
  Video, 
  Sparkles, 
  Copy, 
  Check, 
  Wand2, 
  LayoutDashboard, 
  Zap, 
  Info, 
  AlertCircle,
  MessageSquareQuote,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { VideoUpload } from "@/components/VideoUpload";
import { ResultDisplay } from "@/components/ResultDisplay";
import { generateMimicDescription, generateViralDescription } from "@/services/gemini";

type Tab = "mimic" | "viral";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("mimic");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for Mimic Style
  const [mimicRefVideo, setMimicRefVideo] = useState<{ base64: string; mimeType: string } | null>(null);
  const [mimicTargetVideo, setMimicTargetVideo] = useState<{ base64: string; mimeType: string } | null>(null);
  const [mimicResult, setMimicResult] = useState("");

  // State for Viral Description
  const [viralVideo, setViralVideo] = useState<{ base64: string; mimeType: string } | null>(null);
  const [viralResult, setViralResult] = useState("");

  const handleMimicGenerate = async () => {
    if (!mimicRefVideo || !mimicTargetVideo) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateMimicDescription(
        mimicRefVideo.base64,
        mimicRefVideo.mimeType,
        mimicTargetVideo.base64,
        mimicTargetVideo.mimeType
      );
      setMimicResult(result);
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tạo mô tả. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViralGenerate = async () => {
    if (!viralVideo) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateViralDescription(
        viralVideo.base64,
        viralVideo.mimeType
      );
      setViralResult(result);
    } catch (err) {
      console.error(err);
      setError("Đã xảy ra lỗi khi tạo mô tả. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">AI Rental Video Assistant</h1>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://ai.google.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
            >
              Powered by Gemini
              <Sparkles className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight"
          >
            Tạo mô tả video <span className="text-blue-600">bất động sản</span> viral trong nháy mắt
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 leading-relaxed"
          >
            Sử dụng AI để phân tích phong cách video viral hoặc tạo ra những lời dẫn hấp dẫn, hài hước và chính xác cho căn phòng của bạn.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-gray-100 rounded-2xl shadow-inner">
            <button
              onClick={() => setActiveTab("mimic")}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                activeTab === "mimic" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <MessageSquareQuote className="w-4 h-4" />
              Bắt chước phong cách
            </button>
            <button
              onClick={() => setActiveTab("viral")}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                activeTab === "viral" 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <TrendingUp className="w-4 h-4" />
              Tạo mô tả Viral
            </button>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "mimic" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === "mimic" ? 20 : -20 }}
            transition={{ duration: 0.2 }}
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Left Column: Uploads */}
            <div className="space-y-8">
              {activeTab === "mimic" ? (
                <>
                  <VideoUpload
                    label="1. Video Tham Khảo (Viral)"
                    description="Tải lên video có phong cách bạn muốn bắt chước."
                    onUpload={(base64, mimeType) => setMimicRefVideo({ base64, mimeType })}
                    onClear={() => setMimicRefVideo(null)}
                  />
                  <VideoUpload
                    label="2. Video Mục Tiêu (Của bạn)"
                    description="Tải lên video bất động sản bạn muốn quảng bá."
                    onUpload={(base64, mimeType) => setMimicTargetVideo({ base64, mimeType })}
                    onClear={() => setMimicTargetVideo(null)}
                  />
                </>
              ) : (
                <VideoUpload
                  label="Video Bất Động Sản"
                  description="Tải lên video căn phòng/ngôi nhà của bạn để tạo mô tả hấp dẫn."
                  onUpload={(base64, mimeType) => setViralVideo({ base64, mimeType })}
                  onClear={() => setViralVideo(null)}
                />
              )}

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-blue-900">Cách hoạt động</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      {activeTab === "mimic" 
                        ? "AI sẽ xem Video 1 để học phong cách nói chuyện, sau đó xem Video 2 để viết mô tả cho Video 2 nhưng dùng giọng điệu của Video 1. Cực kỳ hiệu quả để 'copy' các video đang hot!"
                        : "AI sẽ phân tích từng giây trong video của bạn để viết mô tả chính xác nhất. Lời dẫn sẽ được thay đổi ngẫu nhiên để video của bạn luôn độc đáo và không bị bóp tương tác."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
              {activeTab === "mimic" ? (
                <ResultDisplay
                  title="Mô tả theo phong cách viral"
                  content={mimicResult}
                  isLoading={isLoading}
                  onGenerate={handleMimicGenerate}
                  canGenerate={!!mimicRefVideo && !!mimicTargetVideo}
                />
              ) : (
                <ResultDisplay
                  title="Mô tả Viral hấp dẫn"
                  content={viralResult}
                  isLoading={isLoading}
                  onGenerate={handleViralGenerate}
                  canGenerate={!!viralVideo}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-12 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-gray-400">
            © 2026 AI Rental Video Assistant. All rights reserved.
            <p className="mt-1">Bản quyền thuộc về Thùy Ngân</p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Xây dựng cho tương lai bất động sản</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
