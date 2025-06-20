# 👥 Tim Pengembang Aplikasi

Selamat datang di repositori proyek kami!  
Berikut adalah daftar anggota tim yang berkontribusi dalam pengembangan proyek ini:

## 🧑‍💻 Anggota Tim

| Nama Lengkap                     | NIM        |
|----------------------------------|------------|
| I Putu Mahendra Putra            | 42230061   |
| Willybrodus Stephanus Da Costa   | 42230015   |
| Putu Surya Jaya Permana          | 42230040   |
| Ni Made Rai Ardia Anggreni       | 42230019   |


1. <Willybrodus Stephanus Da Costa>
Fitur login dan register dalam sistem ini dibangun menggunakan GraphQL dan dijalankan melalui resolver pada sisi backend. Saat pengguna mendaftar (register), fungsi createUser dijalankan. Fungsi ini menerima parameter seperti nama, nomor handphone, email, dan password. Demi keamanan, password pengguna akan terlebih dahulu di-hash menggunakan library bcrypt sebelum disimpan ke dalam database MySQL. Setelah proses penyimpanan berhasil, sistem akan mengembalikan data pengguna baru seperti ID, nama, dan email yang telah didaftarkan. Sedangkan untuk proses login, sistem menggunakan fungsi login yang mencari pengguna berdasarkan email pada tabel user. Jika pengguna ditemukan, maka password yang dimasukkan akan dicocokkan dengan password yang sudah di-hash di database menggunakan bcrypt.compare(). Apabila cocok, maka data pengguna akan dikembalikan, namun jika tidak cocok, maka sistem akan menampilkan pesan kesalahan seperti “Email tidak ditemukan” atau “Password salah”. Fitur ini belum menggunakan token autentikasi seperti JWT, sehingga pengelolaan sesi pengguna kemungkinan dilakukan secara lokal di sisi frontend, misalnya melalui SharedPreferences pada aplikasi Flutter. Proses ini menunjukkan integrasi sederhana namun aman antara GraphQL, database MySQL, dan praktik hashing password yang sesuai standar keamanan modern.

2.Putu Surya Jaya Permana
Fitur Dream Destination pada sistem ini memungkinkan pengguna untuk menyimpan dan mengelola daftar destinasi impian mereka. Implementasi fitur ini dilakukan melalui GraphQL resolver dengan memanfaatkan tabel dream_trip di database MySQL. Untuk menambahkan destinasi baru, digunakan fungsi createDreamDestination yang menerima parameter user_id, name, dan image. Data gambar disimpan dalam format binary di database, dan saat dikembalikan ke frontend, data tersebut dikonversi menjadi string base64 agar dapat ditampilkan sebagai gambar. Selain itu, pengguna juga bisa memperbarui data destinasi melalui updateDreamDestination, yang memungkinkan penggantian nama atau gambar destinasi impian. Jika ada parameter yang tidak diberikan, maka sistem akan menggunakan data lama yang ada di database. Penghapusan destinasi dapat dilakukan melalui fungsi deleteDreamDestination, yang menghapus data berdasarkan id destinasi. Untuk mengambil daftar destinasi milik pengguna, fungsi dreamDestinations dalam bagian Query digunakan. Fungsi ini mengambil semua destinasi berdasarkan user_id yang diberikan dan juga mengonversi data gambar menjadi base64 untuk kompatibilitas tampilan di frontend. Keseluruhan fitur ini dirancang agar pengguna dapat secara personal menyimpan referensi destinasi liburan mereka dalam bentuk daftar bergambar, yang sepenuhnya tersimpan dan dikelola secara aman melalui integrasi antara GraphQL, MySQL, dan Flutter di sisi antarmuka pengguna.







