import { GoogleGenAI } from "@google/genai";
import { AppSettings, RecallAlert } from "../../types";

export interface AgentContext {
  receiptText: string;
  settings: AppSettings;
  recalls?: RecallAlert[];
  structuredData?: any; // To be populated by a parser agent or shared state
}

export abstract class BaseAgent {
  protected ai: GoogleGenAI;
  protected model: string = 'gemini-3-flash-preview';

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  abstract getName(): string;
  abstract analyze(context: AgentContext): Promise<any>;
}
