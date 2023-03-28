import type { Mode } from "../types";

export const modeInfo: Record<Mode, { name: string; desc: string }> = {
  choropleth: { name: "Census 2021", desc: "Simple map of Census 2021 results" },
  dotdensity: { name: "Dot-density 2021", desc: "Dot-density map of Census 2021 results" },
  change: { name: "Change since 2011", desc: "Ten year change since Census 2011" },
};
