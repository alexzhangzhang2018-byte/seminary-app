/* 神学生内部考试 — 共享模块 */
'use strict';

export const SUPABASE_URL = 'https://szjduusewnjxacrbbsdf.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6amR1dXNld25qeGFjcmJic2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjMxNjEsImV4cCI6MjA5MDQzOTE2MX0.7Cg_uOp2Q2wtKaZqVnYdMLvnZJEyh6GyE26xXb-UTBw';

export const SESSION_KEY = 'mms_student_exam_token_v1';
export const LANG_KEY = 'mms_student_exam_lang_v1';

export function createSb() {
  if (typeof supabase === 'undefined') return null;
  return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const UI = {
  zh: {
    site: '美村宣教学院 · 内部考试',
    checkin_title: '今日考试签到',
    checkin_hint: '请填写与纸质卷相同的姓名，选择年级与答卷语言。今日只需签到一次。',
    full_name: '姓名',
    grade: '年级',
    grade1: '一年级', grade2: '二年级', grade3: '三年级',
    class_track: '班级',
    track_zh_en: '中英班（试卷：启·撒·诗 等）',
    track_id: '印尼语班（试卷：启·撒·来 等）',
    exam_lang: '答卷语言',
    phone_last4: '手机/WhatsApp 后 4 位（选填，换设备时恢复）',
    btn_checkin: '签到并开始',
    btn_resume: '恢复今日进度',
    schedule_title: '今日考试安排',
    hello: '您好',
    subject: '科目',
    window_upcoming: '未开始',
    window_open: '进行中',
    window_ended: '已结束',
    status_not_started: '未开始',
    status_in_progress: '答题中',
    status_submitted: '已交卷',
    btn_enter: '进入考试',
    btn_continue: '继续答题',
    btn_done: '已完成',
    cover_title: '请确认卷头信息',
    cover_name: '姓名',
    cover_confirm: '确认无误，开始答题',
    submit: '交卷',
    submitted_ok: '答卷已提交，谢谢！',
    timer: '剩余时间',
    proctor_warn: '检测到切屏（已记录）',
    no_exam: '今日暂无安排的考试，请联系教务。',
    err: '操作失败，请重试',
    loading: '加载中…',
    back_schedule: '返回日程',
  },
  en: {
    site: 'MMS · Internal Exam',
    checkin_title: 'Check-in for today',
    checkin_hint: 'Enter your name as on paper, grade, and exam language. Check in once per day.',
    full_name: 'Full name',
    grade: 'Year',
    grade1: 'Year 1', grade2: 'Year 2', grade3: 'Year 3',
    class_track: 'Class',
    track_zh_en: 'Chinese/English track',
    track_id: 'Indonesian track',
    exam_lang: 'Exam language',
    phone_last4: 'Last 4 digits of phone/WhatsApp (optional)',
    btn_checkin: 'Check in',
    btn_resume: 'Resume today',
    schedule_title: "Today's schedule",
    hello: 'Hello',
    subject: 'Subject',
    window_upcoming: 'Upcoming',
    window_open: 'Open',
    window_ended: 'Ended',
    status_not_started: 'Not started',
    status_in_progress: 'In progress',
    status_submitted: 'Submitted',
    btn_enter: 'Start exam',
    btn_continue: 'Continue',
    btn_done: 'Done',
    cover_title: 'Confirm cover sheet',
    cover_name: 'Name',
    cover_confirm: 'Confirm & start',
    submit: 'Submit',
    submitted_ok: 'Submitted. Thank you!',
    timer: 'Time left',
    proctor_warn: 'Tab switch recorded',
    no_exam: 'No exam scheduled today.',
    err: 'Something went wrong',
    loading: 'Loading…',
    back_schedule: 'Back to schedule',
  },
  id: {
    site: 'MMS · Ujian Internal',
    checkin_title: 'Check-in hari ini',
    checkin_hint: 'Isi nama seperti di kertas ujian, angkatan, dan bahasa ujian. Cukup sekali per hari.',
    full_name: 'Nama lengkap',
    grade: 'Angkatan',
    grade1: 'Tahun 1', grade2: 'Tahun 2', grade3: 'Tahun 3',
    class_track: 'Kelas',
    track_zh_en: 'Kelas Cina/Inggris',
    track_id: 'Kelas Bahasa Indonesia',
    exam_lang: 'Bahasa ujian',
    phone_last4: '4 digit terakhir HP/WhatsApp (opsional)',
    btn_checkin: 'Check-in',
    btn_resume: 'Lanjutkan hari ini',
    schedule_title: 'Jadwal hari ini',
    hello: 'Shalom',
    subject: 'Mata kuliah',
    window_upcoming: 'Belum mulai',
    window_open: 'Berlangsung',
    window_ended: 'Selesai',
    status_not_started: 'Belum mulai',
    status_in_progress: 'Mengerjakan',
    status_submitted: 'Terkirim',
    btn_enter: 'Mulai ujian',
    btn_continue: 'Lanjutkan',
    btn_done: 'Selesai',
    cover_title: 'Konfirmasi identitas',
    cover_name: 'Nama',
    cover_confirm: 'Konfirmasi & mulai',
    submit: 'Kumpulkan',
    submitted_ok: 'Terkirim. Terima kasih!',
    timer: 'Sisa waktu',
    proctor_warn: 'Pindah tab tercatat',
    no_exam: 'Tidak ada ujian hari ini.',
    err: 'Gagal',
    loading: 'Memuat…',
    back_schedule: 'Kembali ke jadwal',
  },
};

export function t(lang, key) {
  const L = UI[lang] || UI.zh;
  return L[key] ?? UI.zh[key] ?? key;
}

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function fmtTime(iso, lang) {
  if (!iso) return '—';
  try {
    const loc = lang === 'zh' ? 'zh-CN' : lang === 'id' ? 'id-ID' : 'en-GB';
    return new Intl.DateTimeFormat(loc, {
      hour: '2-digit', minute: '2-digit', hour12: false,
      timeZone: 'Asia/Jakarta',
    }).format(new Date(iso));
  } catch {
    return String(iso).slice(11, 16);
  }
}

export function fmtTimer(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function gradeLabel(g, lang) {
  return t(lang, `grade${g}`);
}

export function trackLabel(track, lang) {
  return track === 'id' ? t(lang, 'track_id') : t(lang, 'track_zh_en');
}

/** 中英班可选 zh/en；印尼班固定 id */
export function examLangOptionsForTrack(track) {
  if (track === 'id') return [{ v: 'id', l: 'Bahasa Indonesia' }];
  return [{ v: 'zh', l: '中文' }, { v: 'en', l: 'English' }];
}

export function renderQuestionHtml(q, answers, lang) {
  const gid = q.group_id;
  const cur = answers[gid];
  const no = q.sort_order;
  let body = '';

  if (q.type === 'single') {
    const opts = Array.isArray(q.options) ? q.options : [];
    body = opts.map((opt, i) => {
      const checked = cur === i ? ' checked' : '';
      return `<label class="opt"><input type="radio" name="q_${gid}" data-gid="${esc(gid)}" data-kind="single" value="${i}"${checked}><span>${esc(opt)}</span></label>`;
    }).join('');
  } else if (q.type === 'truefalse') {
    const opts = lang === 'zh' ? ['对', '错'] : lang === 'id' ? ['Benar', 'Salah'] : ['True', 'False'];
    body = opts.map((opt, i) => {
      const val = i === 0;
      const checked = cur === val ? ' checked' : '';
      return `<label class="opt"><input type="radio" name="q_${gid}" data-gid="${esc(gid)}" data-kind="truefalse" value="${val ? '1' : '0'}"${checked}><span>${esc(opt)}</span></label>`;
    }).join('');
  } else if (q.type === 'fill') {
    const n = Math.max(1, (Array.isArray(cur) ? cur.length : 0) || (String(q.stem).match(/____/g) || []).length || 1);
    const arr = Array.isArray(cur) ? cur : [];
    body = Array.from({ length: n }, (_, i) =>
      `<input class="inp" data-gid="${esc(gid)}" data-kind="fill" data-blank="${i}" value="${esc(arr[i] || '')}" placeholder="${i + 1}">`
    ).join('');
  } else if (q.type === 'essay') {
    body = `<textarea class="textarea" rows="8" data-gid="${esc(gid)}" data-kind="essay" placeholder="">${esc(cur || '')}</textarea>`;
  } else if (q.type === 'dictation') {
    body = `<textarea class="textarea" rows="5" data-gid="${esc(gid)}" data-kind="dictation" placeholder="">${esc(cur || '')}</textarea>`;
  } else {
    body = `<input class="inp" data-gid="${esc(gid)}" data-kind="text" value="${esc(cur || '')}">`;
  }

  return `<div class="q-card" data-qid="${esc(gid)}">
    <div class="q-head"><span class="q-no">${no}</span><span class="q-score">${q.score} ${lang === 'zh' ? '分' : 'pts'}</span></div>
    <div class="q-stem">${esc(q.stem)}</div>
    <div class="q-body">${body}</div>
  </div>`;
}

export function collectAnswers(root) {
  const answers = {};
  if (!root) return answers;
  root.querySelectorAll('[data-kind="single"]:checked').forEach((el) => {
    answers[el.dataset.gid] = +el.value;
  });
  root.querySelectorAll('[data-kind="truefalse"]:checked').forEach((el) => {
    answers[el.dataset.gid] = el.value === '1';
  });
  root.querySelectorAll('[data-kind="fill"]').forEach((el) => {
    const gid = el.dataset.gid;
    const bi = +el.dataset.blank;
    if (!Array.isArray(answers[gid])) answers[gid] = [];
    answers[gid][bi] = el.value;
  });
  root.querySelectorAll('[data-kind="essay"],[data-kind="dictation"],[data-kind="text"]').forEach((el) => {
    answers[el.dataset.gid] = el.value;
  });
  return answers;
}

export function installProctor(onFlag) {
  if (window.__mmsProctor) return;
  window.__mmsProctor = true;
  const flag = () => { if (typeof onFlag === 'function') onFlag(); };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flag();
  });
  window.addEventListener('blur', flag);
}
