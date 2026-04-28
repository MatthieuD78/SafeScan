import { SafeScanResponse, RecallAlert, AppSettings } from "../types";
import { SupervisorAgent } from "./agentSystem";

export class GeminiService {
  private supervisor: SupervisorAgent;

  constructor() {
    this.supervisor = new SupervisorAgent(process.env.API_KEY || '');
  }

  async analyzeReceipt(
    receiptText: string, 
    recalls: RecallAlert[], 
    settings: AppSettings
  ): Promise<SafeScanResponse> {
    try {
      return await this.supervisor.processReceipt(receiptText, recalls, settings);
    } catch (error) {
      console.error("GeminiService Analysis Error:", error);
      throw error;
    }
  }
}
