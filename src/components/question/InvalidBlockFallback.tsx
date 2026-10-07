"use client";

interface Props {
  /** Pesan aman untuk siswa — tanpa detail internal. */
  reason?: string;
}

/**
 * Fallback blok rusak (P3.12): murni presentasi, tanpa parsing, tanpa throw.
 * Dipakai setiap kali klasifikasikanBlok mengembalikan kind "invalid".
 */
export function InvalidBlockFallback({ reason }: Props) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 dark:border-amber-800/60 dark:bg-amber-950/40"
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-amber-950"
      >
        !
      </span>
      <div className="min-w-0 text-sm">
        <p className="font-semibold text-amber-800 dark:text-amber-200">Konten tidak dapat ditampilkan.</p>
        {reason ? (
          <p className="mt-0.5 break-words text-amber-700 dark:text-amber-300">{reason}</p>
        ) : null}
      </div>
    </div>
  );
}
