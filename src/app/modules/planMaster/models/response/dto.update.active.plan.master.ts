import { AppResponseData } from "@neon-lab-dev/platform";
import { PlanMasterUpdateError } from "./dto.plan.master.update.error";

export class UpdateActivePlanMasterResponse implements AppResponseData {

  totalCount: number;
  successCount: number = 0;
  private error: PlanMasterUpdateError[] = [];

  constructor(totalCount: number) {
    this.totalCount = totalCount;
  }

  public appendError(currentError: PlanMasterUpdateError): void {
    this.error.push(currentError);
  }

  public setSuccessCount(): void {
    this.successCount = Math.max(
      0,
      this.totalCount - this.error.length
    );
  }

  public fetchError(): PlanMasterUpdateError[] {
    return [...this.error]; // defensive copy
  }
}
