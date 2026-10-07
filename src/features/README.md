# features/

Satu folder per fitur: `auth/`, `practice/`, `mastery/`, `mistakes/`, `tryout/`, `progress/`, `cms/`.
Boleh: komposisi UI + state/hook per fitur; panggil server hanya lewat route handler.
Tidak boleh: akses DB/ORM langsung (pakai repository/service di `src/server/`).
Tidak boleh: menyimpan secret atau kunci jawaban di kode client.
Tidak boleh: menduplikat renderer — pakai renderer bersama dari `components/question/`.
