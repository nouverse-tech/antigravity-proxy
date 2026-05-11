# Antigravity Proxy Bypass Improvements

Rencana peningkatan mekanisme bypass dan manajemen akun pada Antigravity Proxy untuk meminimalisir pemblokiran (403/CAPTCHA) dan memastikan ketersediaan model (uptime) lebih stabil.

## Phase 1: Proactive Management
Fokus pada penanganan token sebelum expired dan pemulihan skor kesehatan (health score) secara otomatis.

- `[ ]` **Proactive Token Refresh**: Buat worker background (`setInterval`) setiap 5-10 menit. Jika ada token yang akan expired dalam waktu dekat, segera refresh tokennya. Ini akan menghilangkan latency tambahan pada saat request dari user masuk.
- `[ ]` **Dynamic Health Score Recovery**: Saat ini recovery skor sangat lambat (+2 per request sukses). Tambahkan cron yang otomatis memulihkan skor kesehatan (misal +5 poin per jam) untuk akun yang sedang idle/cooldown, sehingga akun yang sempat kena limit bisa pulih lebih cepat tanpa harus diuji coba request dulu.

## Phase 2: Anti-Bot & Session Warmup
Fokus meniru *behavior* (perilaku) IDE asli untuk mengecoh deteksi bot/spam Google.

- `[ ]` **IDE Session Keep-Alive**: Proxy akan meniru traffic background IDE asli dengan melakukan *ping* (misalnya ke endpoint Cloud Assist) setiap beberapa jam. Ini akan membuat *session token* terus hangat (warm) dan Google melihatnya sebagai aktivitas IDE manusia yang normal, bukan proxy.
- `[ ]` **Dynamic Fingerprinting**: Meng-update rotasi *Device Fingerprint* secara berkala agar meniru rotasi *session* natural pada IDE seperti VSCode atau JetBrains.

## Phase 3: Intelligent Recovery & Handling
Fokus pada penanganan error spesifik dari Google (seperti CAPTCHA) agar tidak membuat akun hangus/terkunci selamanya.

- `[ ]` **Auto-Clear Challenge Flags**: Saat ini kalau akun kena `403 Challenge Required`, akun tersebut di-lock secara permanen sampai di-reset manual di UI. Tambahkan mekanisme auto-clear (misal: flag dihapus setelah 12 atau 24 jam) karena seringkali blokir CAPTCHA Google bersifat *soft-ban* dan bisa pulih sendiri keesokan harinya.
- `[ ]` **Smart Exponential Backoff**: Meningkatkan keandalan saat terkena `429 Too Many Requests` agar proxy tahu persis kapan boleh mulai memakai akun itu lagi tanpa memicu blokir permanen.
