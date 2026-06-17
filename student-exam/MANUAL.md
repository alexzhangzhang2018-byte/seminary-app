# 美村宣教学院 · 内部考试系统使用说明  
# MMS Internal Exam System — User Guide  
# Panduan Sistem Ujian Internal MMS

**在线地址 / URLs / Alamat**

| 角色 | 链接 |
|------|------|
| 学生 / Student / Siswa | https://seminary-app.vercel.app/student-exam/ |
| 教务教师 / Staff / Staf | https://seminary-app.vercel.app/student-exam/teacher.html |

建议使用 **Chrome、Safari、Edge** 等现代浏览器；手机也可答题，但推荐用电脑以获得更大答题区域。

---

# 一、中文说明

## 1. 系统简介

内部考试系统供神学生在考试日当天在线签到、答题；供教务老师导入试卷、排考、阅卷与导出成绩。系统支持 **中文班、英文班、印尼语班** 三个班级轨道，试卷与界面均可对应多语言。

**今日流程概览：**

```
签到（一次）→ 查看今日科目列表 → 进入各科 → 确认卷头 → 答题 → 交卷 → 下一科
```

---

## 2. 学生端操作步骤

### 2.1 打开考试页

1. 在考试日当天打开学生端链接。  
2. 右上角可切换界面语言（中文 / EN / ID），**不影响试题语言**——试题语言由您选择的**班级**决定（见下）。

### 2.2 今日签到

填写以下信息，点击 **「签到并开始」**：

| 项目 | 说明 |
|------|------|
| **姓名** | 与学籍一致的全名 |
| **班级** | 中文班 / 英文班 / 印尼语班（决定答卷语言） |
| **年级** | 一年级 / 二年级 / 三年级 |
| **手机后 4 位** | **选填**；建议填写，便于换设备时恢复进度 |

- 每个考试日只需签到 **一次**。  
- 同一浏览器再次打开页面时，系统会**自动记住**您的会话，一般无需重复签到。

### 2.3 恢复今日进度（换设备时）

若更换手机/电脑，或清除了浏览器数据：

1. 填写与首次签到**完全相同**的姓名、班级、年级；  
2. **必须填写**签到时使用的手机/WhatsApp **后 4 位**；  
3. 点击 **「恢复今日进度」**（不是「签到并开始」）。

找不到记录时，请核对信息是否一致，或联系教务。

### 2.4 今日考试安排

签到成功后进入科目列表，每科显示：

- 科目名称、开始—结束时间  
- 状态：**未开始** / **进行中** / **答题中** / **已交卷**

在各科**开放时间**内点击 **「进入考试」** 或 **「继续答题」**。未到开始时间或已结束且未在考中的科目无法进入。

### 2.5 卷头确认

首次进入某科时，请核对科目、年级、班级、姓名，确认无误后点击 **「确认无误，开始答题」**。

### 2.6 答题与交卷

- 题型可能包括：填空、单选、判断、简答/论述等。  
- 页面顶部显示**剩余时间**；距结束约 **10 分钟** 会弹出提醒。  
- 答案约每 **15 秒** 自动保存；意外关闭页面后，在同一设备或成功「恢复进度」后可继续作答。  
- 简答题下方有字数/词数提示（中文按字、英文/印尼语按词）；不足建议字数时会橙色提示。  
- 完成后点击 **「交卷」**；时间到将**自动交卷**。  
- 交卷后返回科目列表，可考下一科。

### 2.7 考试纪律（系统自动记录）

- 答题过程中**切换标签页、最小化窗口**等会被记录为「切屏」，次数显示在教师端成绩列表中。  
- 请全程专注答题，勿查阅未经授权的资料。  
- 尽量使用**同一台设备、同一浏览器**完成考试；若必须换设备，请提前在签到时填写手机后 4 位。

---

## 3. 教务教师端操作步骤

使用与**招生系统相同的教务账号**（admin / teacher）登录教师端。

### 3.1 题库 / 试卷

**推荐：从 Word 导入**

1. 填写试卷标题、年级。  
2. 上传中文 `.docx`（必填）；英文、印尼语卷可选（三语合一卷可只传一份含多语言的 docx，或分传后合并）。  
3. 点击 **「从 Word 解析到下方」**，在 JSON 区域检查题目。  
4. 点击 **「保存试卷」** 入库。

支持的 Word 格式包括：课程卷（填空、单选、判断、简答、论述）、诗篇卷、招生卷等。上传**答案版** docx 可自动识别客观题答案；仅考试版也可导入，但客观题需补答案后才能机评。

列表中 **绿色** 标签表示该语言题干已入库；排考时请确保所选试卷包含对应班级语言。

### 3.2 考试日（排考）

1. 填写考试日名称、日期。  
2. 每门科目一行：科目名称、绑定试卷、年级、**班级（可多选）**、开始/结束时间。  
3. **三语同考**：同一科目、同一时段若三班都要考，在一行勾选「中文班 / 英文班 / 印尼语班」（默认三语全选），保存后自动拆成三条排考。也可点 **「+ 添加科目（三语同考）」**。  
4. 点击 **「保存考试日」**。

**注意：** 每个日期只能有一个考试日；同日再次保存会**覆盖**科目安排并重新启用。

### 3.3 成绩

1. 选择考试日、科目。  
2. 查看答卷列表：客观分、主观分、总分、阅卷状态、切屏次数。  
3. 点击某行进入**人工阅卷**（简答/论述题）。  
4. 可 **导出 CSV** 备份成绩。

客观题交卷后自动评分；主观题需教师打分后才有总分。

### 3.4 考试管理

| 功能 | 说明 |
|------|------|
| **一键终止考试** | 立即关闭该考试日，并强制交卷所有进行中的答卷 |
| **删除考试日** | 永久删除该日排考、签到与答卷（用于重新排考） |
| **清除测试账号** | 仅删除测试用签到（姓名「张」、手机尾号 5668） |

---

## 4. 常见问题（学生）

| 问题 | 处理 |
|------|------|
| 显示「今日暂无安排的考试」 | 今天不是考试日，或教务尚未创建/启用考试日 |
| 科目显示「未开始」 | 未到该科开始时间，请等待 |
| 科目显示「已结束」且无法进入 | 该科时间窗口已过且您未在考中 |
| 换手机后找不到进度 | 使用「恢复今日进度」并填写正确的手机后 4 位 |
| 页面卡住 | 刷新页面；同一设备一般会回到科目列表 |

---

## 5. 注意事项摘要

**学生**

- 考试日当天再打开链接；提前打开可能显示无考试。  
- 签到时建议填写手机后 4 位。  
- 按自己的**班级**选择，勿选错语言班。  
- 在各科规定时间内完成；超时自动交卷。  
- 勿频繁切屏；答案会自动保存，但请勿故意关闭页面。

**教务**

- 先入库试卷，再创建考试日。  
- 排考时试卷语言须覆盖所勾选的班级。  
- 删除考试日不可恢复，操作前请确认。  
- 终止考试会影响所有未交卷学生，请谨慎使用。

---

---

# II. English Guide

## 1. Overview

The Internal Exam system lets seminary students check in on exam day, take scheduled subjects online, and lets staff import papers, schedule exams, grade essays, and export results. Three class tracks are supported: **Chinese, English, and Indonesian**.

**Typical student flow:**

```
Check in (once) → Today's schedule → Enter each subject → Confirm cover → Answer → Submit → Next subject
```

---

## 2. Student Steps

### 2.1 Open the exam page

1. On exam day, open the student URL.  
2. Use the top-right language switch (中文 / EN / ID) for **UI labels only**. Exam content language follows your **class** selection below.

### 2.2 Check in

Fill in the form and tap **Check in**:

| Field | Notes |
|-------|-------|
| **Full name** | As registered |
| **Class** | Chinese / English / Indonesian class (sets exam language) |
| **Year** | Year 1 / 2 / 3 |
| **Last 4 digits** | **Optional** but strongly recommended for device recovery |

- Check in **once per exam day**.  
- The same browser usually **remembers** your session automatically.

### 2.3 Resume today (new device)

If you changed device or cleared browser data:

1. Enter the **same** name, class, and year as at check-in;  
2. **Required:** last 4 digits of phone/WhatsApp used at check-in;  
3. Tap **Resume today** (not Check in).

If not found, verify your details or contact the registrar.

### 2.4 Today's schedule

After check-in you see each subject with time window and status: **Not started / Open / In progress / Submitted**.

Tap **Start exam** or **Continue** only while that subject's window is open.

### 2.5 Cover sheet

Confirm subject, year, class, and name, then tap **Confirm & start**.

### 2.6 Answering & submit

- Question types: fill-in, multiple choice, true/false, short/long essay, etc.  
- A **countdown** appears at the top; about **10 minutes** before the end you get a warning.  
- Answers **auto-save** about every 15 seconds.  
- Essay boxes show word/character counts (Chinese: characters; EN/ID: words).  
- Tap **Submit** when finished; the system **auto-submits** when time runs out.

### 2.7 Proctoring notes

- **Switching tabs** or hiding the window is recorded (tab-switch count visible to staff).  
- Stay on the exam page; do not use unauthorized materials.  
- Prefer one device/browser; if you must switch, use phone last-4 recovery.

---

## 3. Staff (Teacher) Steps

Log in with the same **admin / teacher** account as the enrollment system.

### 3.1 Papers

1. Enter title and year.  
2. Upload Chinese `.docx` (required); EN/ID optional.  
3. **Parse from Word**, review JSON, **Save paper**.  
4. Green badges = language available; schedule papers that match each class track.

### 3.2 Exam days

1. Title and date.  
2. Per subject row: name, paper, year, **class checkboxes**, start/end time.  
3. **Tri-track same slot:** check Chinese + English + Indonesian on one row (default: all three); one save creates three schedule entries.  
4. **Save exam day** — only **one exam day per calendar date**; saving again on the same date **overwrites** subjects.

### 3.3 Grades

Select day and subject → view attempts → click a row to **grade essays** → **Export CSV**.

Objective items are scored automatically; essays need manual grading.

### 3.4 Exam admin

| Action | Effect |
|--------|--------|
| **End exam day** | Closes the day and force-submits in-progress attempts |
| **Delete exam day** | Permanently removes schedule, check-ins, and attempts |
| **Clear test student** | Removes test check-ins (name 张, last-4 5668) only |

---

## 4. Student FAQ

| Issue | What to do |
|-------|------------|
| No exam scheduled today | Not exam day or staff has not published a day |
| Subject "Upcoming" | Wait until start time |
| Subject "Ended" | Time window closed and you were not in progress |
| Cannot resume on new phone | Use Resume today + correct last 4 digits |
| Page frozen | Refresh; same device should return to schedule |

---

## 5. Key reminders

**Students:** Check in on exam day; fill last 4 digits; pick the correct class; finish within each time window; avoid tab switching.

**Staff:** Import papers before scheduling; match paper languages to classes; deleting an exam day is irreversible; ending a day affects all active students.

---

---

# III. Panduan Bahasa Indonesia

## 1. Ringkasan

Sistem ujian internal untuk mahasiswa seminar: check-in pada hari ujian, mengerjakan mata kuliah terjadwal secara daring; staf mengimpor soal, menjadwalkan ujian, menilai esai, dan mengekspor nilai. Tiga jalur kelas: **Bahasa Cina, Inggris, dan Indonesia**.

**Alur siswa:**

```
Check-in (sekali) → Jadwal hari ini → Masuk mata kuliah → Konfirmasi identitas → Mengerjakan → Kumpulkan → Mata kuliah berikutnya
```

---

## 2. Langkah Siswa

### 2.1 Buka halaman ujian

1. Pada hari ujian, buka tautan siswa.  
2. Tombol bahasa di kanan atas (中文 / EN / ID) hanya untuk **tampilan antarmuka**. Bahasa soal mengikuti **kelas** yang dipilih.

### 2.2 Check-in

Isi formulir dan tekan **Check-in**:

| Kolom | Keterangan |
|-------|------------|
| **Nama lengkap** | Sesuai data |
| **Kelas** | Kelas Cina / Inggris / Indonesia (menentukan bahasa ujian) |
| **Angkatan** | Tahun 1 / 2 / 3 |
| **4 digit terakhir HP** | **Opsional**; sangat disarankan untuk pemulihan perangkat |

- Check-in **sekali per hari ujian**.  
- Browser yang sama biasanya **mengingat** sesi secara otomatis.

### 2.3 Lanjutkan hari ini (ganti perangkat)

Jika ganti HP/komputer atau menghapus data browser:

1. Isi nama, kelas, angkatan **sama persis** seperti saat check-in;  
2. **Wajib:** 4 digit terakhir HP/WhatsApp saat check-in;  
3. Tekan **Lanjutkan hari ini** (bukan Check-in).

Jika tidak ditemukan, periksa data atau hubungi staf akademik.

### 2.4 Jadwal hari ini

Setelah check-in, setiap mata kuliah menampilkan waktu dan status: **Belum mulai / Berlangsung / Mengerjakan / Terkirim**.

Tekan **Mulai ujian** atau **Lanjutkan** hanya dalam jendela waktu mata kuliah tersebut.

### 2.5 Konfirmasi identitas

Periksa mata kuliah, angkatan, kelas, nama, lalu **Konfirmasi & mulai**.

### 2.6 Mengerjakan & mengumpulkan

- Jenis soal: isian, pilihan ganda, benar/salah, esai, dll.  
- **Hitung mundur** di bagian atas; peringatan sekitar **10 menit** sebelum selesai.  
- Jawaban **tersimpan otomatis** ± setiap 15 detik.  
- Kotak esai menampilkan jumlah kata/huruf (Cina: karakter; EN/ID: kata).  
- Tekan **Kumpulkan** jika selesai; sistem **mengumpulkan otomatis** saat waktu habis.

### 2.7 Aturan ujian

- **Pindah tab** atau menyembunyikan jendela **dicatat** (jumlah terlihat di sisi staf).  
- Tetap di halaman ujian; jangan memakai bahan yang tidak diizinkan.  
- Usahakan satu perangkat/browser; jika harus ganti, gunakan pemulihan 4 digit HP.

---

## 3. Langkah Staf (Guru)

Masuk dengan akun **admin / teacher** yang sama dengan sistem penerimaan.

### 3.1 Bank soal

1. Judul dan angkatan.  
2. Unggah `.docx` bahasa Cina (wajib); EN/ID opsional.  
3. **Parse dari Word**, periksa JSON, **Simpan soal**.  
4. Lencana hijau = bahasa tersedia; jadwalkan soal yang sesuai setiap kelas.

### 3.2 Hari ujian

1. Nama dan tanggal.  
2. Per baris: nama mata kuliah, soal, angkatan, **centang kelas**, waktu mulai/selesai.  
3. **Tiga bahasa sekali jadwal:** centang Cina + Inggris + Indonesia dalam satu baris (default: ketiganya); simpan sekali menghasilkan tiga entri jadwal.  
4. **Simpan hari ujian** — hanya **satu hari ujian per tanggal**; simpan ulang pada tanggal sama **menimpa** jadwal.

### 3.3 Nilai

Pilih hari dan mata kuliah → daftar jawaban → klik baris untuk **menilai esai** → **Ekspor CSV**.

Soal objektif dinilai otomatis; esai perlu penilaian manual.

### 3.4 Pengelolaan ujian

| Tindakan | Dampak |
|----------|--------|
| **Akhiri hari ujian** | Menutup hari itu dan memaksa kumpulkan jawaban yang masih berjalan |
| **Hapus hari ujian** | Menghapus permanen jadwal, check-in, dan jawaban |
| **Hapus akun uji** | Hanya menghapus check-in uji (nama 张, 4 digit 5668) |

---

## 4. FAQ Siswa

| Masalah | Solusi |
|---------|--------|
| Tidak ada ujian hari ini | Bukan hari ujian atau staf belum mempublikasikan |
| Status "Belum mulai" | Tunggu waktu mulai |
| Status "Selesai" | Jendela waktu tutup dan Anda tidak sedang mengerjakan |
| Tidak bisa lanjut di HP baru | Gunakan Lanjutkan hari ini + 4 digit yang benar |
| Halaman macet | Muat ulang; perangkat yang sama biasanya kembali ke jadwal |

---

## 5. Peringatan penting

**Siswa:** Check-in pada hari ujian; isi 4 digit HP; pilih kelas yang benar; selesaikan dalam jendela waktu; hindari pindah tab.

**Staf:** Impor soal sebelum menjadwalkan; pastikan bahasa soal sesuai kelas; menghapus hari ujian tidak dapat dibatalkan; mengakhiri hari ujian memengaruhi semua siswa yang belum kumpul.

---

*文档版本 / Document version / Versi dokumen: 2026-06-13*
