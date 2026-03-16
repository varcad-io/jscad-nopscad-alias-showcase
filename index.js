import * as modeling from "@jscad/modeling";
import { createNopShape } from "/Libraries/NopSCAD";

export function main() {
  return modeling.booleans.union(
    createNopShape(),
    modeling.transforms.translate(
      [1.2, 0.25, 0.25],
      modeling.primitives.sphere({ radius: 0.55, segments: 24 }),
    ),
  );
}
