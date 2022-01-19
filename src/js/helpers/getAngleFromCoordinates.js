const ONE_DEGREES_IN_RAD = 0.0174533;

const arcTanOfAllQuadrants = ({
  coordinates = { x: 0, y: 0 },
  origin = { x: 0, y: 0 },
  typeOutput = "rad",
} = {}) => {
  let slope = (coordinates.y - origin.y) / (coordinates.x - origin.x);

  if (slope === Infinity && coordinates.y < origin.y) {
    slope = Number.NEGATIVE_INFINITY;
  }

  let slopeAngleRad = Math.atan(slope);

  if (coordinates.x < origin.x) {
    slopeAngleRad <= 0
      ? (slopeAngleRad += Math.PI)
      : (slopeAngleRad -= Math.PI);
  }

  if (typeOutput === "rad") {
    return slopeAngleRad;
  } else if (typeOutput === "deg") {
    const slopeAngleDeg = (slopeAngleRad * 180) / Math.PI;
    return slopeAngleDeg;
  }
};

export default arcTanOfAllQuadrants;

export { ONE_DEGREES_IN_RAD };
