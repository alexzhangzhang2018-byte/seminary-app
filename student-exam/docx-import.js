/* 从招生笔试同款 Word 卷面解析为 student_exam snapshot_json */
'use strict';

function decodeXml(s) {
  return String(s || '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

export async function extractDocxLines(arrayBuffer) {
  if (typeof JSZip === 'undefined') throw new Error('JSZip 未加载');
  const zip = await JSZip.loadAsync(arrayBuffer);
  const xml = await zip.file('word/document.xml')?.async('string');
  if (!xml) throw new Error('不是有效的 .docx 文件');
  const lines = [];
  const paraRe = /<w:p[^>]*>(.*?)<\/w:p>/gs;
  const textRe = /<w:t[^>]*>(.*?)<\/w:t>/gs;
  let m;
  while ((m = paraRe.exec(xml))) {
    const parts = [];
    let t;
    const inner = m[1];
    while ((t = textRe.exec(inner))) parts.push(decodeXml(t[1]));
    if (!parts.length) continue;
    let s = parts.join('');
    s = s.replace(/<[^>]+>/g, '');
    s = s.replace(/\s+/g, ' ').trim();
    if (s) lines.push(s);
  }
  return lines;
}

function parseBraceAnswers(s) {
  const answers = [];
  const re = /\{([^}]+)\}/g;
  let m;
  while ((m = re.exec(s))) answers.push(m[1]);
  const prompt = s.replace(/\{[^}]+\}/g, '____');
  return { prompt, answers };
}

function normSeq(s) {
  return String(s || '').replace(/\s+/g, '').toUpperCase();
}

/** 神学院课程卷（希伯来书等）：经文填空【】、单选（ ）、判断、简答、论述 */
export function parseCourseExamText(lines) {
  const questions = [];
  let qid = 1;
  let i = 0;

  const sectionScore = (hdr, fallback) => {
    const m = hdr.match(/每题([0-9.]+)分/) || hdr.match(/每空([0-9.]+)分/);
    return m ? +m[1] : fallback;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (/^一、.*填空/.test(line)) {
      const perBlank = sectionScore(line, 1);
      i++;
      while (i < lines.length && !/^二、/.test(lines[i])) {
        const l = lines[i];
        const bracketParts = [...l.matchAll(/【([^】]*)】/g)];
        if (bracketParts.length > 0) {
          const answers = bracketParts.map((m) => m[1].trim());
          const examOnly = answers.every((a) => a === '');
          const prompt = l.replace(/【[^】]*】/g, '____');
          const q = {
            id: qid++,
            type: 'fill',
            prompt,
            answers: examOnly ? new Array(answers.length).fill('') : answers,
            score: answers.length * perBlank,
          };
          if (examOnly) q.needs_answer_key = true;
          questions.push(q);
        }
        i++;
      }
      continue;
    }

    if (/^二、.*选择/.test(line)) {
      const perQ = sectionScore(line, 1);
      i++;
      while (i < lines.length && !/^三、/.test(lines[i])) {
        const l = lines[i];
        const ansM = l.match(/^（\s*([A-D])\s*）/);
        const examM = !ansM && /^（\s*）/.test(l);
        if (ansM || examM) {
          const prompt = l.replace(/^（\s*(?:[A-D])?\s*）\s*/, '').trim();
          let optLine = lines[i + 1] || '';
          if (!/^\s*[A-D]\s/.test(optLine) && /[A-D]\s/.test(l)) optLine = l;
          const options = parseInlineOptions(optLine);
          if (options.length >= 2) {
            const q = {
              id: qid++,
              type: 'single',
              prompt,
              options,
              score: perQ,
            };
            if (ansM) {
              q.answer_index = { A: 0, B: 1, C: 2, D: 3 }[ansM[1]];
            } else {
              q.needs_answer_key = true;
            }
            questions.push(q);
            if (optLine === lines[i + 1]) i++;
          }
        }
        i++;
      }
      continue;
    }

    if (/^三、判断/.test(line)) {
      const perQ = sectionScore(line, 1);
      i++;
      while (i < lines.length && !/^四、/.test(lines[i])) {
        const l = lines[i];
        const ansM = l.match(/^（\s*([✓√×xX])\s*）/);
        const examM = !ansM && /^（\s*）/.test(l);
        if (ansM || examM) {
          const prompt = l.replace(/^（\s*(?:[✓√×xX])?\s*）\s*/, '').trim();
          const q = { id: qid++, type: 'truefalse', prompt, score: perQ };
          if (ansM) {
            q.answer_bool = ansM[1] === '✓' || ansM[1] === '√';
          } else {
            q.needs_answer_key = true;
          }
          questions.push(q);
        }
        i++;
      }
      continue;
    }

    if (/^四、简答/.test(line)) {
      const perQ = sectionScore(line, 2);
      i++;
      while (i < lines.length && !/^五、/.test(lines[i])) {
        const l = lines[i].trim();
        if (l && !/^四、/.test(l)) {
          questions.push({ id: qid++, type: 'essay', prompt: l, score: perQ });
        }
        i++;
      }
      continue;
    }

    if (/^五、论述/.test(line)) {
      const perQ = sectionScore(line, 10);
      i++;
      while (i < lines.length) {
        const l = lines[i].trim();
        if (l && !/^五、/.test(l)) {
          questions.push({ id: qid++, type: 'essay', prompt: l, score: perQ });
        }
        i++;
      }
      break;
    }

    i++;
  }
  return questions;
}

function parseInlineOptions(line) {
  const opts = [];
  const re = /(?:^|\s)([A-D])\s+(.+?)(?=(?:\s+[A-D]\s+)|$)/g;
  let m;
  while ((m = re.exec(line))) opts.push(m[2].trim());
  if (opts.length >= 2) return opts;
  for (const L of ['A', 'B', 'C', 'D']) {
    const om = line.match(new RegExp(`\\b${L}\\s+(.+?)(?=\\s+[A-D]\\s+|$)`));
    if (om) opts.push(om[1].trim());
  }
  return opts;
}

export function detectExamFormat(lines) {
  const head = lines.slice(0, 15).join('\n');
  if (/一、经文填空|二、单项选择题|【\s*】/.test(head)) return 'course';
  if (/一、填空题|旧约部分|新约部分|\{[^}]+\}/.test(lines.join('\n'))) return 'recruitment';
  return 'course';
}

/** 解析纯文本 → 旧版 EXAM_Qs 结构（招生笔试） */
export function parseExamPlainText(lines) {
  const questions = [];
  let qid = 1;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^旧约部分|^新约部分/.test(line)) { i++; continue; }

    if (/^一、填空题/.test(line)) {
      const defPer = +(line.match(/每空([0-9.]+)分/)?.[1] || 0.5);
      i++;
      while (i < lines.length && !/^二、/.test(lines[i])) {
        const pl = lines[i];
        if (/\{[^}]+\}/.test(pl)) {
          const { prompt, answers } = parseBraceAnswers(pl);
          const per = +(pl.match(/每空\s*([0-9.]+)分/)?.[1] || defPer);
          questions.push({ id: qid++, type: 'fill', prompt, answers, score: answers.length * per });
          i++; continue;
        }
        if (/^\d+\./.test(pl) || /分别是/.test(pl)) {
          const per = +(pl.match(/每空\s*([0-9.]+)分/)?.[1] || defPer);
          const next = lines[i + 1] || '';
          if (/、/.test(next)) {
            const ans = next.split(/[、]+/).map((x) => x.trim()).filter(Boolean);
            if (ans.length) {
              questions.push({ id: qid++, type: 'fill', prompt: pl + '（请填写）', answers: ans, score: ans.length * per });
              i += 2; continue;
            }
          }
        }
        i++;
      }
      continue;
    }

    if (/^二、(单选题|选择题)/.test(line)) {
      i++;
      while (i < lines.length && !/^三、/.test(lines[i])) {
        const ql = lines[i];
        if (!/^\d+\./.test(ql)) { i++; continue; }
        let ansLetter = ql.match(/（([A-D])）/)?.[1] || ql.match(/\s([A-D])\s*$/)?.[1] || ql.match(/\?\s*([A-D])\s*$/)?.[1];
        if (!ansLetter) { i++; continue; }
        let prompt;
        const opts = [];
        if (/\bA\./.test(ql) && /\bD\./.test(ql)) {
          prompt = ql.replace(/^\d+\.\s*/, '');
          const pos = prompt.search(/\bA\./);
          if (pos >= 0) prompt = prompt.slice(0, pos);
          prompt = prompt.replace(/（[A-D]）/g, '').replace(/\s+[A-D]\s*$/, '').trim();
          for (const L of ['A', 'B', 'C', 'D']) {
            const om = ql.match(new RegExp(`\\b${L}\\.\\s*(.*?)(?=\\b[A-D]\\.|$)`));
            opts.push(om ? om[1].trim() : '');
          }
        } else {
          prompt = ql.replace(/^\d+\.\s*/, '').replace(/（[A-D]）/g, '').replace(/\s+[A-D]\s*$/, '').trim();
          const map = {};
          let j = i + 1;
          while (j < lines.length && !/^\d+\./.test(lines[j])) {
            const om = lines[j].match(/^([A-D])\.\s*(.*)$/);
            if (om) map[om[1]] = om[2];
            j++;
          }
          for (const L of ['A', 'B', 'C', 'D']) opts.push(map[L] || '');
          i = j - 1;
        }
        const answer_index = { A: 0, B: 1, C: 2, D: 3 }[ansLetter];
        questions.push({ id: qid++, type: 'single', prompt, options: opts, answer_index, score: 0.5 });
        i++;
      }
      continue;
    }

    if (/^三、连线题/.test(line)) {
      let prompt = '';
      const leftItems = [];
      const leftLetters = [];
      const rightMap = {};
      i++;
      while (i < lines.length && !/^四、判断题/.test(lines[i])) {
        const l = lines[i];
        const lm = l.match(/^（([A-Z])）\d+\.(.+)$/);
        if (lm) { leftLetters.push(lm[1]); leftItems.push(lm[2].trim()); }
        const rm = l.match(/^([A-Z])\.\s*(.+)$/);
        if (rm) rightMap[rm[1]] = rm[2];
        if (/^请根据/.test(l)) prompt = l;
        i++;
      }
      const letters = Object.keys(rightMap).sort();
      const rightItems = letters.map((k) => rightMap[k]);
      const rightIndex = Object.fromEntries(letters.map((k, idx) => [k, idx]));
      const answer_map = leftLetters.map((L) => rightIndex[L]);
      questions.push({
        id: qid++, type: 'match', prompt,
        left_items: leftItems, right_items: rightItems, answer_map,
        score: 0.5 * leftItems.length,
      });
      continue;
    }

    if (/^四、判断题/.test(line)) {
      i++;
      while (i < lines.length && !/^五、排序题/.test(lines[i])) {
        const l = lines[i];
        if (!/^\d+\./.test(l)) { i++; continue; }
        let truth = null;
        if (/√/.test(l)) truth = true;
        else if (/×/.test(l)) truth = false;
        else { i++; continue; }
        const pos = Math.max(l.indexOf('√'), l.indexOf('×'));
        let stmt = l.slice(pos + 1).replace(/^[_\s　]+/, '').trim();
        questions.push({ id: qid++, type: 'truefalse', prompt: stmt, answer_bool: truth, score: 0.5 });
        i++;
      }
      continue;
    }

    if (/^五、排序题/.test(line)) {
      i++;
      while (i < lines.length && !/^六、默写题/.test(lines[i])) {
        const l = lines[i];
        const sm = l.match(/^(\d+)\.(.*)排序\s+([A-Z]+)/);
        if (sm) {
          const seq = sm[3];
          let prompt = sm[2].trim();
          const itemMap = {};
          let j = i + 1;
          while (j < lines.length && !/^\d+\./.test(lines[j]) && !/^六、默写题/.test(lines[j])) {
            const im = lines[j].match(/^([A-Z])\.\s*(.+)$/);
            if (im) itemMap[im[1]] = im[2];
            j++;
          }
          questions.push({
            id: qid++, type: 'order', prompt, correct_seq: normSeq(seq), score: 1,
          });
          i = j - 1;
        }
        i++;
      }
      continue;
    }

    if (/^六、默写题/.test(line)) {
      i++;
      while (i < lines.length && !/^(旧约部分|新约部分)/.test(lines[i])) {
        const l = lines[i];
        const dm = l.match(/^(\d+)\.(.+)$/);
        if (dm) {
          let text = dm[2];
          let j = i + 1;
          while (j < lines.length && !/^\d+\./.test(lines[j]) && !/^(旧约|新约)部分/.test(lines[j]) && lines[j].trim()) {
            text += ' ' + lines[j];
            j++;
          }
          const ref = text;
          questions.push({
            id: qid++, type: 'dictation', prompt: '请默写：' + ref.split('“')[0],
            expected: text, score: 2,
          });
          i = j - 1;
        }
        i++;
      }
      continue;
    }

    if (/^七、|论述|essay/i.test(line) || /问答题/.test(line)) {
      i++;
      while (i < lines.length && !/^(旧约部分|新约部分|一、)/.test(lines[i])) {
        const l = lines[i];
        if (/^\d+\./.test(l)) {
          const stem = l.replace(/^\d+\.\s*/, '').trim();
          const score = +(l.match(/（([0-9.]+)分/)?.[1] || 10);
          questions.push({ id: qid++, type: 'essay', prompt: stem, score });
        }
        i++;
      }
      continue;
    }

    i++;
  }
  return questions;
}

function legacyToLocale(q) {
  const loc = { stem: '', options: [], answer_key: {} };
  if (q.type === 'single') {
    loc.stem = q.prompt;
    loc.options = q.options || [];
    if (q.answer_index != null) loc.answer_key = { answer_index: q.answer_index };
  } else if (q.type === 'truefalse') {
    loc.stem = q.prompt;
    if (q.answer_bool != null) loc.answer_key = { answer_bool: !!q.answer_bool };
  } else if (q.type === 'fill') {
    loc.stem = q.prompt;
    const ans = q.answers || [];
    if (ans.length && ans.some((a) => String(a).trim())) loc.answer_key = { answers: ans };
  } else if (q.type === 'match') {
    loc.stem = (q.prompt || '连线题') + '\n' + (q.left_items || []).map((t, i) => `${i + 1}. ${t}`).join('\n');
    loc.options = q.right_items || [];
    loc.answer_key = { answer_map: q.answer_map || [] };
  } else if (q.type === 'order') {
    loc.stem = q.prompt;
    loc.answer_key = { correct_seq: q.correct_seq || '' };
  } else if (q.type === 'dictation') {
    loc.stem = q.prompt;
    loc.answer_key = { expected: q.expected || '' };
  } else if (q.type === 'essay') {
    loc.stem = q.prompt;
    loc.answer_key = {};
  }
  return loc;
}

function legacyListToSnapshot(questions, lang) {
  return questions.map((q, idx) => ({
    group_id: `q${idx + 1}`,
    sort_order: idx + 1,
    type: q.type,
    section: 'A',
    score: q.score || 0,
    locales: { [lang]: legacyToLocale(q) },
  }));
}

export function mergeSnapshotsByIndex(parts) {
  // parts: [{ lang, snapshot }]
  const map = new Map();
  for (const { lang, snapshot } of parts) {
    snapshot.forEach((item, idx) => {
      const key = item.group_id || `q${idx + 1}`;
      if (!map.has(key)) {
        map.set(key, { ...item, group_id: key, sort_order: idx + 1, locales: {} });
      }
      const row = map.get(key);
      row.locales[lang] = item.locales[lang] || item.locales[Object.keys(item.locales)[0]];
      if (!row.type) row.type = item.type;
      if (!row.score) row.score = item.score;
    });
  }
  return [...map.values()].sort((a, b) => a.sort_order - b.sort_order);
}

export async function docxFileToSnapshot(file, lang) {
  const buf = await file.arrayBuffer();
  const lines = await extractDocxLines(buf);
  const fmt = detectExamFormat(lines);
  const legacy = fmt === 'course' ? parseCourseExamText(lines) : parseExamPlainText(lines);
  if (!legacy.length) {
    throw new Error('未能识别题目。支持：①课程卷（经文填空【】、单选、判断、简答、论述）②招生卷（一、填空题…）');
  }
  const snapshot = legacyListToSnapshot(legacy, lang);
  const needsAnswerKey = legacy.filter((q) => q.needs_answer_key).length;
  return { snapshot, format: fmt, needsAnswerKey };
}
