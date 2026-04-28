import { Type } from "@google/genai";
import { BaseAgent, AgentContext } from "./base";
import { OptimisationSante } from "../../types";

export class ChefAgent extends BaseAgent {
  getName(): string {
    return "Chef de Cuisine et Coach Nutrition";
  }

  async analyze(context: AgentContext): Promise<OptimisationSante> {
    const systemInstruction = `
      Tu es le Chef de cuisine et expert nutrition de SafeScan.
      Ta mission est d'identifier un produit ultra-transformé ou améliorable sur le ticket.
      Propose une alternative plus saine en magasin ET une recette "Fait-Maison" simple.
      La recette doit être structurée en Markdown dans "recette_complete".
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
          type: Type.OBJECT,
          properties: {
            produit_analyse: { type: Type.STRING },
            alerte_ingredient: { type: Type.STRING },
            alternative_magasin: { type: Type.STRING },
            option_fait_maison: {
              type: Type.OBJECT,
              properties: {
                recette: { type: Type.STRING },
                recette_complete: { type: Type.STRING },
                economie_estimee: { type: Type.STRING }
              },
              required: ["recette", "recette_complete", "economie_estimee"]
            }
          },
          required: ["produit_analyse", "alerte_ingredient", "alternative_magasin", "option_fait_maison"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as OptimisationSante;
  }
}
