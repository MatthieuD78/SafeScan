import { SafeScanResponse, RecallAlert, AppSettings } from "../types";
import { AgentContext } from "./agents/base";
import { SecurityAgent } from "./agents/securityAgent";
import { InventoryAgent } from "./agents/inventoryAgent";
import { EconomyAgent } from "./agents/economyAgent";
import { ChefAgent } from "./agents/chefAgent";

export class SupervisorAgent {
  private securityAgent: SecurityAgent;
  private inventoryAgent: InventoryAgent;
  private economyAgent: EconomyAgent;
  private chefAgent: ChefAgent;

  constructor(apiKey: string) {
    this.securityAgent = new SecurityAgent(apiKey);
    this.inventoryAgent = new InventoryAgent(apiKey);
    this.economyAgent = new EconomyAgent(apiKey);
    this.chefAgent = new ChefAgent(apiKey);
  }

  async processReceipt(
    receiptText: string,
    recalls: RecallAlert[],
    settings: AppSettings
  ): Promise<SafeScanResponse> {
    const context: AgentContext = {
      receiptText,
      settings,
      recalls
    };

    console.log("Supervisor: Starting parallel analysis...");

    // Run agents in parallel for maximum speed
    const [securityRes, inventoryRes, chefRes] = await Promise.all([
      this.securityAgent.analyze(context),
      this.inventoryAgent.analyze(context),
      this.chefAgent.analyze(context)
    ]);

    // Economy agent might benefit from context produced by others if we wanted sequential,
    // but for now, we can run it in parallel too or slightly after.
    // Let's pass some structured data to Economy if needed.
    context.structuredData = {
      security: securityRes,
      inventory: inventoryRes,
      chef: chefRes
    };

    const economyRes = await this.economyAgent.analyze(context);

    return {
      alerte_sanitaire: securityRes,
      gestion_frigo: inventoryRes,
      optimisation_sante: chefRes,
      bilan_economique: economyRes.bilan_economique,
      details_economies: economyRes.details_economies
    };
  }
}
