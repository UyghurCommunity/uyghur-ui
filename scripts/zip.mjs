// Small deterministic ZIP writer for checked-in SVG downloads. STORE needs no dependency.
const crcTable = Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ value >>> 1 : value >>> 1;
  return value >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ crc >>> 8;
  return (crc ^ 0xffffffff) >>> 0;
}
export function zipFiles(entries) {
  const local = [], central = [], seen = new Set(); let offset = 0;
  for (const [filename, content] of entries) {
    if (!/^[a-zA-Z0-9_./-]+$/.test(filename) || filename.startsWith('/') || filename.split('/').includes('..') || seen.has(filename)) throw new Error('Invalid or duplicate ZIP path');
    seen.add(filename);
    const name = Buffer.from(filename), bytes = Buffer.from(content), crc = crc32(bytes);
    if (bytes.length > 0xffffffff || offset > 0xffffffff) throw new Error('ZIP64 is not supported');
    const head = Buffer.alloc(30), index = Buffer.alloc(46), date = ((2026 - 1980) << 9) | (11 << 5) | 6;
    head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4); head.writeUInt16LE(0x0800, 6);
    head.writeUInt16LE(date, 12); head.writeUInt32LE(crc, 14); head.writeUInt32LE(bytes.length, 18); head.writeUInt32LE(bytes.length, 22); head.writeUInt16LE(name.length, 26);
    index.writeUInt32LE(0x02014b50, 0); index.writeUInt16LE(0x0314, 4); index.writeUInt16LE(20, 6); index.writeUInt16LE(0x0800, 8);
    index.writeUInt16LE(date, 14); index.writeUInt32LE(crc, 16); index.writeUInt32LE(bytes.length, 20); index.writeUInt32LE(bytes.length, 24); index.writeUInt16LE(name.length, 28);
    index.writeUInt32LE((0o100644 << 16) >>> 0, 38); index.writeUInt32LE(offset, 42);
    local.push(head, name, bytes); central.push(index, name); offset += head.length + name.length + bytes.length;
  }
  if (entries.length > 65535) throw new Error('Too many ZIP entries');
  const directory = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}
