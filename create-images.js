const fs = require('fs');
const path = require('path');

class BitWriter {
  constructor() {
    this.bytes = [];
    this.curByte = 0;
    this.curBit = 0;
  }
  writeBits(val, numBits) {
    for (let i = 0; i < numBits; i++) {
      const bit = (val >> i) & 1;
      this.curByte |= (bit << this.curBit);
      this.curBit++;
      if (this.curBit === 8) {
        this.bytes.push(this.curByte);
        this.curByte = 0;
        this.curBit = 0;
      }
    }
  }
  finish() {
    if (this.curBit > 0) {
      this.bytes.push(this.curByte);
      this.curByte = 0;
      this.curBit = 0;
    }
    return Buffer.from(this.bytes);
  }
}

/**
 * Creates a valid Lossless WebP (VP8L) file.
 * Compatible with all modern WebP decoders (Chrome, Safari, Firefox, Edge, libwebp).
 */
function createValidWebP(width, height, r, g, b, a = 255) {
  const bw = new BitWriter();
  // Signature byte 0x2F
  bw.writeBits(0x2f, 8);
  // Width - 1 (14 bits)
  bw.writeBits((width - 1) & 0x3fff, 14);
  // Height - 1 (14 bits)
  bw.writeBits((height - 1) & 0x3fff, 14);
  // Alpha is used (1 bit)
  bw.writeBits(a < 255 ? 1 : 0, 1);
  // Version (3 bits = 0)
  bw.writeBits(0, 3);

  // Transform flag = 0 (no spatial transforms)
  bw.writeBits(0, 1);
  // Color cache = 0 (no color cache)
  bw.writeBits(0, 1);
  // Meta huffman groups = 0 (1 group)
  bw.writeBits(0, 1);

  // 5 Huffman trees (simple code, 1 symbol each)
  // Tree 0: Green / Literals (symbol = g)
  bw.writeBits(1, 1); // is_simple
  bw.writeBits(0, 1); // num_symbols - 1 = 0
  bw.writeBits(1, 1); // first_symbol_len_code = 1 (8 bits)
  bw.writeBits(g & 0xff, 8);

  // Tree 1: Red (symbol = r)
  bw.writeBits(1, 1);
  bw.writeBits(0, 1);
  bw.writeBits(1, 1);
  bw.writeBits(r & 0xff, 8);

  // Tree 2: Blue (symbol = b)
  bw.writeBits(1, 1);
  bw.writeBits(0, 1);
  bw.writeBits(1, 1);
  bw.writeBits(b & 0xff, 8);

  // Tree 3: Alpha (symbol = a)
  bw.writeBits(1, 1);
  bw.writeBits(0, 1);
  bw.writeBits(1, 1);
  bw.writeBits(a & 0xff, 8);

  // Tree 4: Distance (symbol = 0)
  bw.writeBits(1, 1);
  bw.writeBits(0, 1);
  bw.writeBits(0, 1); // len code 0
  bw.writeBits(0, 1);

  const payload = bw.finish();

  // WebP VP8L chunk (must be padded to even length)
  const isOdd = payload.length % 2 === 1;
  const chunkLen = payload.length + (isOdd ? 1 : 0);
  const vp8lChunk = Buffer.alloc(8 + chunkLen);
  vp8lChunk.write('VP8L', 0, 4, 'ascii');
  vp8lChunk.writeUInt32LE(payload.length, 4);
  payload.copy(vp8lChunk, 8);
  if (isOdd) vp8lChunk[8 + payload.length] = 0;

  // RIFF container
  const riff = Buffer.alloc(12);
  riff.write('RIFF', 0, 4, 'ascii');
  riff.writeUInt32LE(4 + vp8lChunk.length, 4);
  riff.write('WEBP', 8, 4, 'ascii');

  return Buffer.concat([riff, vp8lChunk]);
}

const imgDir = path.join(__dirname, 'img');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Generate images with distinctive burger restaurant color palettes
const images = [
  // OG Image 1200x630 required by prompt
  { name: 'og-image.webp', w: 1200, h: 630, r: 24, g: 24, b: 27 },
  { name: 'hero-banner.webp', w: 1200, h: 600, r: 30, g: 27, b: 24 },
  { name: 'logo.webp', w: 256, h: 256, r: 245, g: 158, b: 11 },
  { name: 'burger-double.webp', w: 600, h: 450, r: 217, g: 119, b: 6 },
  { name: 'burger-bacon.webp', w: 600, h: 450, r: 180, g: 83, b: 9 },
  { name: 'burger-classic.webp', w: 600, h: 450, r: 202, g: 138, b: 4 },
  { name: 'burger-trufado.webp', w: 600, h: 450, r: 87, g: 83, b: 78 },
  { name: 'burger-crispy.webp', w: 600, h: 450, r: 194, g: 65, b: 12 },
  { name: 'combo-individual.webp', w: 600, h: 450, r: 185, g: 28, b: 28 },
  { name: 'combo-casal.webp', w: 600, h: 450, r: 153, g: 27, b: 27 },
  { name: 'batata-rustica.webp', w: 600, h: 450, r: 234, g: 179, b: 8 },
  { name: 'batata-cheddar-bacon.webp', w: 600, h: 450, r: 245, g: 158, b: 11 },
  { name: 'onion-rings.webp', w: 600, h: 450, r: 217, g: 119, b: 6 },
  { name: 'bebida-coca.webp', w: 600, h: 450, r: 220, g: 38, b: 38 },
  { name: 'bebida-coca-zero.webp', w: 600, h: 450, r: 24, g: 24, b: 27 },
  { name: 'bebida-cha.webp', w: 600, h: 450, r: 190, g: 24, b: 93 },
  { name: 'sobremesa-pudim.webp', w: 600, h: 450, r: 251, g: 191, b: 36 },
  { name: 'sobremesa-shake.webp', w: 600, h: 450, r: 120, g: 53, b: 15 }
];

images.forEach(img => {
  const filePath = path.join(imgDir, img.name);
  const buf = createValidWebP(img.w, img.h, img.r, img.g, img.b);
  fs.writeFileSync(filePath, buf);
  console.log(`Created ${img.name} (${img.w}x${img.h}, ${buf.length} bytes)`);
});

console.log('All WebP images created successfully.');
