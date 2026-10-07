/** P4.5 — Halaman soal baru (server shell + QuestionEditor client). */
import { QuestionEditor } from "../../../features/cms/QuestionEditor.tsx";

export const dynamic = "force-dynamic";

export default function AdminBaruPage() {
  return (
    <main className="space-y-4">
      <h1 className="font-display text-xl font-bold">Soal baru</h1>
      <QuestionEditor />
    </main>
  );
}
