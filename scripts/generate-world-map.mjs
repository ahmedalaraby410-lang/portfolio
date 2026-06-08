import fs from "node:fs";

const inputPath = process.argv[2] ?? "/tmp/countries.geojson";
const outputPath = process.argv[3] ?? "public/world-network-map.svg";
const geojson = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const width = 1440;
const height = 700;
const xPadding = 40;
const yPadding = 32;
const minLatitude = -60;
const maxLatitude = 85;

function project([longitude, latitude]) {
  return [
    xPadding + ((longitude + 180) / 360) * (width - xPadding * 2),
    yPadding + ((maxLatitude - latitude) / (maxLatitude - minLatitude)) * (height - yPadding * 2)
  ];
}

function perpendicularDistance(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point[0] - (start[0] + t * dx), point[1] - (start[1] + t * dy));
}

function simplify(points, tolerance = 0.6) {
  if (points.length <= 3) return points;
  let furthestIndex = 0;
  let furthestDistance = 0;

  for (let index = 1; index < points.length - 1; index += 1) {
    const distance = perpendicularDistance(points[index], points[0], points.at(-1));
    if (distance > furthestDistance) {
      furthestDistance = distance;
      furthestIndex = index;
    }
  }

  if (furthestDistance <= tolerance) return [points[0], points.at(-1)];
  return [
    ...simplify(points.slice(0, furthestIndex + 1), tolerance).slice(0, -1),
    ...simplify(points.slice(furthestIndex), tolerance)
  ];
}

function polygonRings(geometry) {
  if (geometry.type === "Polygon") return geometry.coordinates;
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flat();
  return [];
}

function ringPath(ring) {
  const points = simplify(ring.map(project));
  if (points.length < 3) return "";
  return `M${points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L")}Z`;
}

function pointInRing(point, ring) {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index, index += 1) {
    const [x, y] = ring[index];
    const [previousX, previousY] = ring[previous];
    const intersects = y > point[1] !== previousY > point[1] &&
      point[0] < ((previousX - x) * (point[1] - y)) / (previousY - y) + x;
    if (intersects) inside = !inside;
  }
  return inside;
}

const landRings = geojson.features
  .filter((feature) => feature.properties?.ISO_A3 !== "ATA")
  .flatMap((feature) => polygonRings(feature.geometry));

const countryPaths = landRings.map(ringPath).filter(Boolean).join("");
const projectedRings = landRings.map((ring) => ring.map(project));
const nodes = [];

for (let y = 78; y < 625; y += 34) {
  for (let x = 62; x < 1380; x += 38) {
    const jitterX = Math.sin(x * 0.071 + y * 0.017) * 9;
    const jitterY = Math.cos(x * 0.029 + y * 0.043) * 7;
    const point = [x + jitterX, y + jitterY];
    if (projectedRings.some((ring) => pointInRing(point, ring))) nodes.push(point);
  }
}

const edges = [];
const edgeKeys = new Set();

nodes.forEach((node, index) => {
  const nearest = nodes
    .map((candidate, candidateIndex) => ({
      candidate,
      candidateIndex,
      distance: Math.hypot(candidate[0] - node[0], candidate[1] - node[1])
    }))
    .filter(({ candidateIndex, distance }) => candidateIndex !== index && distance < 72)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  nearest.forEach(({ candidate, candidateIndex }) => {
    const key = [index, candidateIndex].sort((a, b) => a - b).join("-");
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push(`<path d="M${node[0].toFixed(1)},${node[1].toFixed(1)}L${candidate[0].toFixed(1)},${candidate[1].toFixed(1)}"/>`);
  });
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <g fill="#fff" fill-opacity=".018" stroke="#f5f5f4" stroke-opacity=".22" stroke-width=".65" vector-effect="non-scaling-stroke">
    <path d="${countryPaths}"/>
  </g>
  <g fill="none" stroke="#fff" stroke-opacity=".105" stroke-width=".55" vector-effect="non-scaling-stroke">
    ${edges.join("")}
  </g>
  <g fill="#fff" fill-opacity=".3">
    ${nodes.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r=".85"/>`).join("")}
  </g>
</svg>`;

fs.writeFileSync(outputPath, svg);
console.log(`Generated ${outputPath} with ${nodes.length} nodes and ${edges.length} connections.`);
