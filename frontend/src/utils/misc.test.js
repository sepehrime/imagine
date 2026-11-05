import { describe, expect, it } from "vitest";
import { suggestNextSection } from "./suggestNextSection";
import { fromPx, fromPy, toPx, toPy, PLOT_PAD, PLOT_SIZE } from "./plotScale";
import { newEntries } from "../hooks/useTraining";

const SECTIONS = [1, 2, 3, 4, 5].map((id) => ({ id }));

describe("suggestNextSection", () => {
  it("suggests the first incomplete section", () => {
    expect(suggestNextSection(SECTIONS, [])).toBe(1);
    expect(suggestNextSection(SECTIONS, [1, 3])).toBe(2); // fills gaps
  });
  it("returns null when everything is complete", () => {
    expect(suggestNextSection(SECTIONS, [1, 2, 3, 4, 5])).toBeNull();
  });
});

describe("plotScale", () => {
  it("maps the [-1, 1] square into the padded plot, with +y up", () => {
    expect(toPx(-1)).toBe(PLOT_PAD);
    expect(toPx(1)).toBe(PLOT_SIZE - PLOT_PAD);
    expect(toPy(1)).toBe(PLOT_PAD); // top
    expect(toPy(-1)).toBe(PLOT_SIZE - PLOT_PAD); // bottom
  });
  it("round-trips data → pixel → data", () => {
    for (const v of [-1, -0.3, 0, 0.42, 1]) {
      expect(fromPx(toPx(v))).toBeCloseTo(v);
      expect(fromPy(toPy(v))).toBeCloseTo(v);
    }
  });
});

describe("newEntries (training history merge)", () => {
  const h = (from, to) => Array.from({ length: to - from }, (_, i) => ({ epoch: from + i }));

  it("keeps an incremental poll as-is", () => {
    // client has 10 entries, server sends entries 10..14
    const status = { history_length: 15, history: h(10, 15) };
    expect(newEntries(status, 10).map((e) => e.epoch)).toEqual([10, 11, 12, 13, 14]);
  });
  it("slices a full snapshot down to the unseen part", () => {
    // pause/start responses send the whole history
    const status = { history_length: 15, history: h(0, 15) };
    expect(newEntries(status, 12).map((e) => e.epoch)).toEqual([12, 13, 14]);
  });
  it("returns nothing when there's nothing new", () => {
    expect(newEntries({ history_length: 5, history: h(0, 5) }, 5)).toEqual([]);
  });
});
