import  { useEffect, useState } from "react";

export default function Timer({ onTick }: { onTick?: (seconds: number) => void }) {
  const [sec, setSec] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setSec((s) => {
        const next = s + 1;
        onTick?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [onTick]);

  function fmt(s: number) {
    const mm = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  }

  return <div className="text-sm font-mono">{fmt(sec)}</div>;
}
