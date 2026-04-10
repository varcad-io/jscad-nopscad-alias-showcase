import * as modeling from "@jscad/modeling";
import * as roundedCylinderLib from "@nopscad/utils/rounded_cylinder.scad?use";

const toFiniteNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["false", "0", "off", "no"].includes(normalized)) {
      return false;
    }
    if (["true", "1", "on", "yes"].includes(normalized)) {
      return true;
    }
  }
  return Boolean(value);
};

const normalizeVector3 = (value, fallback = [0, 0, 0]) => {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : value == null
        ? []
        : [value];
  const numbers = source
    .slice(0, 3)
    .map((entry, index) => toFiniteNumber(entry, fallback[index] ?? 0));
  while (numbers.length < 3) {
    numbers.push(fallback[numbers.length] ?? 0);
  }
  return numbers;
};

const degreesToRadians = (degrees) => (toFiniteNumber(degrees, 0) * Math.PI) / 180;

export function main({ variables = {} } = {}) {
  const supportRoundover = toFiniteNumber(variables.support_roundover, 0.55);
  const supportRadius = toFiniteNumber(variables.support_radius, 1.15);
  const supportChamfer = toFiniteNumber(variables.support_chamfer, 0.18);
  const showMarker = toBoolean(variables.show_marker, true);
  const markerOffset = normalizeVector3(variables.marker_offset_xyz, [1.2, 0.25, 0.25]);
  const markerRadius = toFiniteNumber(variables.marker_radius, 0.55);
  const displayScale = Math.max(0.25, toFiniteNumber(variables.display_scale, 1));
  const yawDeg = toFiniteNumber(variables.yaw_deg, 0);

  const parts = [
    roundedCylinderLib.rounded_cylinder(supportRoundover, supportRadius, supportChamfer),
  ];

  if (showMarker) {
    parts.push(
      modeling.transforms.translate(
        markerOffset,
        modeling.primitives.sphere({ radius: markerRadius, segments: 24 }),
      ),
    );
  }

  const combined = parts.length === 1 ? parts[0] : modeling.booleans.union(...parts);
  const scaled = modeling.transforms.scale(
    [displayScale, displayScale, displayScale],
    combined,
  );
  return yawDeg ? modeling.transforms.rotateZ(degreesToRadians(yawDeg), scaled) : scaled;
}
