import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GLOSSARY, findTerm, slugify } from "./glossary";
import { SECTIONS_NAV } from "../components/Header";

describe("glossary data", () => {
  it("has at least 25 terms, sorted alphabetically", () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(25);
    const terms = GLOSSARY.map((e) => e.term);
    expect(terms).toEqual([...terms].sort((a, b) => a.localeCompare(b)));
  });

  it("has unique slugs (they become #anchors)", () => {
    const slugs = GLOSSARY.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("links every term to at least one real section", () => {
    const ids = new Set(SECTIONS_NAV.map((s) => s.id));
    for (const entry of GLOSSARY) {
      expect(entry.sections.length, entry.term).toBeGreaterThan(0);
      for (const id of entry.sections) expect(ids.has(id), `${entry.term} → section ${id}`).toBe(true);
    }
  });

  it("finds terms by name or alias, case-insensitively", () => {
    expect(findTerm("Weights").term).toBe("Weight");
    expect(findTerm("loss").term).toBe("Loss Function");
    expect(findTerm("NODE").term).toBe("Neuron");
    expect(findTerm("not a term")).toBeNull();
  });

  it("slugifies terms for URLs", () => {
    expect(slugify("Loss Function")).toBe("loss-function");
    expect(slugify("ReLU")).toBe("relu");
  });

  it("defines every <GlossaryTerm> used in the pages", () => {
    const dir = new URL("../pages/", import.meta.url);
    const used = readdirSync(dir).flatMap((file) =>
      [...readFileSync(new URL(file, dir), "utf8").matchAll(/<GlossaryTerm\s+term="([^"]+)"/g)].map((m) => m[1])
    );
    expect(used.length).toBeGreaterThan(0);
    expect(used.filter((t) => !findTerm(t))).toEqual([]);
  });
});
