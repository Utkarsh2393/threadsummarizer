import { GoogleGenAI } from "@google/genai";
import { SummaryData, Source, Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeQuery = async (query: string, history: Message[] = []): Promise<SummaryData> => {
  try {
    const isUrl = query.startsWith('http');
    const model = 'gemini-2.5-flash';

    // System Instruction - Relaxed constraints to allow helpful external context
    const systemInstruction = `
      You are ThreadDigest AI, an intelligent and helpful assistant specialized in summarizing online content.
      
      Your goal is to provide clear, comprehensive, and easy-to-understand summaries.
      
      GUIDELINES:
      1.  **Synthesize Information**: Read the provided content (or user query) and distill it into its most essential points.
      2.  **Add Value**: You MAY use your broad knowledge to explain technical terms, add necessary context, or clarify concepts mentioned in the thread if it helps the user understand better.
      3.  **Be Objective**: Report on the consensus and the conflicts within the discussion.

      OUTPUT FORMATTING:
      You MUST start your response with a single line containing the title, prefixed with "TITLE: ".
      Example:
      TITLE: Summary of Topic
      
      After the title line, provide the Markdown summary.
    `;

    // Construct context from history
    let context = "";
    if (history.length > 0) {
      context = "Previous Conversation Context:\n" + history.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join("\n") + "\n\n";
    }

    // Dynamic Prompt
    let userPrompt = "";
    if (isUrl) {
      userPrompt = `
        ${context}
        Analyze the content at this URL: ${query}
        
        Task:
        1. Extract the title.
        2. Provide a "Deep Dive" summary of the discussion.
        
        Structure:
        # 🧐 Executive Summary
        A high-level overview of the topic and the main sentiment.
        
        ## 🔑 Key Takeaways
        *   Critical facts, arguments, and consensus points.
        *   Highlight any interesting debates or unique perspectives.

        ## 💡 The Verdict
        A final "TL;DR" conclusion.
      `;
    } else {
      userPrompt = `
        ${context}
        Answer this query: "${query}"
        
        Task:
        1. Generate a clear title.
        2. Provide a comprehensive answer using your knowledge and the context provided.
        
        Structure:
        # 🎯 Direct Answer
        A clear, direct answer to the user's question.
        
        ## 📝 Details & Context
        *   Elaborate on important details.
        *   Provide examples or background info if helpful.
        
        ## 🔎 Conclusion
        A brief wrap-up.
      `;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 1024 },
      },
    });

    // Extract text
    let rawText = response.text || "No summary could be generated.";
    
    // Parse Title
    let title = isUrl ? "Link Summary" : query; // Fallback
    const titleMatch = rawText.match(/^TITLE:\s*(.*)/i);
    
    if (titleMatch) {
      title = titleMatch[1].trim();
      // Remove the title line from the markdown content to avoid duplication
      rawText = rawText.replace(/^TITLE:.*\n+/, '').trim();
    } else {
      // Fallback: Try to clean up if the model didn't strictly follow TITLE:
      const firstLine = rawText.split('\n')[0].trim();
      if (firstLine.length < 100 && !firstLine.startsWith('#')) {
         title = firstLine;
      }
    }

    // Extract sources
    const sources: Source[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Web Source",
            uri: chunk.web.uri,
          });
        }
      });
    }

    return {
      title: title,
      summary: rawText,
      sources: sources,
    };
  } catch (error) {
    console.error("Error analyzing query:", error);
    throw error;
  }
};
