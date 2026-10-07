# components/

Komponen UI bersama: `ui/`, `question/`, `charts/`, `math/`.
Boleh: komponen presentasional + renderer soal bersama (dipakai practice, tryout, review hasil, preview CMS).
Tidak boleh: query ORM / akses DB langsung, menyimpan secret/token, atau validasi jawaban.
Tidak boleh: membuat renderer soal kedua — selalu pakai ulang yang di `question/`.
Jangan impor dari `src/server/` — komponen client tidak boleh menyentuh kode server.
