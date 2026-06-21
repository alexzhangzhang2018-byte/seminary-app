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
  let m;
  while ((m = paraRe.exec(xml))) {
    const inner = m[1];
    const parts = [];
    const runRe = /<w:r[^>]*>(.*?)<\/w:r>/gs;
    let rm;
    while ((rm = runRe.exec(inner))) {
      const runXml = rm[1];
      const underlined = /<w:u\b/.test(runXml);
      const textRe = /<w:t[^>]*>(.*?)<\/w:t>/gs;
      let t;
      let chunk = '';
      while ((t = textRe.exec(runXml))) chunk += decodeXml(t[1]);
      if (!chunk && !underlined) continue;
      if (underlined) {
        const ans = chunk.trim();
        parts.push(ans ? `【${ans}】` : '【】');
      } else {
        parts.push(chunk);
      }
    }
    if (!parts.length) {
      // 回退：无 run 结构时按旧逻辑
      const textRe = /<w:t[^>]*>(.*?)<\/w:t>/gs;
      let t;
      while ((t = textRe.exec(inner))) parts.push(decodeXml(t[1]));
    }
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

function isUnderscoreConnectorText(text) {
  const mid = String(text || '').trim();
  if (!mid) return true;
  if (/^[，,、；;：:和与及以及]+$/.test(mid)) return true;
  if (/^[，,、；;：:和与及以及]/.test(mid)) return true;
  if (/[，,、；;：:和与及以及]$/.test(mid)) return true;
  return false;
}

function parseUnderscoreBlanks(line) {
  const s = String(line || '').trim();
  if (!/_/.test(s)) return null;

  const longRuns = [...s.matchAll(/_{3,}/g)];
  if (longRuns.length > 0) {
    const segments = s.split(/_{3,}/);
    if (longRuns.length === 2) {
      const mid = (segments[1] || '').trim();
      if (mid && !isUnderscoreConnectorText(mid) && mid.length <= 80) {
        return {
          prompt: `${segments[0] || ''}____${segments[2] || ''}`,
          answers: [mid],
          examOnly: false,
        };
      }
    }
    return {
      prompt: s.replace(/_{3,}/g, '____'),
      answers: new Array(longRuns.length).fill(''),
      examOnly: longRuns.length > 0,
    };
  }

  const answers = [];
  const re = /_+([^_]+?)_+/g;
  let m;
  while ((m = re.exec(s))) answers.push(m[1].trim());
  if (answers.length) {
    return {
      prompt: s.replace(/_+[^_]+?_+/g, '____'),
      answers,
      examOnly: false,
    };
  }
  return null;
}

function mergeSplitDoubleBrackets(line) {
  return String(line || '').replace(/【【([\s\S]*?)】【】】/g, (full, inner) => {
    if (!inner.includes('】【')) return full;
    return `【【${inner.split('】【').join('')}】【】】`;
  });
}

function cleanBracketAnswer(ans) {
  return String(ans ?? '')
    .replace(/^[【\s]+/, '')
    .replace(/[】\s]+$/, '')
    .replace(/】【/g, '')
    .trim();
}

/** 填空参考答案含 / 时表示多个可接受写法；宽度按最短备选计算 */
function blankWidthForAnswer(ans) {
  const alts = String(ans ?? '').split(/\s*\/\s*/).map((s) => s.trim()).filter(Boolean);
  const n = alts.length
    ? Math.min(...alts.map((a) => a.length))
    : String(ans ?? '').trim().length;
  return Math.min(52, Math.max(6, n + 2));
}

function cleanBracketStem(s) {
  return String(s || '')
    .replace(/____】/g, '____')
    .replace(/】/g, '')
    .replace(/【/g, '')
    .replace(/_{4,}/g, '____')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .trim();
}

function normalizeHybridExamFillLine(line) {
  return String(line || '')
    .replace(/_{2,}\s*【([^】]+)】_*/g, '【$1】')
    .replace(/_{2,}\s*【([^】]+)】/g, '【$1】');
}

/** 中文答案版：【【答案】【】】为一空；单独【答案】为一空 */
export function parseLineBracketFills(line) {
  let s = mergeSplitDoubleBrackets(normalizeHybridExamFillLine(line));
  if (!s || !/【/.test(s)) return null;

  s = s.replace(/^【\d+\.】\s*/, '').replace(/^\d+\.\s*/, '');
  const answers = [];

  if (/【【[^】]*】【】】/.test(s)) {
    let prompt = s.replace(/【【([^】]*)】【】】/g, (_, ans) => {
      answers.push(cleanBracketAnswer(ans));
      return '____';
    });
    prompt = prompt.replace(/【([^】]+)】/g, (_, ans) => {
      answers.push(cleanBracketAnswer(ans));
      return '____';
    });
    prompt = cleanBracketStem(prompt);
    if (answers.length) {
      return { prompt, answers };
    }
  }

  if (/【[^】]+】/.test(s)) {
    const prompt = cleanBracketStem(s.replace(/【([^】]+)】/g, (_, ans) => {
      answers.push(cleanBracketAnswer(ans));
      return '____';
    }));
    if (answers.length) return { prompt, answers };
  }

  return null;
}

/** 默写经文：引语后整段为一空 */
export function parseDictationRecitation(headerLine, contentLine, sectionLabel, score = 2) {
  const content = String(contentLine || '').trim();
  const introM = content.match(/^(.+?[：:]\s*[""「\u201c])(.*)$/s);
  if (!introM) return null;
  const prefix = introM[1];
  let body = introM[2].replace(/^[""「\u201c]/, '').replace(/[""」\u201d]?\s*$/g, '');

  if (/【【/.test(content)) {
    body = body.replace(/^【【/, '').replace(/[。.]*】+$/g, '').replace(/】【/g, '');
  }
  const expected = cleanBracketAnswer(body);
  if (!expected || expected.length < 12) return null;
  return {
    type: 'dictation',
    prompt: `${String(headerLine || '').trim()}\n${prefix}____”`,
    expected,
    score,
    section_label: cleanBracketStem(sectionLabel || headerLine || ''),
  };
}

/** 修正已解析 snapshot 中残留的括号/多空问题 */
export function normalizeSnapshotBracketQuestions(snapshot) {
  if (!Array.isArray(snapshot)) return snapshot;
  const out = [];
  for (let i = 0; i < snapshot.length; i++) {
    const q = snapshot[i];
    if (!q?.locales) { out.push(q); continue; }

    for (const lang of Object.keys(q.locales)) {
      const loc = q.locales[lang];
      if (!loc) continue;
      const stem = String(loc.stem || '');
      if (q.type === 'fill' && (/【|】/.test(stem) || /【/.test((loc.answer_key?.answers || []).join('')))) {
        const fixed = parseLineBracketFills(
          stem.includes('【') ? stem : rebuildLineFromBrokenFill(stem, loc.answer_key?.answers),
        );
        if (fixed) {
          loc.stem = fixed.prompt;
          if (fixed.answers.length) loc.answer_key = { answers: fixed.answers };
        } else if (Array.isArray(loc.answer_key?.answers)) {
          const ans = loc.answer_key.answers.map(cleanBracketAnswer).filter((a) => a);
          loc.stem = cleanBracketStem(stem);
          if (ans.length) loc.answer_key = { answers: ans };
        }
        const n = loc.answer_key?.answers?.length || (loc.stem.match(/____/g) || []).length || 1;
        const per = (q.score || n) / Math.max(1, (stem.match(/____/g) || []).length || n);
        q.score = Math.round(n * per * 100) / 100;
      } else if (loc.stem) {
        loc.stem = cleanBracketStem(loc.stem);
      }
    }
    if (q.section_label) q.section_label = cleanBracketStem(q.section_label);

    // 合并：默写标题 + 下一条经文题干
    const zh = q.locales?.zh;
    if (q.type === 'essay' && zh && /默写/.test(zh.stem) && i + 1 < snapshot.length) {
      const nxt = snapshot[i + 1];
      const nz = nxt?.locales?.zh;
      if (nz && (/【【|】/.test(nz.stem) || (/耶和华|说[：:]/.test(nz.stem) && nz.stem.length > 30))) {
        const dict = parseDictationRecitation(zh.stem, nz.stem, q.section_label, q.score || 2);
        if (dict) {
          out.push({
            group_id: q.group_id,
            sort_order: q.sort_order,
            type: 'dictation',
            section: q.section,
            score: dict.score,
            section_label: dict.section_label,
            locales: {
              zh: {
                stem: dict.prompt,
                options: [],
                answer_key: { expected: dict.expected },
              },
            },
          });
          i++;
          continue;
        }
      }
    }

    if (q.type === 'fill') {
      let maxBlanks = Number(q.blank_count) || 0;
      for (const lang of Object.keys(q.locales || {})) {
        const loc = q.locales[lang];
        const stem = String(loc?.stem || '');
        maxBlanks = Math.max(maxBlanks, (stem.match(/____/g) || []).length, loc?.answer_key?.answers?.length || 0);
        const ans = loc?.answer_key?.answers;
        if (Array.isArray(ans) && ans.length) {
          loc.blank_widths = ans.map((a) => blankWidthForAnswer(a));
        }
      }
      q.blank_count = Math.max(1, maxBlanks);
    }

    out.push(q);
  }
  return out;
}

function rebuildLineFromBrokenFill(stem, answers) {
  const parts = (answers || []).map((a) => cleanBracketAnswer(a)).filter(Boolean);
  let pi = 0;
  return stem.replace(/____】?/g, () => {
    const a = parts[pi++] || '';
    return a ? `【【${a}】【】】` : '【】';
  });
}

function extractNtsBracketAnswers(line) {
  const answers = [];
  const re = /【【?([^】]*)】】?/g;
  let m;
  while ((m = re.exec(String(line || '')))) {
    const t = m[1].replace(/】【/g, '').trim();
    if (t) answers.push(t);
  }
  if (answers.length) return answers;
  const pm = String(line || '').match(/[—\-]{1,2}\s*[（(]\s*([^）)]+?)\s*[）)]/);
  if (pm) return [pm[1].trim()];
  return [];
}

function isMainStructuredFillHeader(line) {
  const l = String(line || '').trim();
  if (/^(\d+)\s+.{5,}：/.test(l)) return true;
  if (/^(\d+)\s+.{8,}[。]/.test(l) && /【/.test(l)) return true;
  return false;
}

function isSubFillItemLine(line) {
  const l = String(line || '').trim();
  if (/^(第一次|第二次|第三次|第四次|第五次)\s/.test(l)) return true;
  if (/^[^—：]{1,14}[—\-]{1,2}\s*[（(]/.test(l)) return true;
  if (/^(\d+)\s*.+/.test(l) && /【|（|\(|章/.test(l) && l.length < 120) return true;
  return false;
}

function subFillLabel(line) {
  const l = String(line || '').trim();
  let m = l.match(/^(第一次|第二次|第三次|第四次|第五次)\s*/);
  if (m) return m[1];
  m = l.match(/^([^—：]{1,14})[—\-]{1,2}/);
  if (m) return m[1].trim();
  m = l.match(/^(\d+)\s*/);
  if (m) return m[1];
  return '';
}

function studentStemFromSubLine(line) {
  const label = subFillLabel(line);
  const answers = extractNtsBracketAnswers(line);
  const raw = String(line || '').trim();
  if (/^(第一次|第二次|第三次)/.test(raw)) {
    return { label, answers, subline: `${label} ____` };
  }
  if (/[—\-]{1,2}\s*[（(]/.test(raw)) {
    const left = raw.match(/^([^—：]+)[—\-]{1,2}/)?.[1]?.trim() || label;
    return { label: left, answers, subline: `${left}——____` };
  }
  let subline = raw
    .replace(/_+/g, '')
    .replace(/【【?[^】]*】】?/g, '____')
    .trim();
  const numM = subline.match(/^(\d+)\s*/);
  if (numM && /章/.test(subline)) {
    return { label: numM[1], answers, subline: subline.replace(/^\d+\s*/, '').trim() };
  }
  if (numM) {
    return { label: numM[1], answers, subline: `${numM[1]}. ____` };
  }
  if (!subline.includes('____')) subline = `${subline} ____`;
  return { label, answers, subline };
}

function finishStructuredFill(current, perBlank, sectionId, sectionLabel) {
  if (!current) return null;
  const q = {
    type: 'fill',
    section: sectionId,
    section_label: sectionLabel,
  };
  if (current.table_rows?.length) {
    q.fill_layout = 'table';
    q.prompt = current.prompt;
    q.table_headers = current.table_headers || ['章节', '主题'];
    q.table_rows = current.table_rows;
    q.answers = current.table_rows.map((r) => r.answer || '');
    q.score = q.answers.length * perBlank;
  } else if (current.items?.length) {
    q.prompt = current.prompt;
    const answers = current.items.flatMap((item) => item.answers);
    const ordinalLabels = current.items.map((i) => i.label).filter((l) => /^(第一次|第二次|第三次)/.test(l));
    const dashLabels = current.items.map((i) => i.label).filter((l) => l && !/^\d+$/.test(l) && !/^(第一次|第二次|第三次)/.test(l));
    const numberedOnly = current.items.every((i) => /^\d+$/.test(i.label));
    const chapterSubs = current.items.some((i) => /章/.test(i.subline));

    if (chapterSubs) {
      q.prompt = `${current.prompt}\n${current.items.map((i) => i.subline).join('\n')}`;
      q.fill_layout = 'inline';
    } else if (ordinalLabels.length === current.items.length) {
      q.blank_labels = ordinalLabels;
    } else if (dashLabels.length === current.items.length) {
      q.blank_labels = dashLabels;
      q.fill_layout = 'contrast';
    } else if (numberedOnly) {
      // 子项编号由下方输入框体现，题干不再重复 1.____ 2.____
    } else {
      q.blank_labels = current.items.map((i) => i.label || '').filter(Boolean);
      if (!q.blank_labels.length) {
        q.prompt = `${current.prompt}\n${current.items.map((i) => i.subline).join('\n')}`;
      }
    }
    q.answers = answers;
    q.score = Math.max(answers.length, 1) * perBlank;
  } else if (current.inline) {
    const parsed = parseLineBracketFills(current.inline) || parseUnderscoreBlanks(current.inline);
    if (parsed) {
      q.prompt = parsed.prompt;
      q.answers = parsed.answers;
      q.score = parsed.answers.length * perBlank;
    }
  }
  if (!q.prompt) return null;
  if (!q.answers?.some((a) => String(a).trim())) q.needs_answer_key = true;
  return q;
}

/** 大题题干 + 子项/表格；【】为答案，下划线 _ 仅为占位 */
function parseStructuredFillSection(lines, startIdx, hdr, endRe, perBlank, sectionId) {
  const sectionLabel = cleanBracketStem(hdr);
  let i = startIdx;
  let probe = i;
  let sawStructured = false;
  while (probe < lines.length && probe < startIdx + 12 && !endRe.test(lines[probe])) {
    const t = String(lines[probe] || '').trim();
    if (t === '章节' || isMainStructuredFillHeader(t) || /^(第一次|第二次)/.test(t)) {
      sawStructured = true;
      break;
    }
    probe++;
  }
  if (!sawStructured) return null;

  const questions = [];
  let current = null;

  const flush = () => {
    const q = finishStructuredFill(current, perBlank, sectionId, sectionLabel);
    if (q) questions.push(q);
    current = null;
  };

  while (i < lines.length && !endRe.test(lines[i])) {
    const l = String(lines[i] || '').trim();
    if (!l) { i++; continue; }

    if (isMainStructuredFillHeader(l)) {
      flush();
      const m = l.match(/^(\d+)\s+(.+)$/s);
      const inlineParsed = parseLineBracketFills(l);
      if (inlineParsed?.answers?.length >= 2 && /【/.test(l) && String(m?.[2] || l).length > 40) {
        questions.push({
          type: 'fill',
          prompt: m ? `${m[1]}. ${inlineParsed.prompt.replace(/^\d+\.?\s*/, '')}` : inlineParsed.prompt,
          answers: inlineParsed.answers,
          score: inlineParsed.answers.length * perBlank,
          section: sectionId,
          section_label: sectionLabel,
        });
      } else if (m) {
        current = { prompt: `${m[1]}. ${m[2]}`, items: [], table_rows: null };
      }
      i++;
      continue;
    }

    if (current && l === '章节') {
      current.table_mode = true;
      current.table_headers = ['章节', '主题'];
      current.table_rows = [];
      i++;
      if (String(lines[i] || '').trim() === '主题') i++;
      continue;
    }

    if (current?.table_mode && /章/.test(l) && !/【/.test(l)) {
      current.table_rows.push({ label: l, answer: '' });
      i++;
      continue;
    }

    if (current && isSubFillItemLine(l)) {
      current.items.push(studentStemFromSubLine(l));
      i++;
      continue;
    }

    if (!current) break;
    i++;
  }
  flush();
  return questions.length ? { questions, next: i } : null;
}

function parseFillSection(lines, startIdx, hdr, endRe, perBlank, sectionId) {
  const questions = [];
  let i = startIdx;
  const cleanHdr = cleanBracketStem(hdr);
  while (i < lines.length && !endRe.test(lines[i])) {
    const l = lines[i];
    const fillLine = normalizeHybridExamFillLine(l);
    if (/默写/.test(l) && i + 1 < lines.length && /【【/.test(lines[i + 1])) {
      const dict = parseDictationRecitation(l, lines[i + 1], cleanHdr, perBlank * 2 || 2);
      if (dict) {
        dict.section = sectionId;
        questions.push(dict);
        i += 2;
        continue;
      }
    }
    const parsed = parseLineBracketFills(fillLine);
    if (parsed) {
      questions.push({
        type: 'fill',
        prompt: parsed.prompt,
        answers: parsed.answers,
        score: parsed.answers.length * perBlank,
        section: sectionId,
        section_label: cleanHdr,
      });
    } else {
      const us = parseUnderscoreBlanks(fillLine);
      if (us && (us.answers.length || us.examOnly)) {
        const q = {
          type: 'fill',
          prompt: us.prompt,
          answers: us.answers,
          score: us.answers.length * perBlank,
          section: sectionId,
          section_label: cleanHdr,
        };
        if (us.examOnly) q.needs_answer_key = true;
        questions.push(q);
      }
    }
    i++;
  }
  return { questions, next: i };
}

function extractBracketTexts(s) {
  const texts = [];
  const re = /【([^】]*)】/g;
  let m;
  while ((m = re.exec(String(s || '')))) {
    const t = m[1].trim();
    if (t) texts.push(t);
  }
  return texts;
}

function textWithoutBrackets(s) {
  return String(s || '').replace(/【[^】]*】/g, '').replace(/\s+/g, ' ').trim();
}

function bracketReferenceText(lineOrLines) {
  const s = Array.isArray(lineOrLines) ? lineOrLines.join('\n') : String(lineOrLines || '');
  const parts = extractBracketTexts(s);
  const joined = parts.length ? parts.join('') : s;
  return joined.replace(/^【+/, '').replace(/】+$/, '').trim();
}

function isBracketReferenceLine(s) {
  const raw = String(s || '').trim();
  if (!raw || !/【/.test(raw)) return false;
  const plain = textWithoutBrackets(raw);
  return plain.length <= 2 || /^【[^】]*】$/.test(raw);
}

function looksLikeEssayQuestion(s) {
  const l = String(s || '').trim();
  if (!l || isBracketReferenceLine(l)) return false;
  if (/^[一二三四五六]、/.test(l) && /题/.test(l)) return false;
  if (/^（\s*[A-D]/.test(l) || /^（\s*[✓√×]/.test(l)) return false;
  if (/^(\d+)[.、\s]+/.test(l)) return true;
  if (l.length >= 6 && (/[？?]/.test(l) || /：$/.test(l) || /简述|解释|阐述|概括|默写|分析|谈谈|如何|请|写出/.test(l))) return true;
  return l.length >= 12;
}

function essayScoreFromHeader(hdr, essayKind) {
  const m = String(hdr || '').match(/每题\s*([0-9.]+)分/)
    || String(hdr || '').match(/(\d+(?:\.\d+)?)\s*points?\s*each/i);
  if (m) return +m[1];
  return essayKind === 'long' ? 5 : 2;
}

function isRomanSectionHeader(line) {
  return /^I{1,3}V?\.\s+/i.test(String(line || '').trim());
}

function romanSectionBreak(line) {
  const l = String(line || '').trim();
  return /^II\.|^III\.|^IV\.|^V\.\s+/i.test(l)
    || /^Soal\s+(Isian|Pilihan|Uraian)\b/i.test(l);
}

function romanSectionIdFromHeader(line) {
  const m = String(line || '').trim().match(/^(I{1,3}|IV|V)\./i);
  if (!m) return null;
  const map = { I: '一', II: '二', III: '三', IV: '四', V: '五' };
  return map[m[1].toUpperCase()] || null;
}

const SNAPSHOT_SECTION_RANK = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6 };
const SNAPSHOT_ROMAN_RANK = { I: 1, II: 2, III: 3, IV: 4, V: 5 };

function snapshotSectionOrderRank(item, lang = 'zh') {
  const labels = [
    item?.section_labels?.[lang],
    item?.section_label,
    item?.section_labels?.en,
    item?.section_labels?.zh,
    item?.section_labels?.id,
  ];
  for (const raw of labels) {
    if (!raw) continue;
    const roman = String(raw).trim().match(/^(I{1,3}|IV|V)\./i);
    if (roman) return SNAPSHOT_ROMAN_RANK[roman[1].toUpperCase()] ?? 99;
    const cn = String(raw).match(/^([一二三四五六])/);
    if (cn) return SNAPSHOT_SECTION_RANK[cn[1]] ?? 99;
  }
  if (item?.section && SNAPSHOT_SECTION_RANK[item.section]) return SNAPSHOT_SECTION_RANK[item.section];
  return 99;
}

export function sortSnapshotBySection(snapshot, lang = 'zh') {
  const sorted = [...snapshot].sort((a, b) => {
    const d = snapshotSectionOrderRank(a, lang) - snapshotSectionOrderRank(b, lang);
    return d !== 0 ? d : (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });
  return sorted.map((row, idx) => ({
    ...row,
    group_id: `q${String(idx + 1).padStart(2, '0')}`,
    sort_order: idx + 1,
  }));
}

function isRomanFillSectionHeader(line) {
  const l = String(line || '').trim();
  return /^I{1,3}V?\.\s+/i.test(l)
    && /fill|isian|blank|scripture/i.test(l)
    && !/multiple\s*choice|pilihan\s*ganda/i.test(l);
}

function isFillSectionHeader(line) {
  const l = String(line || '').trim();
  if (/^Soal\s+Isian\b/i.test(l)) return false;
  if (isRomanFillSectionHeader(l)) return true;
  return /^Isian\b/i.test(l);
}

function isIndonesianGeneralFillHeader(line) {
  return /^Soal\s+Isian\b/i.test(String(line || '').trim());
}

const ID_SECTION_END = /^Soal\s+(Isian|Pilihan|Uraian)\b|^II\.|^III\.|^IV\.|^V\.|^I{1,3}V?\.\s+/i;

function isEssaySectionInstruction(s) {
  const l = String(s || '').trim();
  if (!l || /^(\d+)[.、\s]/.test(l)) return false;
  return (/^请/.test(l) && /作答|简要|逻辑|言之有据|清楚/.test(l))
    || (/^Jawablah/i.test(l) && /singkat|jelas|logis/i.test(l));
}

function isSingleChoiceSectionHeader(line) {
  const l = String(line || '').trim();
  return /^[二三四五][、\s].*单选/.test(l)
    || /^[二三四五][、\s].*选择/.test(l)
    || /^三\s*单选题/.test(l)
    || /^三单选题/.test(l)
    || (/^I{1,3}V?\.\s+/i.test(l) && /multiple\s*choice|pilihan\s*ganda/i.test(l))
    || /^Soal\s+Pilihan\s+Ganda/i.test(l);
}

function singleChoiceSectionId(line) {
  const m = String(line || '').match(/^([二三四五])/);
  if (m) return m[1];
  if (/^Soal\s+Pilihan/i.test(String(line || ''))) return '三';
  return romanSectionIdFromHeader(line) || '二';
}

function looksLikeOptionsLine(line) {
  const s = String(line || '').trim();
  if (/^[A-D][.．]\s/.test(s)) return true;
  if (/\s[A-D][.．]\s/.test(s) && /\s[B-D][.．]\s/.test(s)) return true;
  return (/\bA[.．]/.test(s) || /^A[.．]/.test(s)) && parseInlineOptions(s).length >= 2;
}

function stripSingleChoiceStem(stem, options) {
  let s = String(stem || '').trim();
  s = s.replace(/^（\s*(?:[A-D])?\s*）\s*/, '').replace(/^\(\s*(?:[A-D])?\s*\)\s*/, '');
  s = s.replace(/^\d+[.、\s]+/, '').replace(/\s*\(\s*\)\s*/, ' ').trim();
  if (!options?.length) return s;
  const idx = s.search(/(?:^|[\s?？:：,.，])([A-D])[.．]\s/);
  if (idx >= 0) {
    const cut = s.slice(0, idx).trim();
    if (cut.length > 8) return cut;
  }
  return s.replace(/\s*[A-D][.．].*$/s, '').trim();
}

function readSingleChoiceOptions(lines, startIdx, promptLine) {
  const l = promptLine;
  if (/\bA[.．]/.test(l)) {
    const options = parseInlineOptions(l);
    if (options.length >= 2) return { options, next: startIdx };
  }
  const next = lines[startIdx + 1] || '';
  if (/^[A-D][.．]\s/.test(next) && !/^（/.test(next) && !/\s[B-D][.．]\s/.test(next)) {
    let j = startIdx + 1;
    const options = [];
    while (j < lines.length && /^[A-D][.．]\s/.test(lines[j]) && !/^（/.test(lines[j]) && !/\s[B-D][.．]\s/.test(lines[j])) {
      const om = lines[j].match(/^([A-D])[.．]\s*(.*)$/);
      if (om) options.push(om[2].trim());
      j++;
    }
    if (options.length >= 2) return { options, next: j - 1 };
  }
  if (looksLikeOptionsLine(next)) {
    const options = parseInlineOptions(next);
    if (options.length >= 2) {
      return {
        options,
        next: startIdx + 1,
        continuation: String(next).trim() === String(lines[startIdx + 1] || '').trim() ? '' : undefined,
      };
    }
  }
  let combined = l;
  for (let j = startIdx + 1; j < lines.length && j <= startIdx + 8; j++) {
    const line = String(lines[j] || '').trim();
    if (!line) continue;
    if (/^\d+[.、\s]+.*\(\s*\)/.test(line) || romanSectionBreak(line)) break;
    if (looksLikeOptionsLine(line)) {
      const options = parseInlineOptions(line);
      if (options.length >= 2) {
        return { options, next: j, continuation: lines.slice(startIdx + 1, j).join(' ').trim() };
      }
    }
    combined += ` ${line}`;
    const options = parseInlineOptions(combined);
    if (options.length >= 2) {
      return { options, next: j, continuation: lines.slice(startIdx + 1, j).join(' ').trim() };
    }
  }
  return { options: [], next: startIdx };
}

/** 单选题：支持（A）题干 与 编号题干+分行选项（如马可福音第三大题） */
function parseSingleChoiceSection(lines, startIdx, hdr, sectionId) {
  const perQ = essayScoreFromHeader(hdr, 'short') || 2;
  const questions = [];
  let i = startIdx;
  while (i < lines.length) {
    const l = String(lines[i] || '').trim();
    if (!l) { i++; continue; }
    if (/^[一二三四五][、\s]/.test(l) && /题/.test(l)) break;
    if (romanSectionBreak(l)) break;

    const ansM = l.match(/^（\s*([A-D])\s*）/)
      || l.match(/^\(\s*([A-D])\s*\)/)
      || l.match(/^\d+[.、\s]+（\s*([A-D])\s*）/)
      || l.match(/^\d+[.、\s]+\(\s*([A-D])\s*\)/);
    const examM = !ansM && (/^（\s*）/.test(l) || /^\d+[.、\s]+.*\(\s*\)/.test(l));
    const numM = !ansM && !examM && /^\d+[.、\s]+/.test(l);
    if (!ansM && !examM && !numM) { i++; continue; }

    let prompt = l
      .replace(/^（\s*(?:[A-D])?\s*）\s*/, '')
      .replace(/^\(\s*(?:[A-D])?\s*\)\s*/, '')
      .trim()
      .replace(/^\d+[.、\s]+/, '')
      .replace(/\s*\(\s*\)\s*$/, '')
      .trim();
    let { options, next, continuation } = readSingleChoiceOptions(lines, i, l);
    if (continuation) prompt = `${prompt} ${continuation}`.trim();
    if (options.length < 2 && i + 1 < lines.length) {
      let j = i + 1;
      let combined = l;
      while (j < lines.length && !romanSectionBreak(lines[j]) && !/^\d+[.、\s]+.*\(\s*\)/.test(lines[j])) {
        combined += ` ${lines[j]}`;
        const tryOpts = parseInlineOptions(combined);
        if (tryOpts.length >= 2) {
          options = tryOpts;
          prompt = stripSingleChoiceStem(combined, tryOpts);
          next = j;
          break;
        }
        j++;
      }
    }
    i = next;
    if (options.length >= 2) {
      prompt = stripSingleChoiceStem(prompt, options);
      const q = {
        type: 'single',
        prompt,
        options,
        score: perQ,
        section: sectionId,
        section_label: String(hdr || '').trim(),
      };
      if (ansM) {
        q.answer_index = { A: 0, B: 1, C: 2, D: 3 }[ansM[1]];
      } else {
        q.needs_answer_key = true;
      }
      questions.push(q);
    }
    i++;
  }
  return { questions, next: i };
}

function isEssaySectionHeader(line) {
  const l = String(line || '').trim();
  if (/简答题/.test(l) && !/论述题/.test(l)) return true;
  return /^I{1,3}V?\.\s+/i.test(l) && /Short Answer|Pertanyaan\s+Esai|Essay Questions|Jawaban\s+Singkat|Tanya\s+Jawab/i.test(l);
}

function isLongEssaySectionHeader(line) {
  const l = String(line || '').trim();
  return /论述题/.test(l)
    || /^V\.\s+Essay/i.test(l)
    || /^V\.\s+Soal\s+Uraian/i.test(l)
    || /^V\.\s+Uraian/i.test(l)
    || /^Soal\s+Uraian/i.test(l);
}

function essaySectionId(line) {
  const secM = String(line || '').match(/^([一二三四五])/);
  if (secM) return secM[1];
  if (/^Soal\s+Uraian/i.test(String(line || ''))) return '四';
  return romanSectionIdFromHeader(line) || '四';
}

/** 英文判断题：1. statement ( ✓ ) */
function parseEnglishTrueFalseSection(lines, startIdx, hdr, sectionId) {
  const perQ = essayScoreFromHeader(hdr, 'short') || 1;
  const questions = [];
  let i = startIdx;
  while (i < lines.length) {
    const l = String(lines[i] || '').trim();
    if (!l) { i++; continue; }
    if (romanSectionBreak(l) && i > startIdx) break;
    const m = l.match(/^(\d+)[.、\s]+(.+?)\s*\(\s*([✓√×xX✗]?)\s*\)\s*$/);
    if (m) {
      const q = {
        type: 'truefalse',
        prompt: m[2].trim(),
        score: perQ,
        section: sectionId,
        section_label: String(hdr || '').trim(),
      };
      if (m[3]) q.answer_bool = m[3] === '✓' || m[3] === '√';
      else q.needs_answer_key = true;
      questions.push(q);
    }
    i++;
  }
  return { questions, next: i };
}

/** 简答/论述：题干与【】参考答案分行或分块；短行得分点并入 reference */
function parseEssayBlock(lines, startIdx, hdr, section, essayKind) {
  const perQ = essayScoreFromHeader(hdr, essayKind);
  const questions = [];
  let i = startIdx;
  let curPrompt = null;
  let curRef = '';
  let curScore = perQ;
  let sectionLabel = String(hdr || '').replace(/^【/, '').trim();

  const finish = () => {
    if (!curPrompt) return;
    const ref = curRef.trim();
    questions.push({
      type: 'essay',
      prompt: curPrompt,
      reference: ref || undefined,
      score: curScore,
      section,
      section_label: sectionLabel,
      essay_kind: essayKind,
    });
    curPrompt = null;
    curRef = '';
    curScore = perQ;
  };

  while (i < lines.length) {
    const l = String(lines[i] || '').trim();
    if (!l) { i++; continue; }
    if (/^[一二三四五六][、\s]/.test(l) && /题/.test(l)) break;
    if (romanSectionBreak(l) && i > startIdx) break;
    if (/简答题/.test(l) && i > startIdx) break;
    if (/论述题/.test(l) && i > startIdx && !String(hdr).includes(l.slice(0, 8))) break;

    if (curPrompt && /^【/.test(l)) {
      const refLines = [l];
      i++;
      while (i < lines.length && !refLines[refLines.length - 1].endsWith('】')) {
        refLines.push(String(lines[i] || '').trim());
        i++;
      }
      const ref = bracketReferenceText(refLines);
      if (ref) curRef = curRef ? `${curRef}\n${ref}` : ref;
      continue;
    }

    if (isBracketReferenceLine(l)) {
      const ref = bracketReferenceText(l);
      if (curPrompt && ref) curRef = curRef ? `${curRef}\n${ref}` : ref;
      i++;
      continue;
    }

    if (isEssaySectionInstruction(l)) {
      sectionLabel += l;
      i++;
      continue;
    }

    if (/默写/.test(l) && i + 1 < lines.length && /【【/.test(lines[i + 1])) {
      const dict = parseDictationRecitation(l, lines[i + 1], hdr, perQ);
      if (dict) {
        questions.push(dict);
        i += 2;
        continue;
      }
    }

    const numM = l.match(/^(\d+)[.、\s]+(.+)$/);
    if (numM && numM[2].length > 2) {
      finish();
      let prompt = numM[2].trim();
      const scoreM = prompt.match(/（\s*(\d+(?:\.\d+)?)\s*分\s*）\s*$/)
        || prompt.match(/\(\s*(\d+(?:\.\d+)?)\s*points?\s*\)\s*$/i);
      if (scoreM) {
        curScore = +scoreM[1];
        prompt = prompt.replace(/（\s*\d+(?:\.\d+)?\s*分\s*）\s*$/, '').trim();
      } else {
        curScore = perQ;
      }
      curPrompt = prompt;
      i++;
      continue;
    }

    if (/^\(Syarat:/i.test(l)) {
      i++;
      continue;
    }

    if (curPrompt && !/^\d+[.、\s]+/.test(l) && /^[""“「']/.test(l)) {
      curPrompt = `${curPrompt}\n${l}`;
      i++;
      continue;
    }

    if (looksLikeEssayQuestion(l)) {
      finish();
      curPrompt = l;
      i++;
      continue;
    }

    if (curPrompt && l.length <= 8 && !looksLikeEssayQuestion(l)) {
      curRef = curRef ? `${curRef}\n${l}` : l;
      i++;
      continue;
    }

    i++;
  }
  finish();
  return { questions, next: i };
}

/** 纯简答题卷（如使徒行传） */
export function parseEssayOnlyExamText(lines) {
  const idx = lines.findIndex((l) => isEssaySectionHeader(l) || /^Short Answer Questions/i.test(l));
  const hdrLine = idx >= 0 ? lines[idx] : '简答题（每题10分）';
  const block = parseEssayBlock(lines, idx >= 0 ? idx + 1 : 0, hdrLine, essaySectionId(hdrLine), 'short');
  return block.questions.map((q, idx) => ({ ...q, id: idx + 1 }));
}

/** 神学院课程卷（希伯来书等）：经文填空【】、单选（ ）、判断、简答、论述 */
export function parseCourseExamText(lines) {
  const questions = [];
  let qid = 1;
  let i = 0;

  const sectionScore = (hdr, fallback) => {
    const m = hdr.match(/每题\s*([0-9.]+)分/) || hdr.match(/每空\s*([0-9.]+)分/);
    if (m) return +m[1];
    const en = String(hdr || '').match(/(\d+(?:\.\d+)?)\s*points?\s*each/i);
    if (en) return +en[1];
    const idBlank = String(hdr || '').match(/[Ss]etiap\s+isian\s+([0-9.]+)/i);
    if (idBlank) return +idBlank[1];
    const idQ = String(hdr || '').match(/[Ss]etiap\s+soal\s+([0-9.]+)/i);
    if (idQ) return +idQ[1];
    return fallback;
  };

  const pushQs = (qs) => {
    for (const q of qs) {
      q.id = qid++;
      questions.push(q);
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    if (isEssaySectionHeader(line) && !/^一[、\s]/.test(line) && !/^I\.\s+/i.test(line)) {
      const hdr = line;
      const block = parseEssayBlock(lines, i + 1, hdr, essaySectionId(hdr), 'short');
      pushQs(block.questions);
      i = block.next;
      continue;
    }

    if (/^简答题/.test(line)) {
      const legacy = parseEssayOnlyExamText(lines.slice(i));
      return legacy.map((q, idx) => ({ ...q, id: idx + 1 }));
    }

    if (/^一[、\s].*填空/.test(line) || /^一、填空题/.test(line)) {
      const hdr = line;
      const perBlank = sectionScore(line, 1);
      const block = parseFillSection(lines, i + 1, hdr, /^二[、\s]/, perBlank, '一');
      pushQs(block.questions);
      i = block.next;
      continue;
    }

    if (isFillSectionHeader(line)) {
      const hdr = line;
      const sectionId = romanSectionIdFromHeader(line) || '一';
      const perBlank = sectionScore(line, +(line.match(/(\d+(?:\.\d+)?)\s*point/i)?.[1] || 0.5));
      const block = parseFillSection(
        lines, i + 1, hdr,
        ID_SECTION_END,
        perBlank, sectionId,
      );
      pushQs(block.questions);
      i = block.next;
      continue;
    }

    if (isIndonesianGeneralFillHeader(line)) {
      const hdr = line;
      const perBlank = sectionScore(line, 2);
      const block = parseFillSection(
        lines, i + 1, hdr,
        /^Soal\s+Pilihan\b|^Soal\s+Uraian\b|^III\.|^IV\.|^V\./i,
        perBlank, '二',
      );
      pushQs(block.questions);
      i = block.next;
      continue;
    }

    if (/^二[、\s].*填空/.test(line)) {
      const hdr = line;
      const perBlank = sectionScore(line, 1);
      const structured = parseStructuredFillSection(lines, i + 1, hdr, /^三[、\s]/, perBlank, '二');
      if (structured?.questions?.length) {
        pushQs(structured.questions);
        i = structured.next;
      } else {
        const block = parseFillSection(lines, i + 1, hdr, /^三[、\s]/, perBlank, '二');
        pushQs(block.questions);
        i = block.next;
      }
      continue;
    }

    if (isSingleChoiceSectionHeader(line)) {
      const hdr = line;
      const block = parseSingleChoiceSection(lines, i + 1, hdr, singleChoiceSectionId(hdr));
      pushQs(block.questions);
      i = block.next;
      continue;
    }

    if (isLongEssaySectionHeader(line)) {
      const hdr = line;
      const block = parseEssayBlock(lines, i + 1, hdr, essaySectionId(hdr), 'long');
      pushQs(block.questions);
      i = block.next;
      continue;
    }

    if (/^III\.\s+/i.test(line) && /true|benar|salah/i.test(line)) {
      const hdr = line;
      const block = parseEnglishTrueFalseSection(lines, i + 1, hdr, '三');
      pushQs(block.questions);
      i = block.next;
      continue;
    }

    if (/^三、判断/.test(line)) {
      const hdr = line;
      const perQ = sectionScore(line, 1);
      i++;
      while (i < lines.length && !/^四[、\s【]/.test(lines[i]) && !/简答题/.test(lines[i]) && !/^五[、\s]/.test(lines[i])) {
        const l = lines[i];
        const ansM = l.match(/^（\s*([✓√×xX])\s*）/) || l.match(/（\s*([✓√×xX])\s*）\s*$/);
        const examM = !ansM && /^（\s*）/.test(l);
        if (ansM || examM || (/[✓√×]/.test(l) && !/^三、/.test(l))) {
          const prompt = l
            .replace(/^（\s*(?:[✓√×xX])?\s*）\s*/, '')
            .replace(/（\s*(?:[✓√×xX])\s*）\s*$/, '')
            .trim();
          const q = { id: qid++, type: 'truefalse', prompt, score: perQ, section: '三', section_label: hdr };
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

    if (/论述题/.test(line) && !/^V\.\s+/i.test(line)) {
      const hdr = line;
      const secM = line.match(/([一二三四五])/);
      const block = parseEssayBlock(lines, i + 1, hdr, secM ? secM[1] : '五', 'long');
      pushQs(block.questions);
      i = block.next;
      if (/^五、论述/.test(line)) break;
      continue;
    }

    i++;
  }

  if (!questions.length) {
    const hdr = lines.find((l) => /fill|isian|blank|填空/i.test(l)) || 'Fill-in';
    const perBlank = 1;
    for (const l of lines) {
      const parsed = parseLineBracketFills(l);
      if (parsed) {
        questions.push({
          id: qid++,
          type: 'fill',
          prompt: parsed.prompt,
          answers: parsed.answers,
          score: parsed.answers.length * perBlank,
          section: '一',
          section_label: hdr,
        });
      }
    }
  }

  return questions;
}

function parseInlineOptions(line) {
  const s = String(line || '');
  const glued = s.split(/(?=[A-D]\.)/).map((chunk) => chunk.trim()).filter(Boolean);
  const fromSplit = [];
  for (const chunk of glued) {
    const m = chunk.match(/^([A-D])\.\s*(.+)$/s);
    if (m) fromSplit.push(m[2].trim());
  }
  if (fromSplit.length >= 2) return fromSplit;

  const opts = [];
  const dotRe = /(?:^|[\s:])([A-D])\.\s*(.+?)(?=(?:[\s:][A-D]\.)|$)/g;
  let m;
  while ((m = dotRe.exec(s))) opts.push(m[2].trim());
  if (opts.length >= 2) return opts;
  const re = /(?:^|\s)([A-D])\s+(.+?)(?=(?:\s+[A-D]\s+)|$)/g;
  while ((m = re.exec(s))) opts.push(m[2].trim());
  if (opts.length >= 2) return opts;
  for (const L of ['A', 'B', 'C', 'D']) {
    const om = s.match(new RegExp(`\\b${L}\\s+(.+?)(?=\\s+[A-D]\\s+|$)`));
    if (om) opts.push(om[1].trim());
  }
  return opts;
}

export function detectExamFormat(lines) {
  const all = lines.join('\n');
  const head = lines.slice(0, 20).join('\n');
  const sample = lines.slice(0, 40).join('\n');
  if (/^简答题/.test(lines[0] || '') || lines.some((l) => /^简答题/.test(l))) return 'essay_only';
  if (lines.some((l) => /^Short Answer Questions/i.test(l))) return 'essay_only';
  if (/二、诗篇小标题|II\.\s*Psalm Superscriptions/i.test(all)) return 'psalms';
  if (/旧约部分|新约部分|\{[^}]+\}/.test(all)) return 'recruitment';
  if (/^一、填空题/.test(head) && !/_{3,}|【/.test(sample)) return 'recruitment';
  if (/一[、\s].*填空|一、经文填空|二、单项选择题|【\s*】|_{3,}/.test(head + sample)) return 'course';
  if (/^I{1,3}\.\s+/i.test(head) && /fill|isian|blank/i.test(head + sample)) return 'course';
  if (/【[^】]+】/.test(sample)) return 'course';
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
    if (q.blank_labels?.length) loc.blank_labels = q.blank_labels;
    if (q.fill_layout) loc.fill_layout = q.fill_layout;
    if (q.table_headers) loc.table_headers = q.table_headers;
    if (q.table_rows) loc.table_rows = q.table_rows.map((r) => ({ label: r.label }));
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
    loc.answer_key = q.reference ? { reference: q.reference } : {};
  }
  return loc;
}

export function legacyListToSnapshot(questions, lang) {
  const snap = questions.map((q, idx) => {
    const row = {
      group_id: `q${String(idx + 1).padStart(2, '0')}`,
      sort_order: idx + 1,
      type: q.type,
      section: q.section || 'A',
      score: q.score || 0,
      locales: { [lang]: legacyToLocale(q) },
    };
    if (q.section_label) {
      row.section_label = q.section_label;
      row.section_labels = { [lang]: q.section_label };
    }
    if (q.essay_kind) row.essay_kind = q.essay_kind;
    if (q.type === 'fill') {
      if (q.fill_layout === 'table' && q.table_rows?.length) {
        row.blank_count = q.table_rows.length;
      } else if (q.blank_labels?.length) {
        row.blank_count = q.blank_labels.length;
      } else {
        const stem = String(q.prompt || '');
        const fromStem = (stem.match(/____/g) || []).length;
        const fromAns = Array.isArray(q.answers) ? q.answers.filter((a) => String(a).trim()).length : 0;
        row.blank_count = Math.max(1, fromStem, fromAns);
      }
    }
    return row;
  });
  return normalizeSnapshotBracketQuestions(snap);
}

export function mergeSnapshotsByIndex(parts) {
  // parts: [{ lang, snapshot }]
  const map = new Map();
  for (const { lang, snapshot } of parts) {
    snapshot.forEach((item, idx) => {
      const key = item.group_id || `q${idx + 1}`;
      if (!map.has(key)) {
        map.set(key, { ...item, group_id: key, sort_order: idx + 1, locales: {}, section_labels: {} });
      }
      const row = map.get(key);
      row.locales[lang] = item.locales[lang] || item.locales[Object.keys(item.locales)[0]];
      if (!row.type) row.type = item.type;
      if (!row.score) row.score = item.score;
      const secLbl = item.section_label || item.section_labels?.[lang];
      if (secLbl) row.section_labels[lang] = secLbl;
      if (!row.section_label && item.section_label) row.section_label = item.section_label;
    });
  }
  return [...map.values()].sort((a, b) => a.sort_order - b.sort_order);
}

/** 按 section:type:序号 对齐多语言卷面；排序以中文卷为准，仅附加无中文对应的英文题 */
export function mergeSnapshotsByAlign(parts) {
  const basePart = parts.find((p) => p.lang === 'zh') || parts[0];
  const annotate = (snapshot) => {
    const ctr = {};
    return snapshot.map((item) => {
      const k = `${item.section || ''}:${item.type}`;
      const ord = (ctr[k] = (ctr[k] || 0) + 1);
      return { ...item, _align: `${k}:${ord}` };
    });
  };
  const byLang = new Map();
  for (const { lang, snapshot } of parts) {
    const m = new Map();
    annotate(snapshot).forEach((q) => m.set(q._align, q));
    byLang.set(lang, m);
  }
  const usedAligns = new Set();
  const attachLocale = (row, lang, sq) => {
    if (!sq) return;
    row.locales[lang] = sq.locales[lang] || sq.locales[Object.keys(sq.locales)[0]];
    const secLbl = sq.section_label || sq.section_labels?.[lang];
    if (secLbl) row.section_labels[lang] = secLbl;
    if (!row.type && sq.type) row.type = sq.type;
    if (sq.score) row.score = Math.max(Number(row.score) || 0, Number(sq.score));
    if (!row.essay_kind && sq.essay_kind) row.essay_kind = sq.essay_kind;
    if (!row.section && sq.section) row.section = sq.section;
    if (sq.blank_count) row.blank_count = Math.max(Number(row.blank_count) || 0, Number(sq.blank_count));
    if (!row.section_label && sq.section_label) row.section_label = sq.section_label;
  };

  const merged = annotate(basePart.snapshot).map((bq) => {
    usedAligns.add(bq._align);
    const row = {
      group_id: bq.group_id,
      sort_order: bq.sort_order,
      type: bq.type,
      section: bq.section,
      score: bq.score,
      section_label: bq.section_label,
      essay_kind: bq.essay_kind,
      blank_count: bq.blank_count,
      locales: {},
      section_labels: bq.section_labels ? { ...bq.section_labels } : {},
    };
    for (const { lang } of parts) {
      attachLocale(row, lang, byLang.get(lang)?.get(bq._align));
    }
    return row;
  });

  const extras = [];
  for (const { lang, snapshot } of parts) {
    if (lang === basePart.lang) continue;
    annotate(snapshot).forEach((sq) => {
      if (usedAligns.has(sq._align)) return;
      usedAligns.add(sq._align);
      const row = {
        type: sq.type,
        section: sq.section,
        score: sq.score,
        section_label: sq.section_label,
        essay_kind: sq.essay_kind,
        blank_count: sq.blank_count,
        locales: {},
        section_labels: sq.section_labels ? { ...sq.section_labels } : {},
      };
      attachLocale(row, lang, sq);
      extras.push(row);
    });
  }

  return sortSnapshotBySection(
    [...merged, ...extras].map((row, idx) => ({
      ...row,
      group_id: row.group_id || `q${String(idx + 1).padStart(2, '0')}`,
      sort_order: row.sort_order ?? idx + 1,
    })),
    basePart.lang,
  );
}

export async function docxFileToSnapshot(file, lang) {
  const buf = await file.arrayBuffer();
  const lines = await extractDocxLines(buf);
  const fmt = detectExamFormat(lines);
  if (fmt === 'psalms') {
    throw new Error('已识别为诗篇卷格式。请使用教师端「加载内置：诗篇（中英）」一键导入，或分别上传中/英卷后合并保存。');
  }
  const legacy = fmt === 'course' ? parseCourseExamText(lines)
    : fmt === 'essay_only' ? parseEssayOnlyExamText(lines)
      : parseExamPlainText(lines);
  if (!legacy.length) {
    throw new Error('未能识别题目。支持：①课程卷 ②诗篇卷（用内置加载）③招生卷');
  }
  const snapshot = legacyListToSnapshot(legacy, lang);
  const needsAnswerKey = legacy.filter((q) => q.needs_answer_key).length;
  return { snapshot, format: fmt, needsAnswerKey };
}
