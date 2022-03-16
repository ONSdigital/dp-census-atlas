
import type { Bbox } from "../types";

export const getBboxString = (args: Bbox) => {
  return [args.east, args.north, args.west, args.south].map(n => n.toFixed(6)).join(',');
}
