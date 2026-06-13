/* 神学生内部考试 — 共享模块 */
'use strict';

export const SUPABASE_URL = 'https://szjduusewnjxacrbbsdf.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6amR1dXNld25qeGFjcmJic2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjMxNjEsImV4cCI6MjA5MDQzOTE2MX0.7Cg_uOp2Q2wtKaZqVnYdMLvnZJEyh6GyE26xXb-UTBw';

export const SESSION_KEY = 'mms_student_exam_token_v1';
export const LANG_KEY = 'mms_student_exam_lang_v1';
export const COVER_CONFIRMED_KEY = 'mms_student_exam_cover_v1';

export function coverConfirmedStorageKey(examDayId, token) {
  return `${examDayId || ''}:${token || ''}`;
}

export function isCoverConfirmed(examDayId, token) {
  if (!examDayId || !token) return false;
  try {
    const raw = localStorage.getItem(COVER_CONFIRMED_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return data?.key === coverConfirmedStorageKey(examDayId, token);
  } catch {
    return false;
  }
}

export function setCoverConfirmed(examDayId, token) {
  if (!examDayId || !token) return;
  localStorage.setItem(COVER_CONFIRMED_KEY, JSON.stringify({
    key: coverConfirmedStorageKey(examDayId, token),
  }));
}

export function clearCoverConfirmed() {
  localStorage.removeItem(COVER_CONFIRMED_KEY);
}

export function createSb() {
  if (typeof supabase === 'undefined') return null;
  return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const UI = {
  zh: {
    site: '美村宣教学院 · 内部考试',
    checkin_title: '今日考试签到',
    checkin_hint: '请填写姓名，选择年级与答卷语言。今日只需签到一次。',
    full_name: '姓名',
    grade: '年级',
    grade1: '一年级', grade2: '二年级', grade3: '三年级',
    class_track: '试卷语言',
    track_zh: '中文',
    track_en: '英文',
    track_id: '印尼语',
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
    cover_hint: '今日只需确认一次。确认后将进入所选科目；其他科目不再重复确认。',
    cover_entering: '即将进入',
    cover_name: '姓名',
    cover_confirm: '确认无误，开始答题',
    btn_edit_checkin: '修改签到信息',
    btn_save_checkin: '保存修改',
    btn_cancel_edit: '返回科目列表',
    checkin_edit_hint: '尚未开始任何科目时可修改姓名、年级与试卷语言。保存后返回科目列表。',
    checkin_saved: '签到信息已更新',
    err_check_in_locked: '已有科目开始或交卷，无法修改试卷语言',
    submit: '交卷',
    submitted_ok: '答卷已提交，谢谢！',
    timer: '剩余时间',
    timer_10m: '距离自动交卷还剩约 10 分钟，请抓紧完成并检查答案。',
    proctor_warn: '检测到切屏（已记录）',
    no_exam: '今日暂无安排的考试，请联系教务。',
    err: '操作失败，请重试',
    loading: '加载中…',
    back_schedule: '返回日程',
  },
  en: {
    site: 'MMS · Internal Exam',
    checkin_title: 'Check-in for today',
    checkin_hint: 'Enter your name, grade, and exam language. Check in once per day.',
    full_name: 'Full name',
    grade: 'Year',
    grade1: 'Year 1', grade2: 'Year 2', grade3: 'Year 3',
    class_track: 'Exam paper language',
    track_zh: 'Chinese',
    track_en: 'English',
    track_id: 'Indonesian',
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
    cover_hint: 'Confirm once today. After this you can enter each subject without repeating.',
    cover_entering: 'Entering',
    cover_name: 'Name',
    cover_confirm: 'Confirm & start',
    btn_edit_checkin: 'Edit check-in',
    btn_save_checkin: 'Save changes',
    btn_cancel_edit: 'Back to schedule',
    checkin_edit_hint: 'You may edit name, year, and paper language before starting any subject.',
    checkin_saved: 'Check-in updated',
    err_check_in_locked: 'Cannot change paper language after a subject has started or been submitted',
    submit: 'Submit',
    submitted_ok: 'Submitted. Thank you!',
    timer: 'Time left',
    timer_10m: 'About 10 minutes left before auto-submit. Please finish and review your answers.',
    proctor_warn: 'Tab switch recorded',
    no_exam: 'No exam scheduled today.',
    err: 'Something went wrong',
    loading: 'Loading…',
    back_schedule: 'Back to schedule',
  },
  id: {
    site: 'MMS · Ujian Internal',
    checkin_title: 'Check-in hari ini',
    checkin_hint: 'Isi nama, angkatan, dan bahasa ujian. Cukup sekali per hari.',
    full_name: 'Nama lengkap',
    grade: 'Angkatan',
    grade1: 'Tahun 1', grade2: 'Tahun 2', grade3: 'Tahun 3',
    class_track: 'Bahasa kertas ujian',
    track_zh: 'Bahasa Cina',
    track_en: 'Bahasa Inggris',
    track_id: 'Bahasa Indonesia',
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
    cover_hint: 'Cukup konfirmasi sekali hari ini. Mata kuliah lain tidak perlu konfirmasi ulang.',
    cover_entering: 'Akan masuk',
    cover_name: 'Nama',
    cover_confirm: 'Konfirmasi & mulai',
    btn_edit_checkin: 'Ubah check-in',
    btn_save_checkin: 'Simpan perubahan',
    btn_cancel_edit: 'Kembali ke jadwal',
    checkin_edit_hint: 'Sebelum mulai mata kuliah apa pun, Anda dapat mengubah nama, angkatan, dan bahasa kertas ujian.',
    checkin_saved: 'Check-in diperbarui',
    err_check_in_locked: 'Tidak dapat mengubah bahasa setelah ada mata kuliah yang dimulai atau dikumpulkan',
    submit: 'Kumpulkan',
    submitted_ok: 'Terkirim. Terima kasih!',
    timer: 'Sisa waktu',
    timer_10m: 'Sekitar 10 menit lagi ujian akan dikumpulkan otomatis. Selesaikan dan periksa jawaban Anda.',
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

/** 课程卷名三语（与答卷语言 exam_lang 一致，非界面语言切换） */
export const COURSE_TITLE_LOCALES = {
  希伯来书: { zh: '希伯来书', en: 'Hebrews', id: 'Ibrani' },
  诗篇: { zh: '诗篇', en: 'Psalms', id: 'Mazmur' },
  启示录: { zh: '启示录', en: 'Revelation', id: 'Wahyu' },
  撒母耳记: { zh: '撒母耳记', en: 'Samuel', id: 'Samuel' },
  HEB: { zh: '希伯来书', en: 'Hebrews', id: 'Ibrani' },
  'HEB-S': { zh: '希伯来书', en: 'Hebrews', id: 'Ibrani' },
  PSA: { zh: '诗篇', en: 'Psalms', id: 'Mazmur' },
  REV: { zh: '启示录', en: 'Revelation', id: 'Wahyu' },
  SAM: { zh: '撒母耳记', en: 'Samuel', id: 'Samuel' },
};

function normPaperLang(lang) {
  return ['zh', 'en', 'id'].includes(lang) ? lang : 'zh';
}

function stripYearSuffix(title) {
  return String(title || '').replace(/\s+\d{4}-\d{4}\s*$/, '').trim();
}

function stripPaperTitleSuffix(title) {
  return stripYearSuffix(title).replace(/[（(]简单版[)）]\s*$/, '').trim();
}

/** 由课程名 / 课程代码推断 title_locales */
export function inferTitleLocales(title, courseCode) {
  const base = stripPaperTitleSuffix(title);
  const code = String(courseCode || '').trim().toUpperCase();
  if (code === 'HEB-S') return { ...COURSE_TITLE_LOCALES.HEB };
  if (COURSE_TITLE_LOCALES[code]) return { ...COURSE_TITLE_LOCALES[code] };
  if (COURSE_TITLE_LOCALES[base]) return { ...COURSE_TITLE_LOCALES[base] };
  if (base.startsWith('希伯来书')) return { ...COURSE_TITLE_LOCALES.HEB };
  for (const locs of Object.values(COURSE_TITLE_LOCALES)) {
    if (Object.values(locs).some((v) => v === base)) return { ...locs };
  }
  return { zh: base };
}

/**
 * 学生端卷名：跟随答卷语言（英文班→英文卷名，印尼语班→印尼语卷名）
 * meta: { paper_title?, title?, subject_name?, title_locales?, course_code?, exam_lang? }
 */
export function resolvePaperDisplayTitle(meta, lang = 'zh') {
  const L = normPaperLang(lang);
  const m = typeof meta === 'string' ? { title: meta } : (meta || {});
  const loc = m.title_locales && typeof m.title_locales === 'object' ? m.title_locales : null;
  if (loc?.[L]) return loc[L];
  if (m.paper_title && m.exam_lang === L) return stripYearSuffix(m.paper_title);
  const raw = stripYearSuffix(m.paper_title || m.title || m.subject_name || '');
  if (!raw) return '';
  const inferred = inferTitleLocales(raw, m.course_code);
  return inferred[L] || inferred.zh || raw;
}

/** @deprecated 使用 resolvePaperDisplayTitle */
export function studentPaperTitle(title, lang = 'zh') {
  return resolvePaperDisplayTitle({ title }, lang);
}

export function examContentLang(checkIn, paper) {
  return paper?.exam_lang || checkIn?.exam_lang || 'zh';
}

/** 教师端卷名：科目 + 年级（如「希伯来书-一年级」） */
export function teacherPaperTitle(title, grade, lang = 'zh') {
  const base = resolvePaperDisplayTitle({ title }, lang);
  if (!grade) return base;
  return `${base}-${gradeLabel(grade, lang)}`;
}

const PAPER_LOCALE_LABELS = { zh: '中文', en: '英文', id: '印尼语' };
const PAPER_LOCALE_ORDER = ['zh', 'en', 'id'];

/** 从 snapshot_json 检测已入库的答卷语言（有题干即算具备） */
export function paperLocaleCodes(paper) {
  const snap = paper?.snapshot_json;
  const found = new Set();
  if (Array.isArray(snap)) {
    for (const q of snap) {
      const loc = q?.locales;
      if (!loc || typeof loc !== 'object') continue;
      for (const code of PAPER_LOCALE_ORDER) {
        if (loc[code]?.stem) found.add(code);
      }
    }
  }
  if (found.size) return PAPER_LOCALE_ORDER.filter((c) => found.has(c));
  const tl = paper?.title_locales;
  if (tl && typeof tl === 'object') {
    return PAPER_LOCALE_ORDER.filter((c) => tl[c]);
  }
  return ['zh'];
}

/** 如「中文 · 印尼语」 */
export function paperLocaleSummary(paper) {
  return paperLocaleCodes(paper).map((c) => PAPER_LOCALE_LABELS[c] || c).join(' · ');
}

/** 教师端语言版本徽章 HTML */
export function paperLocaleBadgesHtml(paper) {
  const codes = new Set(paperLocaleCodes(paper));
  return PAPER_LOCALE_ORDER.map((code) => {
    const on = codes.has(code);
    const cls = on ? 'lang-on' : 'lang-off';
    const title = on ? `已含${PAPER_LOCALE_LABELS[code]}题干` : `未含${PAPER_LOCALE_LABELS[code]}`;
    return `<span class="lang-tag ${cls}" title="${title}">${PAPER_LOCALE_LABELS[code]}</span>`;
  }).join('');
}

export function trackLabel(track, lang) {
  const key = { zh: 'track_zh', en: 'track_en', id: 'track_id', zh_en: 'track_zh' }[track] || 'track_zh';
  return t(lang, key);
}

export function classTrackOptions(lang) {
  return [
    { v: 'zh', l: t(lang, 'track_zh') },
    { v: 'en', l: t(lang, 'track_en') },
    { v: 'id', l: t(lang, 'track_id') },
  ];
}

/** 答卷语言与班级一致 */
export function examLangForTrack(track) {
  const n = track === 'zh_en' ? 'zh' : track;
  return ['zh', 'en', 'id'].includes(n) ? n : 'zh';
}

export function displaySectionLabel(raw, lang = 'zh') {
  if (!raw) return '';
  if (lang !== 'zh') return String(raw).trim();
  const s = String(raw).replace(/^[一二三四五六七八九十]+、\s*/, '');
  const name = s.replace(/（.*$/, '').trim();
  const parenM = s.match(/（([^）]*)）/);
  if (!parenM) return name || s;
  const parts = parenM[1].split(/[，,]/).map((p) => p.trim())
    .filter((p) => /每[题空][0-9.]+\s*分/.test(p) || /^共/.test(p));
  if (parts.length) return `${name}（${parts.join('，')}）`;
  return name;
}

export function renderExamWithSections(questions, answers, lang) {
  let html = '';
  let lastLabel = '';
  for (const q of questions || []) {
    const label = displaySectionLabel(q.section_label || '', lang);
    if (label && label !== lastLabel) {
      const sec = q.section || '';
      const cls = sec === '五' ? 'sec-head sec-long' : sec === '四' ? 'sec-head sec-short' : 'sec-head';
      html += `<div class="${cls}">${esc(label)}</div>`;
      lastLabel = label;
    }
    html += renderQuestionHtml(q, answers, lang);
  }
  return html;
}

/** 简答/论述答题框：按分值与题型给足书写空间（如 25 分、300–500 字卷） */
export function essayTextareaSpec(q) {
  const score = Number(q?.score) || 0;
  const kind = q?.essay_kind || 'short';
  if (kind === 'long') return { rows: 18, sizeCls: 'essay-lg' };
  if (score >= 20) return { rows: 16, sizeCls: 'essay-xl' };
  if (score >= 10) return { rows: 12, sizeCls: 'essay-md' };
  return { rows: 6, sizeCls: 'essay-sm' };
}

/** 简答字数：中文按字符（不计空白），英/印尼语按词 */
export function essayCountUnits(text, lang = 'zh') {
  const s = String(text || '');
  if (lang === 'zh') return s.replace(/\s/g, '').length;
  const words = s.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function parseEssayLengthHint(sectionLabel, lang = 'zh') {
  const lbl = String(sectionLabel || '');
  let m = lbl.match(/(\d+)\s*[–\-]\s*(\d+)\s*字/);
  if (m) return { min: +m[1], max: +m[2], unit: 'char' };
  m = lbl.match(/(\d+)\s*[–\-]\s*(\d+)\s*kata/i);
  if (m) return { min: +m[1], max: +m[2], unit: 'word' };
  m = lbl.match(/(\d+)\s*[–\-]\s*(\d+)\s*(?:words?|characters?)/i);
  if (m) return { min: +m[1], max: +m[2], unit: lang === 'zh' ? 'char' : 'word' };
  return null;
}

export function formatEssayCountLabel(count, lang = 'zh', hint = null) {
  const L = ['zh', 'en', 'id'].includes(lang) ? lang : 'zh';
  const range = hint ? ` / ${hint.min}–${hint.max}` : '';
  if (L === 'zh') return `已写 ${count}${range} 字`;
  if (L === 'id') return `${count}${range} kata`;
  return `${count}${range} words`;
}

function essayCountUnitLabel(lang, hint) {
  const L = ['zh', 'en', 'id'].includes(lang) ? lang : 'zh';
  if (!hint) return '';
  if (L === 'zh') return `${hint.min}–${hint.max} 字`;
  if (L === 'id') return `${hint.min}–${hint.max} kata`;
  return `${hint.min}–${hint.max} words`;
}

function essayCountTipLabel(lang) {
  const L = ['zh', 'en', 'id'].includes(lang) ? lang : 'zh';
  if (L === 'zh') return '字数偏少';
  if (L === 'id') return 'Terlalu sedikit';
  return 'Below suggested length';
}

function essayCountWrittenLabel(count, lang) {
  const L = ['zh', 'en', 'id'].includes(lang) ? lang : 'zh';
  if (L === 'zh') return `已写 <span class="essay-count-n">${count}</span>`;
  if (L === 'id') return `<span class="essay-count-n">${count}</span> kata`;
  return `<span class="essay-count-n">${count}</span> words`;
}

function updateEssayCounter(ta, lang) {
  const hint = parseEssayLengthHint(ta.dataset.sectionLabel || '', lang);
  const n = essayCountUnits(ta.value, lang);
  const el = ta.parentElement?.querySelector('.essay-count');
  if (!el) return;
  el.classList.remove('essay-count-ok', 'essay-count-low');
  if (!hint) {
    el.textContent = formatEssayCountLabel(n, lang, null);
    return;
  }
  const state = n > 0 && n < hint.min ? 'low' : (n >= hint.min ? 'ok' : 'neutral');
  if (state === 'low') el.classList.add('essay-count-low');
  if (state === 'ok') el.classList.add('essay-count-ok');
  const req = esc(essayCountUnitLabel(lang, hint));
  const written = essayCountWrittenLabel(n, lang);
  const tip = state === 'low'
    ? `<span class="essay-count-tip">${esc(essayCountTipLabel(lang))}</span> `
    : '';
  el.innerHTML = `${tip}${written} / <span class="essay-count-req">${req}</span>`;
}

/** 绑定简答题字数统计（考试页 render 后调用） */
export function installEssayCounters(root, lang = 'zh') {
  if (!root) return;
  root.querySelectorAll('textarea[data-kind="essay"]').forEach((ta) => {
    if (ta.dataset.countBound === '1') {
      updateEssayCounter(ta, lang);
      return;
    }
    ta.dataset.countBound = '1';
    ta.addEventListener('input', () => updateEssayCounter(ta, lang));
    updateEssayCounter(ta, lang);
  });
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
    const { rows, sizeCls } = essayTextareaSpec(q);
    const secLbl = esc(q.section_label || '');
    body = `<div class="essay-wrap">
      <textarea class="textarea essay-area ${sizeCls}" rows="${rows}" data-gid="${esc(gid)}" data-kind="essay" data-section-label="${secLbl}" placeholder="">${esc(cur || '')}</textarea>
      <div class="essay-count" aria-live="polite"></div>
    </div>`;
  } else if (q.type === 'dictation') {
    body = `<textarea class="textarea" rows="5" data-gid="${esc(gid)}" data-kind="dictation" placeholder="">${esc(cur || '')}</textarea>`;
  } else {
    body = `<input class="inp" data-gid="${esc(gid)}" data-kind="text" value="${esc(cur || '')}">`;
  }

  const qcls = q.type === 'essay' ? ` q-card essay-${q.essay_kind || 'short'}` : ' q-card';
  return `<div class="${qcls.trim()}" data-qid="${esc(gid)}">
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
