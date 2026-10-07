# domain/

Logika bisnis murni + tipe bersama (`question/`, `mastery/`, `tryout/`); boleh diimpor client maupun server.
Boleh: tipe, skema validasi (zod), fungsi murni (skor, penguasaan, aturan tryout).
Tidak boleh: I/O — akses DB, fetch, Blob, `localStorage`, maupun secret dalam bentuk apa pun.
Tidak boleh: dependensi React/Next atau kode server; domain harus bebas efek samping.
