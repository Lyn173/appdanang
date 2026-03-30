import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateMimicDescription(
  referenceVideoBase64: string,
  referenceMimeType: string,
  targetVideoBase64: string,
  targetMimeType: string
): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Bạn là một chuyên gia sáng tạo nội dung bất động sản trên mạng xã hội (TikTok, Facebook Reels).
    
    Nhiệm vụ của bạn gồm 2 bước:
    1. Phân tích phong cách, giọng điệu, cách dùng từ và nhịp độ của "Video Tham Khảo" (Video 1).
    2. Viết một đoạn mô tả cho "Video Mục Tiêu" (Video 2) dựa trên phong cách của Video 1.
    
    Yêu cầu:
    - Mô tả phải trung thực và phản ánh chính xác nội dung trong Video 2.
    - Thứ tự nội dung trong mô tả phải khớp hoàn toàn với diễn biến trong Video 2 (khớp timeline).
    - Giữ nguyên phong cách, sự hài hước và cách xưng hô của Video 1.
    - Lời dẫn (intro) phải tự nhiên, hài hước, có thể dùng các câu như "Chào các vợ yêu/các tình yêu/các cục cưng..." và thay đổi linh hoạt để tránh bị đánh dấu spam.
    - Toàn bộ nội dung bằng tiếng Việt.
    - Làm nổi bật các ưu điểm của bất động sản trong Video 2.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: referenceMimeType,
            data: referenceVideoBase64,
          },
        },
        { text: "Đây là Video Tham Khảo (Video 1). Hãy phân tích phong cách của nó." },
        {
          inlineData: {
            mimeType: targetMimeType,
            data: targetVideoBase64,
          },
        },
        { text: "Đây là Video Mục Tiêu (Video 2). Hãy viết mô tả cho video này theo phong cách của Video 1, đảm bảo khớp timeline và nội dung của Video 2." },
      ],
    },
  });

  return response.text || "Không thể tạo mô tả.";
}

export async function generateViralDescription(
  videoBase64: string,
  mimeType: string
): Promise<string> {
  const model = "gemini-3-flash-preview";

  const prompt = `
    Bạn là một chuyên gia sáng tạo nội dung bất động sản trên TikTok/Facebook.
    Hãy viết một đoạn mô tả hấp dẫn (catchy) cho video bất động sản cho thuê này.
    
    Yêu cầu:
    - Mô tả phải trung thực, chính xác với những gì diễn ra trong video.
    - Làm nổi bật các ưu điểm của căn phòng/ngôi nhà.
    - Mô tả phải khớp hoàn toàn với diễn biến video (khớp timeline) để có thể chèn phụ đề.
    - Sử dụng các ý tưởng từ TikTok hoặc các câu nói viral trên mạng xã hội.
    - Lời dẫn (intro) phải tự nhiên, hài hước, xưng hô thân thiện (ví dụ: "Chào các vợ yêu/các tình yêu/các cục cưng...").
    - Thay đổi linh hoạt lời dẫn để tránh bị đánh dấu spam.
    - Toàn bộ nội dung bằng tiếng Việt.
    - Giọng văn hài hước, lôi cuốn.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType,
            data: videoBase64,
          },
        },
      ],
    },
  });

  return response.text || "Không thể tạo mô tả.";
}
