import * as modeling from "@jscad/modeling";
import * as roundedCylinderLib from "/Libraries/NopSCAD/utils/rounded_cylinder.scad?use";

export function main() {
  return modeling.booleans.union(
    roundedCylinderLib.rounded_cylinder(0.55, 1.15, 0.18),
    modeling.transforms.translate(
      [1.2, 0.25, 0.25],
      modeling.primitives.sphere({ radius: 0.55, segments: 24 }),
    ),
  );
}
