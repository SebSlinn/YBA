//frontend/src/services/mock/MockDocumentService.ts

import { Document } from "@/domain/document/Document";
import {
  IDocumentService,
  DocumentQueryOptions,
} from "../interfaces/IDocumentService";

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "1",
    title: "Safeguarding & Child Protection Policy",
    category: "Safeguarding",
    documentType: "file",
    fileUrl: "/mock-files/safeguarding-policy.pdf",
    summary: "How we keep pupils safe, and what to do if you have a concern.",
    reviewDate: new Date("2026-01-15"),
    expiryDate: new Date("2027-01-15"),
    sort: 1,
    status: "published",
  },
  {
    id: "2",
    title: "SEND Information Report",
    category: "SEND & Inclusion",
    documentType: "page",
    pageSlug: "send-information-report",
    summary: "Our approach to supporting pupils with additional needs.",
    sort: 1,
    status: "published",
  },
  {
    id: "3",
    title: "Exam Results (Welsh Government)",
    category: "Curriculum & Exams",
    documentType: "link",
    externalUrl: "https://mylocalschool.gov.wales/School/6700000",
    summary: "Independently published performance data.",
    sort: 1,
    status: "published",
  },
  {
    id: "4",
    title: "Complaints Procedure",
    category: "General",
    documentType: "file",
    fileUrl: "/mock-files/complaints-procedure.pdf",
    sort: 1,
    status: "published",
  },
  {
    id: "5",
    title: "Admissions Policy",
    category: "General",
    documentType: "file",
    fileUrl: "/mock-files/admissions-policy.pdf",
    // Deliberately no expiry — some policies simply don't have one.
    sort: 2,
    status: "published",
  },
];

export class MockDocumentService implements IDocumentService {
  async getAll(options?: DocumentQueryOptions): Promise<Document[]> {
    const filtered = options?.category
      ? MOCK_DOCUMENTS.filter((d) => d.category === options.category)
      : MOCK_DOCUMENTS;

    return [...filtered].sort((a, b) =>
      a.category === b.category ? a.sort - b.sort : a.category.localeCompare(b.category)
    );
  }

  async getCategories(): Promise<string[]> {
    const seen = new Set<string>();
    const categories: string[] = [];

    for (const doc of MOCK_DOCUMENTS) {
      if (!seen.has(doc.category)) {
        seen.add(doc.category);
        categories.push(doc.category);
      }
    }

    return categories;
  }
}
