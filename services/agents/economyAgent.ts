import { Type } from "@google/genai";
import { BaseAgent, AgentContext } from "./base";
import { EconomieDetail } from "../../types";

export class EconomyAgent extends BaseAgent {
  getName(): string {
    return "Expert en Économies et Optimisation";
  }

  async analyze(context: AgentContext): Promise<{ bilan_economique: string; details_economies: EconomieDetail[] }> {
    const systemInstruction = `
      Tu es l'expert en optimisation budgétaire de SafeScan.
      Ta mission est de calculer les économies réalisées par l'utilisateur grâce à l'anti-gaspillage, aux remboursements potentiels et aux alternatives DIY.
      Fournis un bilan global (ex: "+12.50€") et le détail par source.
    `;

    const prompt = `
      TICKET :
      ${context.receiptText}
      
      CONTEXTE (Optionnel - Données déjà analysées par d'autres agents si disponibles) :
      ${JSON.stringify(context.structuredData || {})}
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
            bilan_economique: { type: Type.STRING },
            details_economies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  montant: { type: Type.STRING }
                },
                required: ["source", "montant"]
              }
            }
          },
          required: ["bilan_economique", "details_economies"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  }
}
