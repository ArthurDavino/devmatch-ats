import { describe, it, expect } from "vitest";
import { analyze } from "./analyze";

describe("analyze", () => {
  it("treats JS/JavaScript, Postgres/PostgreSQL, ReactJS/React as the same keyword", () => {
    const r = analyze("Requisitos: JavaScript, PostgreSQL e React", "Experiência com JS, Postgres e ReactJS");
    expect(r.score).toBe(100);
    expect(r.missingCount).toBe(0);
  });

  it("never inserts missing keywords into the adjusted resume", () => {
    const r = analyze("Requisitos: Python, Kubernetes", "Dev Python com 3 anos de experiência");
    expect(r.missing["Cloud e DevOps"].map((k) => k.name)).toContain("Kubernetes");
    expect(r.adjustedResume).not.toMatch(/kubernetes/i);
  });
});
