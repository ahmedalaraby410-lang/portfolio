import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import zlib from "zlib";

const outDir = join(process.cwd(), "public", "images");
mkdirSync(outDir, { recursive: true });

const projects = [
  ["debt-box", [8, 12, 22], [205, 245, 106], [134, 231, 255]],
  ["sphinx-store", [9, 14, 17], [255, 118, 95], [205, 245, 106]],
  ["kkf", [9, 9, 18], [134, 231, 255], [246, 242, 234]],
  ["kashkom", [13, 9, 20], [255, 118, 95], [134, 231, 255]],
  ["utility-holding", [6, 11, 15], [246, 242, 234], [205, 245, 106]]
];

function crc32(buffer) {
  let crc = -1;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function mix(a, b, t) {
  return a.map((value, index) => Math.round(value + (b[index] - value) * t));
}

function draw(width, height, bg, accent, secondary, variant) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  const cx = width * (0.62 + variant * 0.05);
  const cy = height * (0.36 + variant * 0.04);

  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x += 1) {
      const i = row + 1 + x * 4;
      const gx = x / width;
      const gy = y / height;
      const radial = Math.max(0, 1 - Math.hypot((x - cx) / width, (y - cy) / height) * 2.2);
      const stripe = Math.sin((gx * 14 + gy * 8 + variant) * Math.PI) > 0.72 ? 0.12 : 0;
      let color = mix(bg, [20, 22, 28], gy * 0.55);
      color = mix(color, accent, radial * 0.58);
      color = mix(color, secondary, stripe);

      const panel =
        x > width * 0.11 &&
        x < width * 0.89 &&
        y > height * 0.18 &&
        y < height * 0.82 &&
        ((x + y + variant * 23) % 19 < 9 || variant === 0);

      if (panel) color = mix(color, [246, 242, 234], 0.08);

      const ring = Math.abs(Math.hypot((x - cx) / width, (y - cy) / height) - 0.24) < 0.004;
      if (ring) color = mix(color, secondary, 0.72);

      raw[i] = color[0];
      raw[i + 1] = color[1];
      raw[i + 2] = color[2];
      raw[i + 3] = 255;
    }
  }

  return raw;
}

function png(filename, width, height, bg, accent, secondary, variant) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = draw(width, height, bg, accent, secondary, variant);
  const buffer = Buffer.concat([signature, chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
  writeFileSync(join(outDir, filename), buffer);
}

for (const [name, bg, accent, secondary] of projects) {
  png(`${name}-cover.png`, 1600, 1000, bg, accent, secondary, 0);
  png(`${name}-gallery-1.png`, 1200, 900, bg, secondary, accent, 1);
  png(`${name}-gallery-2.png`, 1200, 900, bg, accent, secondary, 2);
}

png("default-cover.png", 1600, 1000, [7, 7, 10], [205, 245, 106], [134, 231, 255], 3);
png("og.png", 1200, 630, [5, 5, 7], [205, 245, 106], [246, 242, 234], 4);
