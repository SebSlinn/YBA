//src/services/interfaces/IQuickLinkService.ts

import { QuickLink } from "@/domain/quicklink/QuickLink";

export interface IQuickLinkService {
  getQuickLinks(): Promise<QuickLink[]>;
}
