"use client";

// Angka count-up saat masuk layar — hormat reduced-motion.
// Nilai akhir diderivasi saat render (bukan setState sinkron di efek) agar tidak
// memicu cascading render (temuan QA P0.1).
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

interface CountUpProps {
  to: number;
  duration?: number;
  className?: string;
}

function subscribeReducedMotion(notify: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  duration = 900,
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  // Dibaca sebagai external store: render pertama (termasuk hydration) selalu
  // pakai snapshot server (false) sehingga konsisten dengan HTML prerender.
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [visible, setVisible] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Tandai terlihat saat masuk viewport. setState hanya di callback observer (asinkron).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Jalankan animasi via rAF. setState hanya di callback tick (asinkron).
  useEffect(() => {
    if (!visible || reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      setElapsed(t - t0);
      if (t - t0 < duration) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduced, duration, to]);

  // Derivasi saat render: belum terlihat → 0; reduced-motion → langsung nilai akhir.
  const span = duration <= 0 ? 1 : Math.min(elapsed / duration, 1);
  const eased = 1 - Math.pow(1 - span, 3);
  const val = !visible ? 0 : reduced ? to : Math.round(eased * to);

  return (
    <span ref={ref} className={className}>
      {val}
    </span>
  );
};
