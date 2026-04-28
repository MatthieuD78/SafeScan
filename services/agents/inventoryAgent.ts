import { Type } from "@google/genai";
import { BaseAgent, AgentContext } from "./base";
import { FridgeItem } from "../../types";

export class InventoryAgent extends BaseAgent {
  getName(): string {
    return "Expert en Gestion d'Inventaire (Frigo/Placard)";
  }

  async analyze(context: AgentContext): Promise<FridgeItem[]> {
    const systemInstruction = `
      Tu es l'expert en gestion d'inventaire de SafeScan.
      Ta mission est d'estimer la durée de conservation des produits frais présents sur le ticket.
      Propose des conseils de conservation pour éviter le gaspillage.
      Estime la valeur monétaire de l'article pour sensibiliser l'utilisateur.
    `;

    const prompt = `
      TICKET :
      ${context.receiptText}
    `;

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              article: { type: Type.STRING },
              conso_avant: { type: Type.STRING },
              conseil: { type: Type.STRING },
              valeur_estimee: { type: Type.STRING }
            },
            required: ["article", "conso_avant", "conseil", "valeur_estimee"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]') as FridgeItem[];
  }
}
