//frontend/src/services/interfaces/IAlumniService.ts
import { AlumniStory } from "@/domain/alumni/AlumniStory";

export interface AlumniQueryOptions {
  limit?: number;
}

export interface IAlumniService {
  getLatest(options?: AlumniQueryOptions): Promise<AlumniStory[]>;

  getBySlug(slug: string): Promise<AlumniStory | null>;
}
