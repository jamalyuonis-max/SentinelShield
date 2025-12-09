import { GoogleGenAI } from "@google/genai";
import { Threat } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeThreatWithGemini = async (threat: Threat): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const prompt = `
      Act as a senior cybersecurity malware analyst. 
      Analyze the following threat signature and provide a technical report.
      
      Threat Name: ${threat.name}
      Type: ${threat.type}
      Hash: ${threat.hash}
      Severity: ${threat.severity}
      Path: ${threat.path}

      Please provide:
      1. A likely behavioral analysis (what does this malware typically do?).
      2. Potential impact on the endpoint system.
      3. Recommended remediation steps beyond simple deletion (e.g., registry checks, network isolation).
      
      Keep the response concise, technical, and formatted in Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple analysis
      }
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Analysis service is currently unavailable. Please check your network connection or API quota.";
  }
};
