/* 美村宣教学院 · 继续申请（二/三年级）三语字典
 * Continuing Application i18n dictionary (zh / id / en)
 *
 * 使用方式：window.CL.t('field.full_name', 'zh') → '姓名'
 *           window.CL.STATUS_LABEL.zh.admitted → '已录取'
 *
 * 招生简章正文文案可在本文件直接修改，便于学校自行润色三语版本。
 */
(function (root) {
  'use strict';

  var STATUS_LABEL = {
    zh: {
      submitted:    '已提交',
      under_review: '审核中',
      interview:    '安排面试',
      admitted:     '已录取',
      waitlist:     '候补',
      rejected:     '婉拒',
    },
    id: {
      submitted:    'Terkirim',
      under_review: 'Sedang ditinjau',
      interview:    'Jadwal wawancara',
      admitted:     'Diterima',
      waitlist:     'Daftar tunggu',
      rejected:     'Ditolak',
    },
    en: {
      submitted:    'Submitted',
      under_review: 'Under review',
      interview:    'Interview scheduled',
      admitted:     'Admitted',
      waitlist:     'Waitlist',
      rejected:     'Not selected',
    },
  };

  var STATUS_HINT = {
    zh: {
      submitted:    '我们已收到您的申请，正在排期审核。',
      under_review: '招生办正在审核您的申请，请耐心等待。',
      interview:    '请关注 WhatsApp / 邮箱，老师将与您约定面试时间。',
      admitted:     '恭喜您被录取！稍后会有老师与您联系奖学金申请事宜。',
      waitlist:     '您目前列入候补名单，若有名额释放将另行通知。',
      rejected:     '感谢您的报名。本期未能录取，欢迎下期继续申请。',
    },
    id: {
      submitted:    'Permohonan Anda telah kami terima dan akan segera ditinjau.',
      under_review: 'Sedang dalam proses peninjauan oleh panitia penerimaan.',
      interview:    'Mohon pantau WhatsApp / email Anda; guru akan menghubungi untuk wawancara.',
      admitted:     'Selamat, Anda diterima! Guru akan menghubungi Anda mengenai beasiswa.',
      waitlist:     'Anda masuk daftar tunggu. Kami akan memberi tahu jika ada tempat tersedia.',
      rejected:     'Terima kasih telah mendaftar. Kali ini belum bisa diterima; silakan coba lagi periode berikutnya.',
    },
    en: {
      submitted:    'We have received your application and will start reviewing soon.',
      under_review: 'The admissions office is reviewing your application.',
      interview:    'Please keep an eye on WhatsApp / email; we will reach out to schedule your interview.',
      admitted:     'Congratulations, you have been admitted! A teacher will follow up regarding scholarships.',
      waitlist:     'You are on the waitlist. We will notify you if a seat opens up.',
      rejected:     'Thank you for applying. We are unable to offer you a place this round.',
    },
  };

  var AID_INTENT_LABEL = {
    zh: {
      full_scholarship: '全额奖学金（覆盖学费及食宿）',
      partial_aid:      '助学金（部分资助）',
      work_study:       '勤工助学岗位',
      none:             '不申请资助',
    },
    id: {
      full_scholarship: 'Beasiswa penuh (kuliah & akomodasi)',
      partial_aid:      'Bantuan keuangan parsial',
      work_study:       'Kerja-belajar (work-study)',
      none:             'Tidak memohon bantuan',
    },
    en: {
      full_scholarship: 'Full scholarship (tuition & lodging)',
      partial_aid:      'Partial financial aid',
      work_study:       'Work-study position',
      none:             'No aid requested',
    },
  };

  // 核心字段/界面文案字典：键尽量短而易读
  var DICT = {
    zh: {
      'app.title':        '美村宣教学院 · 继续申请',
      'app.subtitle':     '教牧领袖与宣教士课程 · 第二年 / 第三年报名',
      'app.lang_label':   '语言',
      'app.read_guide':   '招生简章',
      'app.form':         '申请表',
      'app.submit_done':  '提交成功',
      'app.status_query': '查询申请状态',

      'guide.intro_h':       '学院介绍',
      'guide.intro_p':       '美村宣教学院于 2024 年 7 月由美村基金会正式创立于雅加达，开办印尼语、英语、中文三种语言的一年制基础圣经课程，以及二年制、三年制进深的教牧领袖、宣教士和师资课程。',
      'guide.purpose_h':     '学院宗旨',
      'guide.purpose_p':     '我们致力于建立勤奋务实的宣教士团队，以建立忠信福音的使命教会。',
      'guide.program_h':     '课程介绍',
      'guide.program_p':     '教牧领袖与宣教士课程学制为一年，培养有信心、知识、能力、心志、模式、团队、意识等七个素质全面成长的教牧领袖与宣教士。课程涵盖圣经研究、实践神学、历史神学、教义神学等四个类别。',
      'guide.cond_h':        '报名条件',
      'guide.cond_l1':       '1. 完成一年制圣经研究基础课程，成绩优异的学员可申请第二年/第三年课程。',
      'guide.cond_l2':       '2. 有良好的品格与侍奉的心志。',
      'guide.cond_l3':       '3. 认同学院的神学与理念，并有志在未来成为宣教士。',
      'guide.fee_h':         '学费与资助',
      'guide.fee_p':         '学费 3000 美元 / 年；食宿费用 200 美元 / 月。往返路费及签证费用自理。学院为正式录取的学员提供全额奖学金（覆盖学费及食宿），并根据申请为有需要的学员提供助学金及勤工助学岗位。',
      'guide.contact_h':     '联系我们',
      'guide.contact_p':     '地址：14 F, Gajah Mada Plaza, Jl. Gajah Mada No.19 26, Central Jakarta\n联系人：利未老师 · levi.zhang2024@gmail.com\n网址：www.newislander.net',
      'guide.note':          '本简章最终解释权归美村宣教学院招生办；招生政策可能会根据实际情况适当调整，所有录取结果以正式录取通知书为准。',

      'sec.target':       '申请方向',
      'sec.basic':        '基础信息',
      'sec.text':         '个人见证（每段建议 500 字左右）',
      'sec.aid':          '资助意向',
      'sec.consent':      '同意条款',

      'field.target_year':   '申请年级',
      'opt.year2':           '第二年课程',
      'opt.year3':           '第三年课程',
      'field.class_lang':    '班级语言',
      'opt.zh':              '中文',
      'opt.id':              'Bahasa Indonesia',
      'opt.en':              'English',

      'field.full_name':     '姓名',
      'field.gender':        '性别',
      'opt.male':            '男',
      'opt.female':          '女',
      'field.date_of_birth': '出生年月',
      'field.nationality':   '国家 / 籍贯',
      'field.email':         '邮箱',
      'field.whatsapp':      'WhatsApp（含国际区号）',
      'field.education':     '学历',
      'field.conversion_time': '信主时间',

      'field.first_year_reflection': '第一年学习的主要收获',
      'field.gospel_confession':     '福音认信',
      'field.calling_testimony':     '蒙召见证',

      'field.aid_intent':      '资助意向',
      'field.aid_intent_note': '资助说明（可选）',
      'field.aid_intent_ph':   '如有家庭经济、奉献来源等情况可简要说明',

      'consent.label':  '我已阅读招生简章，理解学费与奖助学金政策，并确认所填内容真实。',

      'btn.submit':     '提交申请',
      'btn.submitting': '提交中…',
      'btn.draft_save': '草稿已自动保存',
      'btn.draft_clear':'清除本机草稿',

      'count.suffix':    '字符',
      'count.limit':     '上限 {n} 字符',

      'submit.success_h':  '提交成功',
      'submit.success_p':  '请妥善保存以下申请编号，凭此编号 + 邮箱或 WhatsApp 后 4 位可查询进度：',
      'submit.next_p':     '我们将通过 WhatsApp / 邮箱与您联系。若两周内未收到回复，请联系：levi.zhang2024@gmail.com',
      'submit.copy':       '复制申请编号',
      'submit.copied':     '已复制',
      'submit.go_status':  '查询申请状态',
      'submit.new':        '再填一份',

      'lookup.title':     '查询继续申请状态',
      'lookup.no':        '申请编号',
      'lookup.no_ph':     '例如 MMS-Y2-2026-0042',
      'lookup.secret':    '邮箱 或 WhatsApp 后 4 位',
      'lookup.secret_ph': '提交申请时所留的邮箱或手机号',
      'lookup.btn':       '查询',
      'lookup.empty':     '请输入申请编号和邮箱或 WhatsApp 后 4 位',
      'lookup.not_found': '未找到该申请编号，或邮箱/WhatsApp 后 4 位不匹配。请核对后重试。',
      'lookup.failed':    '查询失败，请稍后重试。',
      'lookup.year':      '申请年级',
      'lookup.class_lang':'班级语言',
      'lookup.submitted_at':'提交时间',
      'lookup.updated_at':'最近更新',
      'lookup.aid_intent':'资助意向',
      'lookup.return':    '返回填写新申请',

      'err.required':       '请填写：{label}',
      'err.contact':        '请至少留下邮箱或 WhatsApp 之一',
      'err.consent':        '请勾选「同意条款」后再提交',
      'err.too_long':       '某段长文本超过 3000 字符上限，请精简后再提交',
      'err.duplicate':      '24 小时内已使用相同邮箱或姓名 + WhatsApp 后 4 位提交过申请，请勿重复提交',
      'err.network':        '网络异常，请稍后再试',
      'err.invalid_year':   '请选择申请年级',
      'err.invalid_lang':   '请选择班级语言',
    },

    id: {
      'app.title':        'MMS · Pendaftaran Lanjutan',
      'app.subtitle':     'Program Pemimpin Pastoral & Misionaris · Tahun ke-2 / ke-3',
      'app.lang_label':   'Bahasa',
      'app.read_guide':   'Panduan Penerimaan',
      'app.form':         'Formulir Pendaftaran',
      'app.submit_done':  'Pengiriman berhasil',
      'app.status_query': 'Cek status permohonan',

      'guide.intro_h':       'Tentang Sekolah',
      'guide.intro_p':       'Meicun Mission Seminary (MMS) didirikan resmi di Jakarta oleh Yayasan Meicun pada Juli 2024. Kami menyelenggarakan program dasar Alkitab 1 tahun (Bahasa Indonesia, Inggris, Mandarin) serta program lanjutan 2 dan 3 tahun untuk pemimpin pastoral, misionaris, dan pengajar.',
      'guide.purpose_h':     'Visi & Misi',
      'guide.purpose_p':     'Membangun tim misionaris yang rajin dan praktis demi gereja-gereja misional yang setia pada Injil.',
      'guide.program_h':     'Tentang Program',
      'guide.program_p':     'Program Pemimpin Pastoral & Misionaris berdurasi 1 tahun, bertujuan membentuk pelayan yang bertumbuh secara menyeluruh dalam tujuh aspek (iman, pengetahuan, kemampuan, kerelaan hati, model pelayanan, kerja sama tim, dan kesadaran misi). Kurikulum meliputi studi Alkitab, teologi praktis, teologi historis, dan teologi dogmatis.',
      'guide.cond_h':        'Syarat Pendaftaran',
      'guide.cond_l1':       '1. Telah menyelesaikan program dasar Alkitab 1 tahun dengan hasil baik.',
      'guide.cond_l2':       '2. Memiliki karakter yang baik dan kerelaan untuk melayani.',
      'guide.cond_l3':       '3. Setuju dengan teologi dan visi sekolah, serta berkomitmen untuk menjadi misionaris.',
      'guide.fee_h':         'Biaya & Beasiswa',
      'guide.fee_p':         'Biaya kuliah USD 3.000 / tahun; akomodasi & makan USD 200 / bulan. Biaya perjalanan dan visa ditanggung sendiri. Sekolah menyediakan beasiswa penuh bagi mahasiswa yang diterima (mencakup kuliah serta akomodasi), serta bantuan parsial dan kerja-belajar bagi yang membutuhkan.',
      'guide.contact_h':     'Hubungi Kami',
      'guide.contact_p':     'Alamat: 14 F, Gajah Mada Plaza, Jl. Gajah Mada No.19 26, Jakarta Pusat\nKontak: Pak Levi · levi.zhang2024@gmail.com\nWeb: www.newislander.net',
      'guide.note':          'Hak interpretasi akhir atas panduan ini dimiliki oleh kantor penerimaan MMS; kebijakan dapat disesuaikan, dan hasil penerimaan resmi ditentukan oleh surat penerimaan.',

      'sec.target':       'Tujuan Pendaftaran',
      'sec.basic':        'Informasi Dasar',
      'sec.text':         'Kesaksian Pribadi (sekitar 500 kata per bagian)',
      'sec.aid':          'Permohonan Bantuan',
      'sec.consent':      'Persetujuan',

      'field.target_year':   'Jenjang yang dilamar',
      'opt.year2':           'Tahun ke-2',
      'opt.year3':           'Tahun ke-3',
      'field.class_lang':    'Bahasa Kelas',
      'opt.zh':              '中文',
      'opt.id':              'Bahasa Indonesia',
      'opt.en':              'English',

      'field.full_name':     'Nama lengkap',
      'field.gender':        'Jenis kelamin',
      'opt.male':            'Laki-laki',
      'opt.female':          'Perempuan',
      'field.date_of_birth': 'Tanggal lahir',
      'field.nationality':   'Kewarganegaraan / Asal',
      'field.email':         'Email',
      'field.whatsapp':      'WhatsApp (dengan kode negara)',
      'field.education':     'Pendidikan terakhir',
      'field.conversion_time': 'Waktu bertobat',

      'field.first_year_reflection': 'Hal-hal yang Anda peroleh selama tahun pertama',
      'field.gospel_confession':     'Pengakuan Injil',
      'field.calling_testimony':     'Kesaksian panggilan',

      'field.aid_intent':      'Permohonan bantuan',
      'field.aid_intent_note': 'Keterangan (opsional)',
      'field.aid_intent_ph':   'Misalnya kondisi keluarga, sumber persembahan, dll.',

      'consent.label':  'Saya telah membaca panduan penerimaan, memahami kebijakan biaya & beasiswa, dan menyatakan data ini benar.',

      'btn.submit':     'Kirim permohonan',
      'btn.submitting': 'Mengirim…',
      'btn.draft_save': 'Draf tersimpan otomatis',
      'btn.draft_clear':'Hapus draf lokal',

      'count.suffix':    'karakter',
      'count.limit':     'Maks {n} karakter',

      'submit.success_h':  'Berhasil dikirim',
      'submit.success_p':  'Simpan baik-baik nomor permohonan di bawah. Anda dapat memeriksa status dengan nomor ini + email / 4 digit terakhir WhatsApp.',
      'submit.next_p':     'Kami akan menghubungi Anda lewat WhatsApp / email. Jika dalam 2 minggu belum ada balasan, silakan hubungi: levi.zhang2024@gmail.com',
      'submit.copy':       'Salin nomor',
      'submit.copied':     'Tersalin',
      'submit.go_status':  'Cek status',
      'submit.new':        'Buat permohonan baru',

      'lookup.title':     'Cek Status Pendaftaran Lanjutan',
      'lookup.no':        'Nomor permohonan',
      'lookup.no_ph':     'contoh: MMS-Y2-2026-0042',
      'lookup.secret':    'Email atau 4 digit terakhir WhatsApp',
      'lookup.secret_ph': 'Yang Anda isi saat mengirim permohonan',
      'lookup.btn':       'Cek',
      'lookup.empty':     'Masukkan nomor permohonan dan email atau 4 digit WhatsApp',
      'lookup.not_found': 'Nomor tidak ditemukan atau email / 4 digit WhatsApp tidak cocok. Mohon periksa kembali.',
      'lookup.failed':    'Gagal memuat, mohon coba lagi.',
      'lookup.year':      'Jenjang',
      'lookup.class_lang':'Bahasa kelas',
      'lookup.submitted_at':'Waktu pengiriman',
      'lookup.updated_at':'Pembaruan terakhir',
      'lookup.aid_intent':'Permohonan bantuan',
      'lookup.return':    'Buat permohonan baru',

      'err.required':       'Mohon isi: {label}',
      'err.contact':        'Mohon isi minimal satu: email atau WhatsApp',
      'err.consent':        'Mohon centang persetujuan sebelum mengirim',
      'err.too_long':       'Salah satu bagian melebihi 3000 karakter; mohon dipersingkat',
      'err.duplicate':      'Permohonan dengan email atau nama + 4 digit WhatsApp yang sama sudah dikirim dalam 24 jam',
      'err.network':        'Gangguan jaringan, coba lagi nanti',
      'err.invalid_year':   'Mohon pilih jenjang',
      'err.invalid_lang':   'Mohon pilih bahasa kelas',
    },

    en: {
      'app.title':        'MMS · Continuing Application',
      'app.subtitle':     'Pastoral Leader & Missionary Program · Year 2 / Year 3',
      'app.lang_label':   'Language',
      'app.read_guide':   'Admissions Guide',
      'app.form':         'Application Form',
      'app.submit_done':  'Submission complete',
      'app.status_query': 'Check application status',

      'guide.intro_h':       'About the Seminary',
      'guide.intro_p':       'Meicun Mission Seminary (MMS) was founded in Jakarta in July 2024 by the Meicun Foundation. It offers a one-year foundational Bible program in Indonesian, English, and Chinese, plus two- and three-year advanced programs for pastoral leaders, missionaries, and trainers.',
      'guide.purpose_h':     'Mission',
      'guide.purpose_p':     'To build diligent, practical missionary teams that plant gospel-faithful missional churches.',
      'guide.program_h':     'The Program',
      'guide.program_p':     'The Pastoral Leader & Missionary track is a one-year program that develops workers who grow in seven qualities: faith, knowledge, capability, willingness, ministry models, teamwork, and missional awareness. Coursework covers Bible studies, practical theology, historical theology, and dogmatic theology.',
      'guide.cond_h':        'Eligibility',
      'guide.cond_l1':       '1. Completed the one-year foundational Bible program with strong results.',
      'guide.cond_l2':       '2. Demonstrates good character and willingness to serve.',
      'guide.cond_l3':       '3. Affirms the seminary\u2019s theology and vision and aspires to become a missionary.',
      'guide.fee_h':         'Tuition & Aid',
      'guide.fee_p':         'Tuition: USD 3,000 / year; meals & lodging: USD 200 / month. Travel and visa are self-funded. The seminary provides full scholarships for admitted students (covering tuition and lodging), plus partial aid and work-study positions for those in need.',
      'guide.contact_h':     'Contact',
      'guide.contact_p':     'Address: 14 F, Gajah Mada Plaza, Jl. Gajah Mada No.19 26, Central Jakarta\nContact: Mr. Levi · levi.zhang2024@gmail.com\nWebsite: www.newislander.net',
      'guide.note':          'The final interpretation of this guide rests with the MMS admissions office; policies may be adjusted, and official admission is determined by the formal letter of admission.',

      'sec.target':       'Application target',
      'sec.basic':        'Basic information',
      'sec.text':         'Personal testimonies (~500 words each)',
      'sec.aid':          'Financial-aid intent',
      'sec.consent':      'Consent',

      'field.target_year':   'Year applying for',
      'opt.year2':           'Year 2',
      'opt.year3':           'Year 3',
      'field.class_lang':    'Class language',
      'opt.zh':              '中文',
      'opt.id':              'Bahasa Indonesia',
      'opt.en':              'English',

      'field.full_name':     'Full name',
      'field.gender':        'Gender',
      'opt.male':            'Male',
      'opt.female':          'Female',
      'field.date_of_birth': 'Date of birth',
      'field.nationality':   'Nationality / hometown',
      'field.email':         'Email',
      'field.whatsapp':      'WhatsApp (with country code)',
      'field.education':     'Education',
      'field.conversion_time': 'When you came to faith',

      'field.first_year_reflection': 'What you gained during the first year',
      'field.gospel_confession':     'Gospel confession',
      'field.calling_testimony':     'Testimony of calling',

      'field.aid_intent':      'Aid intent',
      'field.aid_intent_note': 'Notes (optional)',
      'field.aid_intent_ph':   'e.g. family finances, sources of support, etc.',

      'consent.label':  'I have read the admissions guide, understand the tuition and aid policy, and certify that the information provided is true.',

      'btn.submit':     'Submit application',
      'btn.submitting': 'Submitting\u2026',
      'btn.draft_save': 'Draft saved locally',
      'btn.draft_clear':'Clear local draft',

      'count.suffix':    'chars',
      'count.limit':     'Max {n} chars',

      'submit.success_h':  'Submission successful',
      'submit.success_p':  'Please keep the application number below. You can check progress with this number + email or last 4 digits of WhatsApp.',
      'submit.next_p':     'We will contact you by WhatsApp / email. If you do not hear back within two weeks, please email: levi.zhang2024@gmail.com',
      'submit.copy':       'Copy number',
      'submit.copied':     'Copied',
      'submit.go_status':  'Check status',
      'submit.new':        'Start another',

      'lookup.title':     'Check Continuing Application Status',
      'lookup.no':        'Application number',
      'lookup.no_ph':     'e.g. MMS-Y2-2026-0042',
      'lookup.secret':    'Email or last 4 digits of WhatsApp',
      'lookup.secret_ph': 'As you submitted in the form',
      'lookup.btn':       'Look up',
      'lookup.empty':     'Please enter the application number and email or last 4 digits of WhatsApp',
      'lookup.not_found': 'Application number not found, or email / last 4 digits do not match.',
      'lookup.failed':    'Lookup failed, please try again.',
      'lookup.year':      'Year applying for',
      'lookup.class_lang':'Class language',
      'lookup.submitted_at':'Submitted at',
      'lookup.updated_at':'Last updated',
      'lookup.aid_intent':'Aid intent',
      'lookup.return':    'Start a new application',

      'err.required':       'Please fill in: {label}',
      'err.contact':        'Please provide at least one: email or WhatsApp',
      'err.consent':        'Please tick the consent box before submitting',
      'err.too_long':       'One section exceeds 3000 characters; please shorten it',
      'err.duplicate':      'A submission with the same email or name + last 4 of WhatsApp was made in the past 24 hours',
      'err.network':        'Network error, please try again later',
      'err.invalid_year':   'Please choose a year',
      'err.invalid_lang':   'Please choose a class language',
    },
  };

  function pickLang(L) {
    L = String(L || '').toLowerCase();
    if (L === 'id' || L === 'en') return L;
    return 'zh';
  }

  function t(key, lang, vars) {
    var L = pickLang(lang);
    var s = (DICT[L] && DICT[L][key]) || (DICT.zh && DICT.zh[key]) || key;
    if (vars && typeof s === 'string') {
      s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] == null ? '' : String(vars[k]); });
    }
    return s;
  }

  function fmtDate(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return String(iso).slice(0, 19).replace('T', ' ');
      var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
           + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    } catch (e) {
      return String(iso).slice(0, 19).replace('T', ' ');
    }
  }

  root.CL = {
    t: t,
    pickLang: pickLang,
    fmtDate: fmtDate,
    DICT: DICT,
    STATUS_LABEL: STATUS_LABEL,
    STATUS_HINT: STATUS_HINT,
    AID_INTENT_LABEL: AID_INTENT_LABEL,
    LANGS: ['zh', 'id', 'en'],
    STATUSES: ['submitted', 'under_review', 'interview', 'admitted', 'waitlist', 'rejected'],
    AID_INTENTS: ['full_scholarship', 'partial_aid', 'work_study', 'none'],
  };
})(typeof window !== 'undefined' ? window : this);
