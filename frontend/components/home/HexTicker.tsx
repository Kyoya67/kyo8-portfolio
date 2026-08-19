const ADDRESSES = Array.from({ length: 8 }, (_, i) => `0x${(i * 16).toString(16).toUpperCase().padStart(2, "0")}`);

export default function HexTicker() {
  return (
    <div className="hidden flex-col items-end gap-2 font-mono text-[10px] text-fg-dim md:flex">
      {ADDRESSES.map((addr) => (
        <span key={addr}>{addr}</span>
      ))}
    </div>
  );
}
