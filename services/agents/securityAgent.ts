import { Type } from "@google/genai";
import { BaseAgent, AgentContext } from "./base";
import { AlerteSanitaire } from "../../types";

export class SecurityAgent extends BaseAgent {
  getName(): string {
    return "Expert en Sécurité Sanitaire";
  }

  async analyze(context: AgentContext): Promise<AlerteSanitaire> {
    const systemInstruction = `
      Tu es l'expert en sécurité sanitaire de SafeScan.
      Ta mission est de comparer les articles du ticket avec la liste des rappels officiels.
      Si un produit, une marque et un lot correspondent à un rappel (ou si la probabilité est très élevée), tu dois déclencher une alerte CRITIQUE.
      Sinon, le statut reste AUCUN.
    `;

    const prompt = `
      チケットのテキスト (TABLET TEXT):
      ${context.receiptText}

      FLUX DE RAPPELS (OFFICIAL RECALLS):
      ${JSON.stringify(context.recalls || [])}
    `;

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            produit: { type: Type.STRING },
            marque: { type: Type.STRING },
            lot_detecte: { type: Type.STRING },
            statut: { type: Type.STRING, enum: ["CRITIQUE", "AUCUN"] },
            motif: { type: Type.STRING },
            procedure_remboursement: { type: Type.STRING }
          },
          required: ["produit", "marque", "lot_detecte", "statut", "motif", "procedure_remboursement"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as AlerteSanitaire;
  }
}
