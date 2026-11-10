/**
 * NEW FILE: src/playbook/content.id.ts
 * -----------------------------------------------------------------------
 * Indonesian translation of the playbook content. Keys (block.key,
 * topic.key) are IDENTICAL to content.en.ts — only the text is translated.
 * -----------------------------------------------------------------------
 */
import type {
    PlaybookBlock,
    PlaybookQuickAccessItem,
  } from "@/types/playbook";
  
  export const playbookBlocks: PlaybookBlock[] = [
    {
      key: "why-tiktok-bans-happen",
      position: 1,
      title: "Mengapa Ban TikTok Terjadi",
      description:
        "Pahami pembatasan yang kamu terima sebelum memutuskan langkah selanjutnya.",
      topics: [
        {
          key: "types-of-restrictions",
          title: "Jenis-jenis pembatasan",
          quickAnswer:
            "Kursus ini membedakan beberapa situasi: peringatan, Live yang dihentikan, akses Live yang dibatasi, suspensi atau ban akun, dan penurunan visibilitas secara tiba-tiba.",
          steps: [
            "Periksa apakah TikTok menampilkan peringatan atau notifikasi pelanggaran.",
            "Periksa apakah Live dihentikan.",
            "Periksa apakah akses Live masih tersedia.",
            "Periksa apakah pembatasan memengaruhi seluruh akun.",
            "Simpan notifikasi supaya kamu bisa mengidentifikasi alasan dan durasinya.",
          ],
          scenarios: [
            "Kamu menerima peringatan tetapi Live tetap tersedia.",
            "Live yang sedang berjalan dihentikan.",
            "Akses Live menjadi tidak tersedia untuk sementara waktu.",
            "Akun disuspensi atau diban.",
            "Reach turun secara tiba-tiba tanpa notifikasi yang jelas.",
          ],
          importantDetails: [
            "Jangan menganggap setiap masalah sebagai jenis pembatasan yang sama.",
            "Tujuan pertama adalah mengidentifikasi apa yang sebenarnya diubah TikTok pada akun.",
          ],
        },
        {
          key: "warning-vs-live-restriction-vs-account-ban",
          title: "Peringatan vs. pembatasan Live vs. ban akun",
          quickAnswer:
            "Kursus ini memperlakukan peringatan, kehilangan akses Live, dan suspensi atau ban di level akun sebagai hasil yang berbeda. Periksa notifikasi dan fitur yang masih tersedia sebelum mengambil tindakan.",
          steps: [
            "Buka notifikasi pelanggaran atau pembatasan.",
            "Periksa apakah Live yang sedang berjalan telah berakhir.",
            "Periksa apakah kamu masih bisa memulai Live lain.",
            "Periksa apakah sisa akun masih bisa digunakan.",
            "Catat alasan yang disebutkan dan durasi pembatasan.",
          ],
          importantDetails: [
            "Kursus ini tidak memberikan satu tindakan pemulihan universal untuk setiap jenis pembatasan.",
            "Gunakan notifikasi asli dan status akun saat ini sebagai titik awal.",
          ],
        },
        {
          key: "visibility-restrictions",
          title: "Pembatasan visibilitas",
          quickAnswer:
            "Penurunan visibilitas atau reach yang tiba-tiba dianggap sebagai sinyal terpisah yang perlu diselidiki, terutama ketika tidak ada notifikasi ban akun yang jelas.",
          steps: [
            "Periksa apakah ada peringatan atau notifikasi pelanggaran baru.",
            "Periksa apakah akses Live masih tersedia.",
            "Catat apa yang berubah dan kapan itu terjadi.",
            "Tinjau setup yang digunakan selama Live yang terdampak sebelum siaran berikutnya.",
          ],
          importantDetails: [
            "Materi yang diberikan tidak mendefinisikan tes diagnostik yang terjamin untuk reach yang menurun.",
            "Dokumentasikan insiden tersebut daripada menebak-nebak penyebabnya.",
          ],
        },
        {
          key: "identify-the-reason",
          title: "Cara mengidentifikasi alasannya",
          quickAnswer:
            "Mulai dari notifikasi TikTok itu sendiri: tangkap gambarnya, identifikasi alasan yang disebutkan, periksa durasi pembatasan, dan catat apa yang terjadi selama Live.",
          steps: [
            "Buka notifikasi TikTok.",
            "Ambil screenshot.",
            "Identifikasi alasan pelanggaran yang ditampilkan di notifikasi.",
            "Periksa durasi pembatasan atau tanggal berakhirnya, jika ditampilkan.",
            "Catat apa yang terjadi selama Live agar insiden bisa ditinjau nanti.",
          ],
          scenarios: [
            "Notifikasi memberikan alasan dan durasi yang jelas.",
            "Live berhenti, tetapi kamu masih perlu memverifikasi apakah akses Live masih tersedia.",
            "Reach turun tanpa notifikasi yang jelas, sehingga insiden perlu didokumentasikan untuk ditinjau.",
          ],
        },
      ],
    },
    {
      key: "avoid-tiktok-bans-during-lives",
      position: 2,
      title: "Cara Menghindari Ban TikTok Selama Live",
      description:
        "Siapkan tampilan layar, kata-kata, dan struktur Live sebelum kamu mulai streaming.",
      topics: [
        {
          key: "what-you-show-on-screen",
          title: "Apa yang kamu tampilkan di layar",
          quickAnswer:
            "Jaga agar Live tetap fokus pada chart dan area trading. Kursus rekaman menyarankan untuk menghindari branding broker yang tidak perlu, elemen interface platform yang tidak perlu, dan teks di layar yang berantakan.",
          steps: [
            "Siapkan chart trading dan terminal sebelum Live.",
            "Tinjau saldo, jumlah transaksi, hasil trading, branding broker, Notes, dan link mana saja yang terlihat.",
            "Hilangkan elemen interface platform yang tidak perlu dari area yang terlihat.",
            "Jaga tampilan layar tetap aktif secara visual saat menjelaskan chart, bukan membiarkannya statis dalam waktu lama.",
          ],
          scenarios: [
            "Tampilan bersih yang fokus pada chart, di mana penjelasan tetap menjadi konten visual utama.",
            "Tampilan terminal yang berantakan dan menampilkan elemen interface yang tidak perlu, yang sebaiknya dibersihkan sebelum Live.",
          ],
          importantDetails: [
            "Materi pembicara secara khusus merekomendasikan untuk fokus utama pada chart / area trading.",
            "Tinjau saldo akun, jumlah transaksi, hasil trading, nama/logo broker, Notes, dan link sebagai bagian dari persiapan tampilan layar.",
          ],
        },
        {
          key: "what-you-say-during-a-live",
          title: "Apa yang kamu ucapkan selama Live",
          quickAnswer:
            "Bingkai Live sebagai konten edukasi: jelaskan apa yang kamu lihat dan mengapa. Kursus ini juga menyebutkan bahwa penyebutan broker/platform, klaim uang dan profit, Telegram, dan pertanyaan registrasi adalah hal yang perlu dipersiapkan sebelumnya.",
          steps: [
            "Siapkan cara kamu akan menjelaskan setup trading dan hasilnya.",
            "Hindari kata-kata yang menjamin profit.",
            "Siapkan jawaban untuk pertanyaan tentang broker dan registrasi daripada berimprovisasi di bawah tekanan.",
            "Gunakan setup Notes yang sudah disetujui untuk informasi platform eksternal, daripada terus-menerus meminta viewer meninggalkan TikTok untuk ke Telegram.",
          ],
          scenarios: [
            "Daripada perintah langsung seperti 'beli sekarang', jelaskan logika chart di balik transaksi tersebut.",
            "Ketika viewer bertanya cara memulai, jelaskan langkah selanjutnya hanya setelah ada konteks dan ketertarikan yang genuine.",
          ],
          importantDetails: [
            "Kursus ini membedakan penjelasan edukatif dari perintah gaya sinyal tanpa konteks.",
            "Cara membahas uang, profit, Telegram, dan registrasi adalah bagian dari rencana komunikasi sebelum Live.",
          ],
        },
        {
          key: "how-you-run-the-live",
          title: "Cara kamu menjalankan Live",
          quickAnswer:
            "Jalankan Live yang aktif dan edukatif: jelaskan chart, berinteraksi dengan viewer, tunjukkan alur trading yang sebenarnya, dan jaga presentasi tetap bergerak daripada membiarkan tampilan statis yang berulang.",
          steps: [
            "Mulai dengan perkenalan singkat dan interaksi dengan viewer.",
            "Lanjutkan ke penjelasan chart yang edukatif.",
            "Jelaskan logikanya sebelum melakukan transaksi live, jangan masuk transaksi dalam diam.",
            "Bereaksi dengan tenang baik pada transaksi yang untung maupun rugi.",
            "Terus ajukan pertanyaan pada viewer agar Live tetap interaktif.",
          ],
          scenarios: [
            "Jelaskan level support atau pattern dan tanyakan pada viewer apakah mereka bisa melihatnya.",
            "Jika sebuah transaksi rugi, jelaskan bahwa kerugian adalah bagian dari trading dan lanjutkan proses dengan tenang.",
          ],
          importantDetails: [
            "Pelajaran rekaman menggunakan struktur Live empat bagian: opening, konten edukasi, live trading, closing.",
            "Materi ini menekankan konsistensi streaming dan interaksi genuine dengan viewer.",
          ],
        },
        {
          key: "pre-live-safety-checklist",
          title: "Checklist Keamanan Sebelum Live",
          quickAnswer:
            "Selesaikan satu pemeriksaan terakhir untuk akun TikTok, tampilan trading yang terlihat, Notes, setup teknis, dan terminal sebelum menekan Go Live.",
          steps: [
            "Periksa status akun TikTok dan akses Live.",
            "Siapkan tampilan trading dan terminal.",
            "Tinjau saldo yang terlihat, hasil trading, branding broker, Notes, link, dan teks lain di layar.",
            "Periksa audio, internet, baterai, dan peralatan.",
            "Pastikan terminal sudah dikonfigurasi sebelum Live dimulai.",
            "Lakukan pemeriksaan kesiapan akhir dan baru mulai Live.",
          ],
          importantDetails: [
            "Satu pelajaran rekaman merekomendasikan baterai minimal 80% atau menyambungkan charger sebelum siaran.",
            "Kursus ini menggunakan setup dua perangkat: terminal trading di satu perangkat dan TikTok Live di perangkat lain.",
            "Internet harus diperiksa sebelum siaran, bukan setelah siaran dimulai.",
          ],
          checklist: {
            title: "Checklist Keamanan Sebelum Live",
            description:
              "Checklist praktis final ini menggabungkan persiapan tampilan layar dan pemeriksaan teknis akhir dalam satu alat.",
            items: [
              "Status akun TikTok sudah diperiksa",
              "Akses Live sudah diperiksa",
              "Tampilan trading dan terminal sudah disiapkan",
              "Saldo dan hasil trading sudah ditinjau",
              "Branding broker dan teks di layar sudah ditinjau",
              "Notes dan link sudah ditinjau",
              "Audio berfungsi",
              "Koneksi internet sudah diperiksa",
              "Baterai dan peralatan siap",
              "Terminal trading sudah dikonfigurasi",
              "Pemeriksaan kesiapan akhir sudah selesai",
            ],
          },
        },
      ],
    },
    {
      key: "what-to-do-if-banned",
      position: 3,
      title: "Yang Harus Dilakukan Jika Akun TikTok Kamu Dibanned Saat Live",
      description:
        "Dokumentasikan insiden, ikuti jalur pemulihan yang tersedia, dan kembali hanya setelah akses dipulihkan.",
      topics: [
        {
          key: "identify-what-happened",
          title: "Identifikasi apa yang terjadi",
          quickAnswer:
            "Pertama, identifikasi hasil yang pasti: peringatan, Live dihentikan, akses Live dibatasi, suspensi/ban akun, atau penurunan visibilitas tiba-tiba.",
          steps: [
            "Baca notifikasi pembatasan.",
            "Periksa apakah Live dihentikan.",
            "Periksa apakah akses Live masih tersedia.",
            "Periksa apakah seluruh akun terdampak.",
            "Simpan notifikasi dan detail pembatasan.",
          ],
        },
        {
          key: "immediate-actions",
          title: "Tindakan segera",
          quickAnswer:
            "Jangan menebak-nebak. Buka notifikasi, simpan bukti, catat alasan dan durasinya, dan dokumentasikan apa yang terjadi selama Live.",
          steps: [
            "Buka notifikasi TikTok.",
            "Ambil screenshot.",
            "Identifikasi alasan pelanggaran.",
            "Periksa durasi pembatasan.",
            "Catat apa yang terjadi selama Live.",
            "Perbaiki setup sebelum Live berikutnya berdasarkan temuanmu.",
          ],
          importantDetails: [
            "Materi pembicara merekomendasikan untuk meminta bantuan Academy Experts jika diperlukan.",
          ],
        },
        {
          key: "submit-an-appeal",
          title: "Cara mengajukan banding",
          quickAnswer:
            "Jika opsi banding tersedia, mulai dari notifikasi pelanggaran, buka opsi banding, kirimkan informasi yang diminta, dan pantau status bandingnya.",
          steps: [
            "Temukan notifikasi pelanggaran.",
            "Periksa apakah opsi banding tersedia.",
            "Buka proses banding.",
            "Berikan informasi yang diminta dalam banding.",
            "Pantau status banding.",
          ],
          sourceNote:
            "Materi kursus yang diberikan tidak berisi panduan banding TikTok secara detail langkah demi langkah, sehingga halaman ini tidak membuat panduan tersebut secara sepihak.",
        },
        {
          key: "while-account-is-restricted",
          title: "Selama akunmu dibatasi",
          quickAnswer:
            "Periksa fitur akun mana yang masih tersedia, atasi masalah yang disebutkan di notifikasi, jaga koneksi dengan audiens melalui komunitas yang sudah ada, dan tunggu sampai akun diizinkan melanjutkan streaming.",
          steps: [
            "Periksa fitur akun mana yang masih tersedia.",
            "Atasi masalah yang diidentifikasi dalam notifikasi pembatasan.",
            "Jaga komunikasi dengan audiensmu melalui komunitas yang sudah ada.",
            "Pantau periode pembatasan dan status akun.",
            "Siapkan Live berikutnya hanya setelah meninjau masalah yang menyebabkan pembatasan.",
          ],
          importantDetails: [
            "Materi kursus membedakan pengelolaan akun dari sengaja melewati pembatasan aktif dengan akun lain.",
            "Periode istirahat saja tidak dijadikan sebagai cara yang terjamin untuk menghapus pembatasan.",
          ],
        },
        {
          key: "return-to-streaming",
          title: "Cara kembali streaming",
          quickAnswer:
            "Kembali hanya setelah akses Live dipulihkan. Periksa ulang akun, selesaikan lagi checklist keamanan, siapkan siaran berikutnya, lalu lanjutkan.",
          steps: [
            "Periksa apakah akses Live sudah dipulihkan.",
            "Periksa status akun saat ini.",
            "Selesaikan lagi Checklist Keamanan Sebelum Live.",
            "Siapkan Live berikutnya dengan setup yang sudah diperbaiki.",
            "Lanjutkan streaming ketika sudah diizinkan.",
            "Laporkan insiden ke Academy Experts jika proses kursus mengharuskannya.",
          ],
        },
      ],
    },
    {
      key: "account-rotation-strategy",
      position: 4,
      title: "Strategi Rotasi Akun TikTok",
      description:
        "Siapkan akun utama dan cadangan agar masalah pada satu akun tidak menghentikan seluruh proses streaming.",
      topics: [
        {
          key: "why-you-need-account-strategy",
          title: "Mengapa kamu butuh strategi akun",
          quickAnswer:
            "Mengandalkan satu akun TikTok menciptakan satu titik kegagalan. Kursus ini merekomendasikan menyiapkan akun cadangan dan menjaga koneksi audiens melalui Telegram agar streaming bisa pulih dari masalah akun.",
          importantDetails: [
            "Akun cadangan disajikan sebagai alat kontinuitas, bukan sebagai jaminan terhadap pembatasan.",
            "Telegram adalah bagian dari strategi kontinuitas karena koneksi audiens bisa tetap ada di luar akun TikTok yang terdampak.",
          ],
        },
        {
          key: "how-many-accounts",
          title: "Berapa banyak akun yang kamu butuhkan",
          quickAnswer:
            "Struktur kursus final menggunakan satu Akun Utama, Akun Cadangan 1, Akun Cadangan 2, dan akun tambahan bila diperlukan.",
          importantDetails: [
            "Pembicara rekaman menjelaskan setup yang berbeda-beda, mulai dari satu hingga tiga akun cadangan.",
            "Sumber secara eksplisit menyatakan untuk tidak menggabungkan diam-diam rekomendasi pembicara yang berbeda-beda ini menjadi satu metode buatan.",
          ],
          sourceNote:
            "Tidak ada satu angka independen-pembicara yang final dalam materi yang diberikan, selain struktur kursus berupa satu akun utama ditambah dua cadangan bernama dan akun tambahan opsional.",
        },
        {
          key: "account-roles-and-setup",
          title: "Peran akun dan pengaturannya",
          quickAnswer:
            "Tentukan akun mana yang menjadi Akun Utama dan mana yang cadangan, lalu jaga identitas streamer, penamaan profil, link, akses, dan keamanan yang konsisten di seluruh setup.",
          steps: [
            "Identifikasi Akun Utama.",
            "Identifikasi Akun Cadangan 1 dan Akun Cadangan 2.",
            "Jaga identitas streamer konsisten di semua akun.",
            "Tinjau nama profil, branding, dan link.",
            "Catat akses akun dan detail keamanan.",
          ],
        },
        {
          key: "rotation-and-resting",
          title: "Rotasi dan istirahat",
          quickAnswer:
            "Gunakan rotasi dan istirahat yang terencana sebagai alat pengelolaan akun: lacak peringatan dan pembatasan, ketahui akun mana yang aktif, dan kembalikan akun yang terdampak hanya ketika statusnya memungkinkan.",
          steps: [
            "Lacak akun mana yang sedang aktif.",
            "Catat peringatan dan pembatasan untuk setiap akun.",
            "Catat periode istirahat jika itu bagian dari metode pembicara.",
            "Periksa akses Live sebelum mengembalikan akun untuk streaming.",
          ],
          importantDetails: [
            "Modul rekaman berisi metode rotasi/istirahat yang berbeda dari pembicara yang berbeda.",
            "Playbook ini mempertahankan perbedaan tersebut daripada berpura-pura ada satu metode universal.",
            "Mengistirahatkan akun tidak dijadikan sebagai cara yang otomatis menghapus pembatasan aktif.",
          ],
        },
        {
          key: "account-tracking",
          title: "Pelacakan akun",
          quickAnswer:
            "Simpan pelacak akun yang sederhana agar kamu selalu tahu peran, status, akses Live, riwayat peringatan, tanggal Live terakhir, dan tindakan selanjutnya untuk setiap akun.",
          steps: [
            "Catat nama akun dan perannya.",
            "Catat apakah akun aktif, dibatasi, atau tidak aktif.",
            "Catat apakah akses Live tersedia.",
            "Catat peringatan dan pembatasan sebelumnya.",
            "Catat tanggal Live terakhir.",
            "Catat aktivitas yang direncanakan selanjutnya atau tindakan yang diizinkan.",
          ],
        },
        {
          key: "practical-examples",
          title: "Contoh praktis",
          quickAnswer:
            "Gunakan strategi akun untuk menangani empat situasi yang sering berulang: hari streaming normal, peringatan, kehilangan akses Live sementara, dan kembali ke operasi normal.",
          scenarios: [
            "Hari biasa: identifikasi akun aktif, konfirmasi akses Live, dan catat aktivitas terakhir/selanjutnya.",
            "Peringatan: dokumentasikan notifikasinya dan perbarui status akun tersebut sebelum merencanakan Live berikutnya.",
            "Kehilangan akses Live sementara: jaga status akun yang terdampak tetap terlihat di pelacak dan ikuti proses pembatasan/pemulihan.",
            "Kembali ke operasi normal: konfirmasi akses sudah dipulihkan dan selesaikan lagi pemeriksaan sebelum Live.",
          ],
        },
      ],
    },
    {
      key: "where-to-buy-tiktok-accounts",
      position: 5,
      title: "Di Mana Membeli Akun TikTok",
      description:
        "Bandingkan membuat dan menghangatkan akunmu sendiri dengan membeli akun yang sudah ada, lalu periksa akun tersebut sebelum membeli.",
      topics: [
        {
          key: "create-and-warm-up-vs-buy",
          title: "Membuat & menghangatkan vs. membeli",
          quickAnswer:
            "Kursus ini menyajikan dua jalur: membuat dan menghangatkan akun TikTok kamu sendiri, atau membeli akun yang sudah ada. Membuat butuh lebih banyak waktu; membeli mungkin lebih cepat tetapi memerlukan pemeriksaan riwayat dan akses akun secara cermat.",
          scenarios: [
            "Buat & Hangatkan: waktu persiapan lebih lama, tetapi kamu mengontrol riwayat akun dan identitas streamer dari awal.",
            "Beli yang Sudah Ada: potensi akses lebih cepat ke akun yang sudah mapan, tetapi riwayat, pelanggaran sebelumnya, penjual, dan akses pemulihan perlu diperiksa.",
          ],
        },
        {
          key: "buying-pros-and-cons",
          title: "Kelebihan dan kekurangan",
          quickAnswer:
            "Membuat memberikan kontrol lebih besar atas riwayat akun tetapi butuh waktu. Membeli bisa memberikan akses lebih cepat ke akun yang sudah mapan, tetapi disertai risiko riwayat, penjual, kepemilikan, dan pemulihan yang harus diperiksa.",
          importantDetails: [
            "Buat & hangatkan: waktu persiapan, kontrol atas riwayat, identitas streamer, akses Live, biaya dan batasan.",
            "Beli yang sudah ada: kecepatan, akses Live yang sudah ada, usia/riwayat akun, pelanggaran sebelumnya, risiko penjual dan pemulihan.",
          ],
        },
        {
          key: "where-to-find-accounts",
          title: "Di mana menemukan akun",
          quickAnswer:
            "Kursus ini merujuk pada marketplace akun TikTok, penjual yang disebutkan oleh pembicara, dan rekomendasi dari streamer lain. Materi yang diberikan tidak berisi nama marketplace final untuk dipublikasikan di sini.",
          steps: [
            "Mulai dari marketplace atau sumber penjual yang digunakan dalam materi kursus.",
            "Periksa kredibilitas penjual sebelum mengevaluasi akun itu sendiri.",
            "Jangan melewatkan checklist verifikasi akun hanya karena sumbernya direkomendasikan.",
          ],
          sourceNote:
            "Skrip rekaman berisi placeholder untuk nama marketplace, sehingga Playbook ini secara sengaja tidak membuat nama sendiri.",
        },
        {
          key: "what-to-check-before-buying",
          title: "Apa yang harus diperiksa sebelum membeli",
          quickAnswer:
            "Sebelum membeli, verifikasi usia, wilayah, jumlah followers, akses Live, riwayat akun, riwayat konten, kepemilikan/akses pemulihan, dan harga.",
          steps: [
            "Periksa kapan akun tersebut dibuat.",
            "Periksa apakah wilayahnya sesuai dengan target audiens.",
            "Periksa jumlah followers dan apakah akses Live benar-benar aktif.",
            "Tinjau peringatan, ban, pembatasan, dan riwayat konten sebelumnya.",
            "Konfirmasi kepemilikan dan akses pemulihan.",
            "Bandingkan harga dengan apa yang benar-benar disertakan.",
          ],
          importantDetails: [
            "Satu pembicara rekaman merekomendasikan usia akun minimal 6 bulan.",
            "Pembicara yang sama merekomendasikan minimal 1.000 followers dan Live aktif.",
            "Pembicara menjelaskan akun siap pakai berkisar $3–$10.",
            "Angka-angka ini adalah rekomendasi pembicara dari materi kursus rekaman, bukan jaminan platform universal.",
          ],
        },
        {
          key: "purchase-walkthrough",
          title: "Panduan proses pembelian",
          quickAnswer:
            "Tinjau listingnya, verifikasi parameter utama akun, identifikasi tanda bahaya, dan tentukan apakah akun tersebut sebaiknya diterima atau ditolak.",
          steps: [
            "Buka listing akun.",
            "Periksa usia, wilayah, followers, dan akses Live.",
            "Tinjau riwayat, pembatasan, dan konten sebelumnya.",
            "Periksa kepemilikan dan akses pemulihan.",
            "Identifikasi apa pun yang tidak sesuai dengan listing atau target audiensmu.",
            "Putuskan apakah akan melanjutkan atau menolak tawaran tersebut.",
          ],
        },
        {
          key: "buying-checklist",
          title: "Checklist pembelian",
          quickAnswer:
            "Gunakan checklist ini sebelum setiap pembelian agar keputusanmu didasarkan pada parameter akun yang sebenarnya, bukan hanya deskripsi dari penjual.",
          importantDetails: [
            "Paket kursus final menyertakan ini sebagai salah satu dari tiga checklist praktis yang berdiri sendiri.",
          ],
          checklist: {
            title: "Checklist Pembelian Akun TikTok",
            description:
              "Checklist verifikasi akun praktis untuk diselesaikan sebelum membeli.",
            items: [
              "Usia akun sudah diperiksa",
              "Wilayah sudah diperiksa sesuai target audiens",
              "Jumlah followers sudah diperiksa",
              "Akses Live sudah dikonfirmasi",
              "Ban, peringatan, dan pembatasan sebelumnya sudah ditinjau",
              "Aktivitas akun dan riwayat konten sudah ditinjau",
              "Kredibilitas penjual sudah diperiksa",
              "Kepemilikan dan akses pemulihan sudah dikonfirmasi",
              "Harga sudah ditinjau",
            ],
            note:
              "Contoh dari pembicara: usia minimal 6 bulan, minimal 1.000 followers, Live aktif, dan sekitar $3–$10 untuk akun siap pakai.",
          },
        },
      ],
    },
    {
      key: "tiktok-warm-up-strategy",
      position: 6,
      title: "Strategi Warm-Up Akun TikTok",
      description:
        "Siapkan akun baru atau yang baru didapat sebelum Live pertamanya menggunakan urutan warm-up yang dijelaskan dalam pelajaran rekaman.",
      topics: [
        {
          key: "what-is-warm-up",
          title: "Apa itu warm-up",
          quickAnswer:
            "Warm-up adalah periode persiapan sebelum Live pertama. Pelajaran rekaman menjelaskan penggunaan akun secara normal di sekitar konten trading yang relevan, bukan langsung memulai streaming.",
          importantDetails: [
            "Pembicara rekaman menjelaskan periode warm-up sekitar 1–2 hari.",
            "Waktu tersebut disajikan sebagai metode pembicara, bukan sebagai persyaratan TikTok yang terjamin.",
          ],
        },
        {
          key: "account-preparation",
          title: "Persiapan akun",
          quickAnswer:
            "Sebelum warm-up dan Live pertama, lengkapi profil, bangun identitas streamer, amankan akun, dan konfirmasi akses Live.",
          steps: [
            "Lengkapi profil.",
            "Tetapkan identitas streamer yang konsisten.",
            "Siapkan keamanan dan akses akun.",
            "Periksa apakah akses Live tersedia.",
          ],
        },
        {
          key: "warm-up-activities",
          title: "Aktivitas warm-up",
          quickAnswer:
            "Pelajaran rekaman dimulai dengan perilaku menonton normal di sekitar konten trading, lalu menambahkan engagement genuine seperti like, komentar, dan follow sebelum beralih ke aktivitas konten reguler.",
          steps: [
            "Buka TikTok dan cari konten yang berhubungan dengan trading.",
            "Tonton video trading yang relevan; contoh rekaman menyebutkan sekitar 20–30 menit selama periode awal.",
            "Pada tahap selanjutnya, like konten, tulis komentar, dan follow akun trading.",
            "Jangan langsung posting selama tahap awal warm-up yang dijelaskan oleh pembicara.",
            "Selanjutnya, kembangkan aktivitas akun normal dan konten asli seiring persiapan akun berlanjut.",
          ],
          importantDetails: [
            "Pembicara menjelaskan 1–2 jam pertama sebagai aktivitas menonton/mencari.",
            "2–3 jam selanjutnya menambahkan like, komentar, dan follow.",
            "Di malam hari, pembicara merekomendasikan menjelajahi feed secara normal.",
          ],
        },
        {
          key: "warm-up-timeline",
          title: "Timeline warm-up",
          quickAnswer:
            "Metode rekaman ini berlangsung sekitar 1–2 hari. Detail waktunya paling kuat untuk jam-jam awal; sumbernya tidak memberikan jadwal menit-per-menit terpisah untuk Hari 2.",
          steps: [
            "1–2 jam pertama: buka aplikasi, cari konten trading, dan tonton konten yang berhubungan dengan trading.",
            "Dalam periode menonton itu, pembicara memberikan contoh menonton video selama 20–30 menit.",
            "2–3 jam selanjutnya: like konten, tulis komentar, follow akun trading, dan jangan posting dulu.",
            "Di malam hari: jelajahi feed secara normal.",
            "Lanjutkan periode warm-up sampai akun siap untuk Live pertama; pelajaran rekaman menjelaskan periode total sekitar 1–2 hari.",
          ],
          sourceNote:
            "Sumbernya tidak memberikan jadwal pasti dan terpisah untuk Hari 2, sehingga Playbook ini tidak membuat jadwal tersebut secara sepihak.",
        },
        {
          key: "first-live-readiness",
          title: "Kesiapan Live pertama",
          quickAnswer:
            "Sebelum Live pertama, konfirmasi akses Live, periksa status akun, tinjau profil dan konten, siapkan siaran, dan selesaikan pemeriksaan keamanan terakhir.",
          steps: [
            "Konfirmasi akses Live.",
            "Periksa status akun.",
            "Tinjau profil dan konten.",
            "Siapkan siaran pertama dan setup terminal.",
            "Selesaikan Checklist Keamanan Sebelum Live.",
          ],
          importantDetails: [
            "Pelajaran warm-up rekaman menggunakan feed yang secara alami selaras dengan konten trading sebagai salah satu sinyal kesiapan praktis.",
          ],
        },
        {
          key: "warm-up-plan",
          title: "Rencana warm-up",
          quickAnswer:
            "Gunakan urutan warm-up 1–2 hari dari pembicara sebagai rencana eksekusi, lalu selesaikan dengan pemeriksaan kesiapan Live pertama.",
          sourceNote:
            "Sumbernya memberikan tindakan pasti untuk jam-jam awal tetapi tidak berisi jadwal detail terpisah untuk Hari 2.",
          checklist: {
            title: "Rencana Warm-Up Akun TikTok",
            description:
              "Alat praktis final ini mengubah metode warm-up rekaman menjadi rencana kronologis.",
            items: [
              "Profil selesai dan akses akun sudah diamankan",
              "Akses Live sudah diperiksa",
              "Pencarian konten trading awal sudah selesai",
              "Konten trading yang relevan sudah ditonton",
              "Like, komentar, dan follow ditambahkan selama tahap warm-up selanjutnya",
              "Tidak ada posting langsung selama tahap awal yang dijelaskan oleh pembicara",
              "Penjelajahan feed normal sudah selesai",
              "Status akun sudah diperiksa lagi sebelum Live pertama",
              "Checklist Keamanan Sebelum Live sudah selesai",
            ],
            note:
              "Timeline pembicara: total sekitar 1–2 hari; 1–2 jam pertama fokus pada menonton/mencari, diikuti 2–3 jam engagement, lalu penjelajahan malam yang normal.",
          },
        },
      ],
    },
  ];
  
  export const playbookQuickAccess: PlaybookQuickAccessItem[] = [
    {
      key: "pre-live",
      label: "Sebelum Live",
      blockKey: "avoid-tiktok-bans-during-lives",
      topicKey: "pre-live-safety-checklist",
    },
    {
      key: "buying",
      label: "Pembelian",
      blockKey: "where-to-buy-tiktok-accounts",
      topicKey: "buying-checklist",
    },
    {
      key: "warm-up",
      label: "Warm-Up",
      blockKey: "tiktok-warm-up-strategy",
      topicKey: "warm-up-plan",
    },
  ];
  