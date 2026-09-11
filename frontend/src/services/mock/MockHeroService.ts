// frontend/src/services/mock/MockHeroService.ts

import { IHeroService } from "../interfaces/IHeroService";
import { HeroSlide } from "@/domain/hero/HeroSlide";

const MOCK_SLIDES: HeroSlide[] = [
  {
    id: "mock-1",
    heading: "Dream. Reach. Achieve.",
    image: "/hero-placeholder.jpg",
    focalPoint: { x: 50, y: 30 },
    order: 0,
  },
];

export class MockHeroService implements IHeroService {
  async getActive(): Promise<HeroSlide[]> {
    return MOCK_SLIDES;
  }
}
