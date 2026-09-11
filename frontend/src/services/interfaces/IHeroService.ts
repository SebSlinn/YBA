// frontend/src/services/interfaces/IHeroService.ts
//
// The seam: this is the only thing a component or a frontend-only chat
// needs to see. Swap Mock <-> Directus behind it without touching Hero.tsx.

import { HeroSlide } from "@/domain/hero/HeroSlide";

export interface IHeroService {
  /** Published hero slides, in carousel order. */
  getActive(): Promise<HeroSlide[]>;
}
