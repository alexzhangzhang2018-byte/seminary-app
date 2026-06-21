/* 神学生内部考试 — 共享模块 */
'use strict';

export const SUPABASE_URL = 'https://szjduusewnjxacrbbsdf.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6amR1dXNld25qeGFjcmJic2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NjMxNjEsImV4cCI6MjA5MDQzOTE2MX0.7Cg_uOp2Q2wtKaZqVnYdMLvnZJEyh6GyE26xXb-UTBw';

export const SESSION_KEY = 'mms_student_exam_token_v1';
export const LANG_KEY = 'mms_student_exam_lang_v1';
export const COVER_CONFIRMED_KEY = 'mms_student_exam_cover_v1';
export const EXAM_DAY_CACHE_KEY = 'mms_student_exam_day_cache_v1';

/** 数据库繁忙时的应急考试日（按雅加达日期 YYYY-MM-DD） */
export const EXAM_DAY_EMERGENCY = {
  '2026-06-15': {
    id: 'c49167a4-9cdc-45b1-b297-9725648f8e22',
    title: 'MMS2026春季期末考试',
    exam_date: '2026-06-15',
    timezone: 'Asia/Jakarta',
    status: 'active',
  },
  '2026-06-20': {
    id: 'c49167a4-9cdc-45b1-b297-9725648f8e22',
    title: 'MMS2026春季期末考试',
    exam_date: '2026-06-15',
    timezone: 'Asia/Jakarta',
    status: 'active',
  },
  '2026-06-21': {
    id: 'c49167a4-9cdc-45b1-b297-9725648f8e22',
    title: 'MMS2026春季期末考试',
    exam_date: '2026-06-15',
    timezone: 'Asia/Jakarta',
    status: 'active',
  },
  // 补考日（6/22 起）：独立考试日「MMS期末补考」，含出埃及记及以下科目
  '2026-06-22': {
    id: 'e8f3a1b2-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
    title: 'MMS期末补考',
    exam_date: '2026-06-22',
    timezone: 'Asia/Jakarta',
    status: 'active',
  },
  '2026-06-23': {
    id: 'e8f3a1b2-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
    title: 'MMS期末补考',
    exam_date: '2026-06-22',
    timezone: 'Asia/Jakarta',
    status: 'active',
  },
  '2026-06-24': {
    id: 'e8f3a1b2-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
    title: 'MMS期末补考',
    exam_date: '2026-06-22',
    timezone: 'Asia/Jakarta',
    status: 'active',
  },
  '2026-06-25': {
    id: 'e8f3a1b2-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
    title: 'MMS期末补考',
    exam_date: '2026-06-22',
    timezone: 'Asia/Jakarta',
    status: 'active',
  },
  '2026-06-26': {
    id: 'e8f3a1b2-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
    title: 'MMS期末补考',
    exam_date: '2026-06-22',
    timezone: 'Asia/Jakarta',
    status: 'active',
  },
  '2026-06-27': {
    id: 'e8f3a1b2-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
    title: 'MMS期末补考',
    exam_date: '2026-06-22',
    timezone: 'Asia/Jakarta',
    status: 'active',
  },
  '2026-06-28': {
    id: 'e8f3a1b2-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
    title: 'MMS期末补考',
    exam_date: '2026-06-22',
    timezone: 'Asia/Jakarta',
    status: 'active',
  },
  '2026-06-29': {
    id: 'e8f3a1b2-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
    title: 'MMS期末补考',
    exam_date: '2026-06-22',
    timezone: 'Asia/Jakarta',
    status: 'active',
  },
  '2026-06-30': {
    id: 'e8f3a1b2-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
    title: 'MMS期末补考',
    exam_date: '2026-06-22',
    timezone: 'Asia/Jakarta',
    status: 'active',
  },
};

/** 春季期末 / 补考考试日（预演可用 ?exam=spring 或 ?exam=makeup 切换） */
export const EXAM_DAY_SPRING = {
  id: 'c49167a4-9cdc-45b1-b297-9725648f8e22',
  title: 'MMS2026春季期末考试',
  exam_date: '2026-06-15',
  timezone: 'Asia/Jakarta',
  status: 'active',
};
export const EXAM_DAY_MAKEUP = {
  id: 'e8f3a1b2-4c5d-6e7f-8a9b-0c1d2e3f4a5b',
  title: 'MMS期末补考',
  exam_date: '2026-06-22',
  timezone: 'Asia/Jakarta',
  status: 'active',
};

export function examDayFromQuery() {
  try {
    const q = new URLSearchParams(location.search).get('exam');
    if (q === 'spring') return EXAM_DAY_SPRING;
    if (q === 'makeup') return EXAM_DAY_MAKEUP;
  } catch (_) {}
  return null;
}

export function jakartaTodayYmd() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
}

/** 补考科目：进入后独立计时（duration_minutes），非固定开考时刻 */
export function isFlexMakeupSubject(sub) {
  return Number(sub?.duration_minutes) > 0 && !!sub?.makeup_open;
}

/** 是否出现在补考列表（缺考且开放补考；正考已交卷的不显示） */
export function isMakeupShowSubject(sub) {
  if (sub?.makeup_show != null) return !!sub.makeup_show;
  if (!isFlexMakeupSubject(sub)) return false;
  if (sub.attempt_status === 'submitted' && sub.submitted_at && sub.start_at) {
    return new Date(sub.submitted_at) >= new Date(sub.start_at);
  }
  return sub.attempt_status !== 'submitted';
}

export function getMakeupSchedule(schedule) {
  return (schedule || [])
    .filter(isMakeupShowSubject)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export function isInMakeupSession(schedule) {
  return getMakeupSchedule(schedule).length > 0;
}

/** 补考/正考：计算本场答题截止时间（补考绝不用窗口 end_at 当倒计时） */
export function resolveExamDeadlineIso(subject, attempt) {
  if (attempt?.exam_deadline_at) return attempt.exam_deadline_at;
  if (isFlexMakeupSubject(subject)) {
    const mins = Number(subject.duration_minutes) || 60;
    const base = attempt?.started_at || attempt?.created_at;
    if (base) {
      return new Date(new Date(base).getTime() + mins * 60 * 1000).toISOString();
    }
    return new Date(Date.now() + mins * 60 * 1000).toISOString();
  }
  return subject?.end_at || null;
}

export function examTimerSeconds(subject, attempt) {
  const deadlineAt = resolveExamDeadlineIso(subject, attempt);
  if (!deadlineAt) return 0;
  return Math.max(0, Math.floor((new Date(deadlineAt).getTime() - Date.now()) / 1000));
}

/** ready=可开始 active=答题中 locked=等待上一科 done=已交卷 */
export function getMakeupSubjectState(queue, sub) {
  if (sub.attempt_status === 'submitted') return 'done';
  if (sub.attempt_status === 'in_progress') return 'active';
  const inProg = queue.find((s) => s.attempt_status === 'in_progress');
  if (inProg) return 'locked';
  const firstPending = queue.find((s) => s.attempt_status !== 'submitted');
  return sub.id === firstPending?.id ? 'ready' : 'locked';
}

export function saveExamDayCache(examDay) {
  if (!examDay?.id) return;
  try {
    localStorage.setItem(EXAM_DAY_CACHE_KEY, JSON.stringify({ ts: Date.now(), exam_day: examDay }));
  } catch (_) {}
}

export function loadExamDayCache(expectedDate) {
  try {
    const raw = localStorage.getItem(EXAM_DAY_CACHE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    const d = o?.exam_day;
    if (!d?.id) return null;
    if (expectedDate && String(d.exam_date) !== String(expectedDate)) return null;
    return d;
  } catch (_) {
    return null;
  }
}

/** 直连 Supabase RPC（带 Abort 超时，不依赖 supabase-js 内部队列） */
export async function rpcDirect(fn, body = {}, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (_) {}
    if (!res.ok) {
      const err = new Error(data?.message || data?.error || `HTTP ${res.status}`);
      err.httpStatus = res.status;
      throw err;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}

/** 带重试的 RPC（高峰时段用直连 fetch，避免 supabase-js 内部排队） */
export async function rpcCall(fn, body = {}, { timeoutMs = 12000, tries = 3, delayMs = 1200 } = {}) {
  let lastErr = null;
  for (let i = 0; i < tries; i++) {
    try {
      const data = await rpcDirect(fn, body, timeoutMs);
      return { data, error: null };
    } catch (e) {
      lastErr = e;
      if (i < tries - 1) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  return { data: null, error: lastErr };
}

/** 科目列表里是否还有可进行的考试（补考开放 / 时段内 / 答题中） */
export function scheduleHasActionableExam(schedule) {
  if (isInMakeupSession(schedule)) {
    const queue = getMakeupSchedule(schedule);
    return queue.some((s) => {
      const st = getMakeupSubjectState(queue, s);
      return st === 'active' || st === 'ready';
    });
  }
  return (schedule || []).some((s) =>
    s.needs_makeup ||
    s.window_status === 'open' ||
    s.attempt_status === 'in_progress'
  );
}

export async function resolveExamDay() {
  const today = jakartaTodayYmd();
  const fallback = loadExamDayCache(today) || EXAM_DAY_EMERGENCY[today];

  const tryRpc = async (timeoutMs) => {
    const data = await rpcDirect('student_exam_get_today', {}, timeoutMs);
    if (data?.ok && data.exam_day) {
      saveExamDayCache(data.exam_day);
      return data.exam_day;
    }
    if (data?.ok === false && data?.error === 'no_exam_today') return null;
    throw new Error('student_exam_get_today bad response');
  };

  const firstTimeout = fallback ? 3000 : 6000;
  try {
    const examDay = await tryRpc(firstTimeout);
    if (examDay) return { examDay, fromFallback: false };
  } catch (e) {
    console.warn('resolveExamDay attempt 1', e);
    if (fallback) return { examDay: fallback, fromFallback: true };
  }

  if (fallback) return { examDay: fallback, fromFallback: false };

  try {
    const examDay = await tryRpc(8000);
    if (examDay) return { examDay, fromFallback: false };
  } catch (e) {
    console.warn('resolveExamDay attempt 2', e);
  }
  return { examDay: null, fromFallback: false };
}

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
  const timedFetch = (url, options = {}) => {
    const ctrl = new AbortController();
    const ms = Number(options.__timeoutMs) > 0 ? Number(options.__timeoutMs) : 28000;
    const { __timeoutMs, ...rest } = options;
    const timer = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { ...rest, signal: ctrl.signal }).finally(() => clearTimeout(timer));
  };
  return supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { fetch: timedFetch },
  });
}

export function withTimeout(promise, ms = 28000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), ms);
    }),
  ]);
}

export const UI = {
  zh: {
    site: '美村宣教学院 · 内部考试',
    checkin_title: '今日考试签到',
    checkin_hint: '请填写姓名，选择年级与班级轨道。今日只需签到一次。',
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
    schedule_makeup_title: '补考安排',
    schedule_makeup_hint: '请按顺序逐科补考：交卷后下一科才会解锁。答题中请勿关闭页面，须交卷后才能考下一科。',
    schedule_makeup_all_done: '本轮补考科目已全部交卷。如有下一科待开放，交卷后会自动出现在列表中。',
    makeup_short: '补考',
    makeup_label: '补考 · 限时 {min} 分钟',
    makeup_locked: '请先完成上一科',
    btn_start_makeup: '开始考试',
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
    pause_exam: '稍后继续',
    submitted_ok: '答卷已提交，谢谢！',
    timer: '剩余时间',
    timer_10m: '距离自动交卷还剩约 10 分钟，请抓紧完成并检查答案。',
    proctor_warn: '检测到切屏（已记录）',
    no_exam: '目前没有考试安排。',
    err: '操作失败，请重试',
    err_checkin_server: '签到服务繁忙，请稍等几秒再试；若仍失败请联系教务',
    err_submit: '交卷失败，正在重试…',
    err_submit_fail: '交卷未完成，请稍等片刻再点「再次交卷」，勿连续点击',
    err_submit_network: '网络繁忙，系统已自动重试；请稍等，勿重复点击',
    err_window_closed: '考试已结束过久，请联系教务协助交卷',
    err_makeup_in_progress: '请先完成当前正在补考的科目',
    err_makeup_wait_previous: '请按顺序补考，先完成上一科',
    err_not_on_makeup_roster: '您不在本次补考名单内，如有疑问请联系教务',
    err_subject_not_allowed: '该科目不在您的补考安排中',
    err_submitting: '正在提交答卷，请勿重复点击…',
    submitting_progress: '正在交卷（第 {n}/{total} 次）…',
    submit_busy: '正在交卷中，请勿重复点击',
    submit_cooldown: '{s} 秒后可再试',
    submit_checking: '正在确认是否已交卷…',
    btn_submit_retry: '再次交卷',
    loading: '加载中…',
    loading_slow: '服务器繁忙，请稍候或点击下方重新加载',
    btn_retry_load: '重新加载',
    err_load_fail: '无法连接考试服务器，请检查网络后重试',
    err_load_offline: '服务器繁忙，已使用离线考试日信息，请继续签到',
    back_schedule: '返回日程',
  },
  en: {
    site: 'MMS · Internal Exam',
    checkin_title: 'Check-in for today',
    checkin_hint: 'Enter your name, grade, and class track. Check in once per day.',
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
    schedule_makeup_title: 'Make-up exams',
    schedule_makeup_hint: 'Complete subjects in order. The next subject unlocks after you submit. Do not close the page during an exam.',
    makeup_short: 'Makeup',
    makeup_label: 'Makeup · {min} min limit',
    makeup_locked: 'Finish the previous subject first',
    btn_start_makeup: 'Start exam',
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
    pause_exam: 'Continue later',
    submitted_ok: 'Submitted. Thank you!',
    timer: 'Time left',
    timer_10m: 'About 10 minutes left before auto-submit. Please finish and review your answers.',
    proctor_warn: 'Tab switch recorded',
    no_exam: 'No exam is scheduled at this time.',
    err: 'Something went wrong',
    err_checkin_server: 'Check-in busy. Wait a few seconds and retry, or contact the office.',
    err_submit: 'Submit failed, retrying…',
    err_submit_fail: 'Not submitted yet. Wait a moment, then tap Submit again once.',
    err_submit_network: 'Network busy; auto-retrying. Please wait, do not tap repeatedly.',
    err_window_closed: 'Exam window closed. Please contact the office.',
    err_makeup_in_progress: 'Please finish your current make-up exam first.',
    err_makeup_wait_previous: 'Complete subjects in order. Finish the previous one first.',
    err_not_on_makeup_roster: 'You are not on today\'s make-up roster. Contact the office if this is a mistake.',
    err_subject_not_allowed: 'This subject is not on your make-up schedule.',
    err_submitting: 'Submitting… Please do not tap again.',
    submitting_progress: 'Submitting ({n}/{total})…',
    submit_busy: 'Submit in progress. Please wait.',
    submit_cooldown: 'Retry in {s}s',
    submit_checking: 'Checking if already submitted…',
    btn_submit_retry: 'Submit again',
    loading: 'Loading…',
    loading_slow: 'Server busy. Please wait or tap Reload below.',
    btn_retry_load: 'Reload',
    err_load_fail: 'Cannot reach exam server. Check network and retry.',
    back_schedule: 'Back to schedule',
  },
  id: {
    site: 'MMS · Ujian Internal',
    checkin_title: 'Check-in hari ini',
    checkin_hint: 'Isi nama, angkatan, dan jalur kelas. Cukup sekali per hari.',
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
    schedule_makeup_title: 'Jadwal susulan',
    schedule_makeup_hint: 'Kerjakan mata kuliah berurutan. Mata kuliah berikutnya terbuka setelah Anda mengirim jawaban.',
    makeup_short: 'Susulan',
    makeup_label: 'Susulan · {min} menit',
    makeup_locked: 'Selesaikan mata kuliah sebelumnya dulu',
    btn_start_makeup: 'Mulai ujian',
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
    pause_exam: 'Lanjut nanti',
    submitted_ok: 'Terkirim. Terima kasih!',
    timer: 'Sisa waktu',
    timer_10m: 'Sekitar 10 menit lagi ujian akan dikumpulkan otomatis. Selesaikan dan periksa jawaban Anda.',
    proctor_warn: 'Pindah tab tercatat',
    no_exam: 'Saat ini tidak ada jadwal ujian.',
    err: 'Gagal',
    err_checkin_server: 'Check-in sibuk. Tunggu beberapa detik lalu coba lagi.',
    err_submit: 'Gagal mengumpulkan, mencoba lagi…',
    err_submit_fail: 'Belum terkirim. Tunggu sebentar, lalu tekan Kumpulkan sekali lagi.',
    err_submit_network: 'Jaringan sibuk; mencoba otomatis. Tunggu, jangan tekan berulang.',
    err_window_closed: 'Waktu ujian sudah lewat. Hubungi kantor.',
    err_makeup_in_progress: 'Selesaikan ujian susulan yang sedang berjalan terlebih dahulu.',
    err_makeup_wait_previous: 'Kerjakan berurutan. Selesaikan mata kuliah sebelumnya dulu.',
    err_not_on_makeup_roster: 'Anda tidak ada dalam daftar ujian susulan hari ini. Hubungi kantor jika ada kesalahan.',
    err_subject_not_allowed: 'Mata kuliah ini tidak termasuk jadwal ujian susulan Anda.',
    err_submitting: 'Mengirim… Jangan tekan berulang.',
    submitting_progress: 'Mengirim ({n}/{total})…',
    submit_busy: 'Sedang mengirim. Harap tunggu.',
    submit_cooldown: 'Coba lagi dalam {s} dtk',
    submit_checking: 'Memeriksa status pengumpulan…',
    btn_submit_retry: 'Kumpulkan lagi',
    loading: 'Memuat…',
    loading_slow: 'Server sibuk. Tunggu atau tekan Muat ulang.',
    btn_retry_load: 'Muat ulang',
    err_load_fail: 'Tidak dapat terhubung ke server ujian. Periksa jaringan.',
    back_schedule: 'Kembali ke jadwal',
  },
};

export function t(lang, key) {
  const L = UI[lang] || UI.zh;
  return L[key] ?? UI.zh[key] ?? key;
}

export function tFmt(lang, key, vars = {}) {
  let s = t(lang, key);
  for (const [k, v] of Object.entries(vars)) {
    s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
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
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export function gradeLabel(g, lang) {
  return t(lang, `grade${g}`);
}

/** 课程卷名三语（日程/封面随界面语言；答卷内卷名随 exam_lang） */
export const COURSE_TITLE_LOCALES = {
  GEN: { zh: '创世记', en: 'Genesis', id: 'Kejadian' },
  EXO: { zh: '出埃及记', en: 'Exodus', id: 'Keluaran' },
  MRK: { zh: '马可福音', en: 'Mark', id: 'Markus' },
  JHN: { zh: '约翰福音', en: 'John', id: 'Yohanes' },
  ACT: { zh: '使徒行传', en: 'Acts', id: 'Kisah Para Rasul' },
  ROM: { zh: '罗马书', en: 'Romans', id: 'Roma' },
  HEB: { zh: '希伯来书', en: 'Hebrews', id: 'Ibrani' },
  'HEB-S': { zh: '希伯来书', en: 'Hebrews', id: 'Ibrani' },
  ISA: { zh: '以赛亚书', en: 'Isaiah', id: 'Yesaya' },
  NTS: { zh: '新约概论', en: 'New Testament Survey', id: 'Pengantar Perjanjian Baru' },
  OTS: { zh: '旧约概论', en: 'Old Testament Survey', id: 'Pengantar Perjanjian Lama' },
  PSA: { zh: '诗篇', en: 'Psalms', id: 'Mazmur' },
  REV: { zh: '启示录', en: 'Revelation', id: 'Wahyu' },
  SAM: { zh: '撒母耳记', en: 'Samuel', id: 'Samuel' },
  创世记: { zh: '创世记', en: 'Genesis', id: 'Kejadian' },
  出埃及记: { zh: '出埃及记', en: 'Exodus', id: 'Keluaran' },
  马可福音: { zh: '马可福音', en: 'Mark', id: 'Markus' },
  约翰福音: { zh: '约翰福音', en: 'John', id: 'Yohanes' },
  使徒行传: { zh: '使徒行传', en: 'Acts', id: 'Kisah Para Rasul' },
  罗马书: { zh: '罗马书', en: 'Romans', id: 'Roma' },
  希伯来书: { zh: '希伯来书', en: 'Hebrews', id: 'Ibrani' },
  以赛亚书: { zh: '以赛亚书', en: 'Isaiah', id: 'Yesaya' },
  新约概论: { zh: '新约概论', en: 'New Testament Survey', id: 'Pengantar Perjanjian Baru' },
  旧约概论: { zh: '旧约概论', en: 'Old Testament Survey', id: 'Pengantar Perjanjian Lama' },
  诗篇: { zh: '诗篇', en: 'Psalms', id: 'Mazmur' },
  启示录: { zh: '启示录', en: 'Revelation', id: 'Wahyu' },
  撒母耳记: { zh: '撒母耳记', en: 'Samuel', id: 'Samuel' },
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
 * 学生端科目/卷名显示
 * @param meta 含 subject_name、course_code、title_locales 等
 * @param lang 界面语言 uiLang，或答卷语言 exam_lang
 */
export function resolvePaperDisplayTitle(meta, lang = 'zh') {
  const L = normPaperLang(lang);
  const m = typeof meta === 'string' ? { title: meta } : (meta || {});
  const loc = m.title_locales && typeof m.title_locales === 'object' ? m.title_locales : null;
  if (loc?.[L]) return loc[L];
  const rawName = stripYearSuffix(m.subject_name || m.paper_title || m.title || '');
  const inferred = inferTitleLocales(rawName || m.subject_name || m.paper_title || m.title, m.course_code);
  if (inferred[L]) return inferred[L];
  if (m.paper_title && m.exam_lang === L) return stripYearSuffix(m.paper_title);
  return inferred.zh || rawName || '';
}

/** @deprecated 使用 resolvePaperDisplayTitle */
export function studentPaperTitle(title, lang = 'zh') {
  return resolvePaperDisplayTitle({ title }, lang);
}

export function examContentLang(checkIn, paper) {
  return paper?.exam_lang || checkIn?.exam_lang || 'zh';
}

/** 教师端卷名：保留版本标识，如「希伯来书-简单版-一年级」 */
export function teacherPaperTitle(title, grade, lang = 'zh') {
  let base = stripYearSuffix(title);
  base = base.replace(/[（(]简单版[)）]/, '-简单版');
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

const SECTION_RANK = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6 };
const ROMAN_SECTION_RANK = { I: 1, II: 2, III: 3, IV: 4, V: 5 };

/** 大题排序：优先罗马数字 I–V，其次中文 一–六 */
export function sectionOrderRank(q, lang = 'zh') {
  const labels = [
    q?.section_labels?.[lang],
    q?.section_label,
    q?.section_labels?.en,
    q?.section_labels?.zh,
    q?.section_labels?.id,
  ];
  for (const raw of labels) {
    if (!raw) continue;
    const roman = String(raw).trim().match(/^(I{1,3}|IV|V)\./i);
    if (roman) return ROMAN_SECTION_RANK[roman[1].toUpperCase()] ?? 99;
    const cn = String(raw).match(/^([一二三四五六])/);
    if (cn) return SECTION_RANK[cn[1]] ?? 99;
  }
  if (q?.section && SECTION_RANK[q.section]) return SECTION_RANK[q.section];
  return 99;
}

/** 按 I→IV / 一→五 排卷面，并重编号 1…n（仅影响展示与题号，group_id 不变） */
export function orderExamQuestions(questions, lang = 'zh') {
  return [...(questions || [])]
    .sort((a, b) => {
      const d = sectionOrderRank(a, lang) - sectionOrderRank(b, lang);
      return d !== 0 ? d : (a.sort_order ?? 0) - (b.sort_order ?? 0);
    })
    .map((q, idx) => ({ ...q, sort_order: idx + 1 }));
}

export function renderExamWithSections(questions, answers, lang) {
  let html = '';
  let lastLabel = '';
  for (const q of orderExamQuestions(questions, lang)) {
    const secRaw = q.section_labels?.[lang] || q.section_label || '';
    const label = displaySectionLabel(secRaw, lang);
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

export function questionFillMeta(q, lang) {
  const loc = questionLocale(q, lang);
  return {
    stem: loc.stem ?? q?.stem ?? '',
    blank_labels: loc.blank_labels || q?.blank_labels,
    blank_widths: loc.blank_widths || q?.blank_widths,
    fill_layout: loc.fill_layout || q?.fill_layout,
    table_headers: loc.table_headers || q?.table_headers,
    table_rows: loc.table_rows || q?.table_rows,
  };
}

export function fillBlankCount(q, stem = '', lang = 'zh') {
  const meta = questionFillMeta(q, lang);
  const stemStr = String(stem || meta.stem || '');
  const fromStem = (stemStr.match(/____/g) || []).length;
  if (fromStem > 0) return fromStem;
  const labels = meta.blank_labels;
  if (Array.isArray(labels) && labels.length) return labels.length;
  if (meta.fill_layout === 'table' && Array.isArray(meta.table_rows)) return meta.table_rows.length;
  const n = Number(q?.blank_count);
  if (n > 0) return n;
  const loc = questionLocale(q, lang);
  const fromKey = loc?.answer_key?.answers?.length || 0;
  return Math.max(1, fromKey || 1);
}

function inlineBlankWidthCh(stem, partIndex, value = '', widthHint = 0) {
  const typed = String(value ?? '').trim().length;
  const hint = Number(widthHint) || 0;
  let w = Math.max(typed + 2, hint);
  if (w > 6) return Math.min(52, w);

  const parts = String(stem || '').split('____');
  const after = parts[partIndex + 1] || '';
  const before = parts[partIndex] || '';
  if (/章|chapter/i.test(before + after)) return 6;
  if (/^\s*[\d\-–]/.test(after)) return 7;
  if (/[，,;.]\s*$/.test(before)) return 14;
  if (/said|told|swear|prayed/i.test(before + after)) return 18;
  return 11;
}

function renderInlineFillStem(stem, gid, arr, widthHints = []) {
  const parts = String(stem || '').split('____');
  const n = parts.length - 1;
  let html = '';
  for (let i = 0; i < parts.length; i++) {
    html += esc(parts[i]);
    if (i < n) {
      const w = inlineBlankWidthCh(stem, i, arr[i], widthHints[i]);
      html += `<input class="inp inp-inline" style="width:${w}ch;min-width:${w}ch" data-gid="${esc(gid)}" data-kind="fill" data-blank="${i}" value="${esc(arr[i] || '')}" aria-label="${i + 1}">`;
    }
  }
  return html;
}

function stripSingleChoiceStem(stem, options) {
  let s = String(stem || '').trim();
  s = s.replace(/^（\s*(?:[A-D])?\s*）\s*/, '').replace(/^\(\s*(?:[A-D])?\s*\)\s*/, '');
  s = s.replace(/\s*\(\s*\)\s*/, ' ').trim();
  if (!options?.length) return s;
  const idx = s.search(/(?:^|[\s?？:：,.，])([A-D])[.．]\s/);
  if (idx >= 0) {
    const cut = s.slice(0, idx).trim();
    if (cut.length > 8) return cut;
  }
  return s.replace(/\s*[A-D][.．].*$/s, '').trim();
}

export function renderQuestionHtml(q, answers, lang) {
  const gid = q.group_id;
  const cur = answers[gid];
  const no = q.sort_order;
  const loc = questionLocale(q, lang);
  const stem = loc.stem ?? q.stem ?? '';
  let body = '';
  let stemContent = esc(stem);
  let stemCls = 'q-stem';

  if (q.type === 'single') {
    const opts = (Array.isArray(loc.options) && loc.options.length)
      ? loc.options
      : (Array.isArray(q.options) ? q.options : []);
    stemContent = esc(stripSingleChoiceStem(stem, opts));
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
    const meta = questionFillMeta(q, lang);
    const n = fillBlankCount(q, stem);
    const arr = Array.isArray(cur) ? cur : (cur != null && cur !== '' ? [String(cur)] : []);
    const labels = meta.blank_labels;
    const fillLayout = meta.fill_layout;
    const stemBlankCount = (stem.match(/____/g) || []).length;
    const blankWidths = loc.blank_widths || q.blank_widths || [];

    if (fillLayout === 'table' && Array.isArray(meta.table_rows) && meta.table_rows.length) {
      const headers = meta.table_headers || ['章节', '主题'];
      body = `<table class="fill-table"><thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>` +
        meta.table_rows.map((row, ri) =>
          `<tr><td>${esc(row.label)}</td><td><input class="inp" data-gid="${esc(gid)}" data-kind="fill" data-blank="${ri}" value="${esc(arr[ri] || '')}" placeholder="${ri + 1}"></td></tr>`
        ).join('') + '</tbody></table>';
    } else if (fillLayout === 'inline' || (stemBlankCount > 0 && stemBlankCount === n && !labels?.length)) {
      stemContent = renderInlineFillStem(stem, gid, arr, blankWidths);
      stemCls = 'q-stem fill-inline-stem';
      body = '';
    } else if (stemBlankCount > 0 && !labels?.length && fillLayout !== 'table') {
      stemContent = renderInlineFillStem(stem, gid, arr, blankWidths);
      stemCls = 'q-stem fill-inline-stem';
      body = '';
    } else if (Array.isArray(labels) && labels.length === n) {
      const dash = fillLayout === 'contrast' ? '<span class="fill-dash">——</span>' : '';
      body = `<div class="fill-blanks labeled${fillLayout === 'contrast' ? ' contrast' : ''}">${labels.map((label, i) =>
        `<div class="fill-row"><span class="fill-label">${esc(label)}</span>${dash}<input class="inp" data-gid="${esc(gid)}" data-kind="fill" data-blank="${i}" value="${esc(arr[i] || '')}" placeholder="${i + 1}"></div>`
      ).join('')}</div>`;
    } else {
      stemContent = esc(stem.replace(/\n\d+\.\s*____/g, '').trim());
      body = `<div class="fill-blanks">${Array.from({ length: n }, (_, i) =>
        `<input class="inp" data-gid="${esc(gid)}" data-kind="fill" data-blank="${i}" value="${esc(arr[i] || '')}" placeholder="${i + 1}">`
      ).join('')}</div>`;
    }
  } else if (q.type === 'essay') {
    const { rows, sizeCls } = essayTextareaSpec(q);
    const secLbl = esc(q.section_labels?.[lang] || q.section_label || '');
    const essayAns = Array.isArray(cur) ? '' : (cur ?? '');
    body = `<div class="essay-wrap">
      <textarea class="textarea essay-area ${sizeCls}" rows="${rows}" data-gid="${esc(gid)}" data-kind="essay" data-section-label="${secLbl}" placeholder="">${esc(essayAns)}</textarea>
      <div class="essay-count" aria-live="polite"></div>
    </div>`;
  } else if (q.type === 'dictation') {
    const dictAns = Array.isArray(cur) ? '' : (cur ?? '');
    body = `<textarea class="textarea" rows="5" data-gid="${esc(gid)}" data-kind="dictation" placeholder="">${esc(dictAns)}</textarea>`;
  } else {
    body = `<input class="inp" data-gid="${esc(gid)}" data-kind="text" value="${esc(cur || '')}">`;
  }

  const qcls = q.type === 'essay' ? ` q-card essay-${q.essay_kind || 'short'}` : ' q-card';
  return `<div class="${qcls.trim()}" data-qid="${esc(gid)}">
    <div class="q-head"><span class="q-no">${no}</span><span class="q-score">${q.score} ${lang === 'zh' ? '分' : 'pts'}</span></div>
    <div class="${stemCls}">${stemContent}</div>
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

/** 客观题题型（系统机评） */
export const OBJECTIVE_TYPES = new Set(['fill', 'single', 'truefalse', 'match', 'order', 'dictation']);

export function isObjectiveType(type) {
  return OBJECTIVE_TYPES.has(type);
}

export function paperHasObjective(paper) {
  return (paper || []).some((q) => isObjectiveType(q.type));
}

export function paperHasEssay(paper) {
  return (paper || []).some((q) => q.type === 'essay');
}

export function isAllSubjectivePaper(paper) {
  const qs = paper || [];
  return qs.length > 0 && qs.every((q) => q.type === 'essay');
}

export function questionLocale(q, lang) {
  const nested = q?.locales?.[lang] || q?.locales?.zh || q?.locales?.en || {};
  return {
    ...nested,
    stem: nested.stem || q?.stem || '',
    options: (Array.isArray(nested.options) && nested.options.length) ? nested.options : (q?.options || []),
    blank_labels: nested.blank_labels || q?.blank_labels,
    blank_widths: nested.blank_widths || q?.blank_widths,
    fill_layout: nested.fill_layout || q?.fill_layout,
    table_headers: nested.table_headers || q?.table_headers,
    table_rows: nested.table_rows || q?.table_rows,
  };
}

export function normGradeText(text, lang) {
  let v = String(text ?? '').trim();
  if (lang === 'zh' || !lang) {
    return v.replace(/\s+/g, '').replace(/[，。！？、；：“”'']/g, '');
  }
  return v.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

/** 填空答案中 / 分隔多个可接受写法 */
export function splitFillAnswerAlternatives(ans) {
  return String(ans ?? '')
    .split(/\s*\/\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function blankWidthForAnswer(ans) {
  const alts = splitFillAnswerAlternatives(ans);
  const n = alts.length ? Math.min(...alts.map((a) => a.length)) : String(ans ?? '').trim().length;
  return Math.min(52, Math.max(6, n + 2));
}

export function fillAnswerMatches(user, expected, lang) {
  const u = normGradeText(user, lang);
  if (!u) return false;
  const alts = splitFillAnswerAlternatives(expected);
  if (!alts.length) return normGradeText(expected, lang) === u;
  return alts.some((alt) => normGradeText(alt, lang) === u);
}

export function normDictationText(text, lang) {
  return normGradeText(text, lang);
}

export function gradeOneQuestion(type, maxScore, userAns, answerKey, lang) {
  if (type === 'essay') return 0;
  const score = Number(maxScore) || 0;
  const key = answerKey || {};
  let earned = 0;

  if (type === 'single') {
    if (Number(userAns) === Number(key.answer_index)) earned = score;
  } else if (type === 'truefalse') {
    if (Boolean(userAns) === Boolean(key.answer_bool)) earned = score;
  } else if (type === 'fill') {
    const uArr = Array.isArray(userAns) ? userAns : [];
    const eArr = Array.isArray(key.answers) ? key.answers : [];
    if (eArr.length > 0) {
      const per = score / eArr.length;
      eArr.forEach((exp, i) => {
        if (fillAnswerMatches(uArr[i], exp, lang)) earned += per;
      });
    }
  } else if (type === 'match') {
    const uArr = Array.isArray(userAns) ? userAns : [];
    const eArr = Array.isArray(key.answer_map) ? key.answer_map : [];
    if (eArr.length > 0) {
      const per = score / eArr.length;
      eArr.forEach((exp, i) => {
        if (Number(uArr[i]) === Number(exp)) earned += per;
      });
    }
  } else if (type === 'order') {
    const uSeq = String(userAns ?? '').toUpperCase().replace(/[^A-Z]/g, '');
    const eSeq = String(key.correct_seq ?? '').toUpperCase().replace(/[^A-Z]/g, '');
    if (uSeq && uSeq === eSeq) earned = score;
  } else if (type === 'dictation') {
    if (normDictationText(userAns, lang) === normDictationText(key.expected, lang)
      && normDictationText(key.expected, lang)) earned = score;
  }
  return Math.round(earned * 100) / 100;
}

export function formatStudentAnswer(q, answer, lang) {
  const loc = questionLocale(q, lang);
  if (q.type === 'essay' || q.type === 'dictation') {
    return String(answer ?? '').trim() || '（未作答）';
  }
  if (q.type === 'single') {
    const opts = loc.options || [];
    const idx = Number(answer);
    if (Number.isFinite(idx) && opts[idx] != null) return opts[idx];
    return answer == null ? '（未作答）' : String(answer);
  }
  if (q.type === 'truefalse') {
    if (answer === true || answer === 'true' || answer === 1 || answer === '1') {
      return lang === 'id' ? 'Benar' : lang === 'en' ? 'True' : '对';
    }
    if (answer === false || answer === 'false' || answer === 0 || answer === '0') {
      return lang === 'id' ? 'Salah' : lang === 'en' ? 'False' : '错';
    }
    return '（未作答）';
  }
  if (q.type === 'fill') {
    const arr = Array.isArray(answer) ? answer : [];
    const blanks = (loc.stem || '').match(/____/g)?.length || arr.length || 1;
    const parts = [];
    for (let i = 0; i < blanks; i++) {
      parts.push(arr[i]?.trim() ? arr[i].trim() : '（空）');
    }
    return parts.join(' / ');
  }
  if (q.type === 'order') return String(answer ?? '（未作答）');
  if (q.type === 'match') return JSON.stringify(answer ?? []);
  return answer == null ? '（未作答）' : String(answer);
}

export function formatCorrectAnswer(q, lang) {
  const loc = questionLocale(q, lang);
  const key = loc.answer_key || {};
  if (q.type === 'single') {
    const opts = loc.options || [];
    const idx = Number(key.answer_index);
    return opts[idx] != null ? opts[idx] : `选项 ${idx + 1}`;
  }
  if (q.type === 'truefalse') {
    const v = key.answer_bool;
    return v ? (lang === 'id' ? 'Benar' : lang === 'en' ? 'True' : '对')
      : (lang === 'id' ? 'Salah' : lang === 'en' ? 'False' : '错');
  }
  if (q.type === 'fill') {
    const arr = Array.isArray(key.answers) ? key.answers : [];
    return arr.length ? arr.join(' / ') : '—';
  }
  if (q.type === 'order') return key.correct_seq || '—';
  if (q.type === 'dictation') return key.expected || '—';
  if (key.reference) return key.reference;
  return '—';
}

export function mergeGradingItems(paper, answersJson, gradingItems) {
  const byGid = new Map((gradingItems || []).map((gi) => [gi.group_id, gi]));
  return (paper || [])
    .filter((q) => q.type === 'essay')
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((q) => {
      const existing = byGid.get(q.group_id);
      const ans = answersJson?.[q.group_id];
      const answerText = typeof ans === 'string' ? ans : (ans == null ? '' : String(ans));
      return {
        group_id: q.group_id,
        sort_order: q.sort_order,
        max_score: q.score,
        answer_text: existing?.answer_text ?? answerText,
        score: existing?.score ?? null,
        comment: existing?.comment ?? null,
      };
    });
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
