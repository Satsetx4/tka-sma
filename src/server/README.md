# server/

Kode khusus server: `db/`, `repositories/`, `services/`, `storage/`. Secret (Neon, Blob, session) hanya boleh di sini.
Boleh: repository (`QuestionRepository`, `AttemptRepository`, ...), `StorageService`, validasi jawaban/sesi/role di server.
Hanya boleh diimpor dari route handler / server action / server component — JANGAN dari komponen client.
Tidak boleh: membocorkan secret atau jawaban benar sesi aktif ke payload client.
CMS memakai `StorageService` (`upload/delete/getUrl/validate`); jangan sebar pemakaian Blob SDK langsung.
