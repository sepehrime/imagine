/**
 * Visual identity of each dataset class, shared by Sections 4 and 5.
 *
 * Colours are the first three slots of a categorical palette that was run
 * through a colour-blindness validator (light + dark mode). Slot 3 (aqua) is
 * below 3:1 contrast on the light surface, so every class also gets its own
 * marker SHAPE and a named legend — colour is never the only cue.
 *
 * Full literal class names so Tailwind's scanner keeps them.
 */
export const CLASS_STYLES = [
  {
    shape: "circle",
    fill: "fill-[#2a78d6] dark:fill-[#3987e5]",
    bg: "bg-[#2a78d6] dark:bg-[#3987e5]",
  },
  {
    shape: "square",
    fill: "fill-[#eb6834] dark:fill-[#d95926]",
    bg: "bg-[#eb6834] dark:bg-[#d95926]",
  },
  {
    shape: "triangle",
    fill: "fill-[#1baf7a] dark:fill-[#199e70]",
    bg: "bg-[#1baf7a] dark:bg-[#199e70]",
  },
];
