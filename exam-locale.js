/**
 * 英文 / 印尼文试卷解析，与中文 buildExamQuestionsFromText 产出顺序对齐（103 题）。
 * 填空标准答案与默写参考译文单独维护（试卷为考生版无括号答案）。
 */
(function () {
  'use strict';

  function parseLetterItems(str) {
    const cleaned = String(str || '').replace(/\s+/g, ' ').trim();
    if (!cleaned) return {};
    const re = /([A-Z])\.\s*/g;
    let m;
    const parts = [];
    while ((m = re.exec(cleaned))) {
      parts.push({ letter: m[1], valueStart: re.lastIndex, keyIndex: m.index });
    }
    if (parts.length === 0) return {};
    const map = {};
    for (let i = 0; i < parts.length; i++) {
      const letter = parts[i].letter;
      const start = parts[i].valueStart;
      const end = i + 1 < parts.length ? parts[i + 1].keyIndex : cleaned.length;
      map[letter] = cleaned.slice(start, end).trim();
    }
    return map;
  }

  function normFill(s) {
    return String(s || '')
      .replace(/\s{3,}/g, ' ____ ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 英文填空标准答案：按试卷英文版空缺顺序，措辞依据 ESV（English Standard Version）
  // 注：英文卷创1:26 句仅 3 个空（likeness / fish / birds），与中文卷 4 空不同，答题时以英文卷为准。
  var FILL_ANSWERS_EN = [
    ['creation', 'the fall', "Noah's flood", 'the tower of Babel'],
    ['likeness', 'the fish of the sea', 'the birds of the heavens'],
    ['head', 'heel'],
    ['Jacob'],
    ['Abraham', 'Isaac', 'Jacob', 'Egypt'],
    ['Levi', 'Levi'],
    ['I AM WHO I AM'],
    ['afflict yourselves', 'atonement', 'afflict yourselves'],
    ['life', 'to atone', 'atonement', 'the life'],
    ['Mount Gerizim', 'Mount Ebal'],
    ['Joshua', 'Caleb'],
    ['father', 'son', 'Saul', 'house', 'kingdom'],
    ['Judges', '1 Samuel'],
    ['Repent'],
    ['perfect', 'perfect'],
    ['give his life', 'ransom'],
    ['Abraham', 'lost'],
    ['All that the Father gives me', 'cast out'],
    ['Jerusalem', 'all Judea', 'Samaria', 'the end of the earth'],
    ['peace', 'the glory of God'],
    ['died to sin'],
    ['the word of the cross'],
    ['knowledge', 'knowledge', 'love'],
    ['comforts', 'affliction', 'comfort', 'affliction', 'comfort', 'comforted'],
    ['the god of this world'],
    ['faithfulness'],
    ['law', 'law'],
    ['calling', 'inheritance', 'power'],
    ['image', 'firstborn'],
    ['faith', 'love', 'hope'],
    ['rebellion'],
    ['revelation', 'soon take place'],
  ];

  // 印尼文填空：按试卷印尼文版空缺顺序，措辞依据 Alkitab TB2（Terjemahan Baru Kedua）
  var FILL_ANSWERS_ID = [
    ['penciptaan', 'kejatuhan', 'air bah Nuh', 'peristiwa menara Babel'],
    ['gambar', 'rupa', 'ikan di laut', 'burung di udara'],
    ['kepala', 'tumit'],
    ['Yakub'],
    ['Abraham', 'Ishak', 'Yakub', 'Mesir'],
    ['Lewi', 'Lewi'],
    ['AKULAH AKU'],
    ['merendahkan diri', 'pendamaian', 'merendahkan diri'],
    ['nyawa', 'pendamaian', 'nyawa', 'pendamaian'],
    ['gunung Gerizim', 'gunung Ebal'],
    ['Yosua', 'Kaleb'],
    ['Bapa', 'anak', 'Saul', 'rumah', 'kerajaan'],
    ['Hakim-hakim', '1 Samuel'],
    ['bertobat'],
    ['sempurna', 'sempurna'],
    ['nyawa', 'tebusan'],
    ['Abraham', 'hilang'],
    ['usir'],
    ['Yerusalem', 'Yudea', 'Samaria', 'ujung bumi'],
    ['damai', 'kemuliaan Allah'],
    ['mati dalam dosa'],
    ['pemberitaan salib'],
    ['pengetahuan', 'pengetahuan', 'kasih'],
    ['menghibur', 'penderitaan', 'penghiburan'],
    ['allah dunia ini'],
    ['kesetiaan'],
    ['hukum Taurat', 'hukum Taurat'],
    ['panggilan', 'warisan', 'kuasa'],
    ['gambar', 'anak sulung'],
    ['iman', 'kasih', 'pengharapan'],
    ['pembangkangan'],
    ['wahyu', 'harus segera terjadi'],
  ];

  // 默写阅卷用全文：英文为 ESV；印尼文为 TB2（与试卷 TB 标注一致，措辞按 Terjemahan Baru Kedua 校对）
  var DICT_EXPECTED_EN = [
    'Genesis 12:1-3 Now the LORD said to Abram, "Go from your country and your kindred and your father\'s house to the land that I will show you. And I will make of you a great nation, and I will bless you and make your name great, so that you will be a blessing. I will bless those who bless you, and him who dishonors you I will curse, and in you all the families of the earth shall be blessed."',
    'Exodus 34:6-7 The LORD passed before him and proclaimed, "The LORD, the LORD, a God merciful and gracious, slow to anger, and abounding in steadfast love and faithfulness, keeping steadfast love for thousands, forgiving iniquity and transgression and sin, but who will by no means clear the guilty, visiting the iniquity of the fathers on the children and the children\'s children, to the third and the fourth generation."',
    'Proverbs 1:7 The fear of the LORD is the beginning of knowledge; fools despise wisdom and instruction.',
    'Isaiah 53:4-5 Surely he has borne our griefs and carried our sorrows; yet we esteemed him stricken, smitten by God, and afflicted. But he was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed.',
    'Malachi 4:5-6 "Behold, I will send you Elijah the prophet before the great and awesome day of the LORD comes. And he will turn the hearts of fathers to their children and the hearts of children to their fathers, lest I come and strike the land with a decree of utter destruction."',
    'Mark 1:14-15 Now after John was arrested, Jesus came into Galilee, proclaiming the gospel of God, and saying, "The time is fulfilled, and the kingdom of God is at hand; repent and believe in the gospel."',
    'John 14:6 Jesus said to him, "I am the way, and the truth, and the life. No one comes to the Father except through me."',
    'Romans 5:7-8 For one will scarcely die for a righteous person—though perhaps for a good person one would dare even to die—but God shows his love for us in that while we were still sinners, Christ died for us.',
    'Galatians 2:20 I have been crucified with Christ. It is no longer I who live, but Christ who lives in me. And the life I now live in the flesh I live by faith in the Son of God, who loved me and gave himself for me.',
    'Hebrews 8:1-2 Now the point in what we are saying is this: we have such a high priest, one who is seated at the right hand of the throne of the Majesty in heaven, a minister in the holy places, in the true tent that the Lord set up, not man.',
  ];

  var DICT_EXPECTED_ID = [
    'Kejadian 12:1-3 Berfirmanlah TUHAN kepada Abram: "Pergilah dari negerimu dan dari sanak saudaramu dan dari rumah bapamu ini ke negeri yang akan Kutunjukkan kepadamu; dan Aku akan membuat engkau menjadi bangsa yang besar, dan memberkati engkau serta membuat namamu masyhur, dan engkau akan menjadi berkat. Aku akan memberkati orang-orang yang memberkati engkau, dan siapa yang mengutuk engkau, akan Kutukai; dan olehmu semua bangsa di bumi akan mendapat berkat."',
    'Keluaran 34:6-7 TUHAN berlalu di depannya dan berseru: "TUHAN, TUHAN, Allah yang penyayang dan pengasih, yang panjang sabar, berlimpah kasih setia dan setia, yang pemelihara kasih setia beribu-ribu, yang mengampuni kesalahan, pelanggaran, dan dosa; tetapi yang tidak memandang bersih orang yang bersalah, yang menjenguk kesalahan bapa kepada anak-anak dan cucu-cucunya, sampai keturunan yang ketiga dan keempat."',
    'Amsal 1:7 Takut akan TUHAN adalah permulaan pengetahuan, tetapi orang bodoh menghina hikmat dan didikan.',
    'Yesaya 53:4-5 Sesungguhnya, penyakit kita yang dipikul-Nya dan kesedihan kita yang dibawa-Nya, padahal kita mengira Dia disebab, dipukul dan ditindas oleh Allah. Tetapi Dia terluka karena pemberontakan kita, Dia remuk karena kesalahan kita; hukuman yang mendatangkan keselamatan bagi kita ditimpakan kepada-Nya, dan oleh bilur-bilur-Nya kita menjadi sembuh.',
    'Maleakhi 4:5-6 "Sesungguhnya, Aku akan mengutus nabi Elia kepadamu sebelum datangnya hari TUHAN yang besar dan dahsyat itu. Dan ia akan membuat hati bapa-bapa berbalik kepada anak-anak, dan hati anak-anak kepada bapa-bapa."',
    'Markus 1:14-15 Sesudah Yohanes ditangkap, Yesus pergi ke Galilea memberitakan Injil kerajaan Allah, kata-Nya: "Waktu sudah genap, kerajaan Allah sudah dekat, bertobatlah dan percayalah kepada Injil!"',
    'Yohanes 14:6 Kata Yesus kepadanya: "Akulah jalan dan kebenaran dan hidup. Tidak ada seorang pun yang datang kepada Bapa, jika tidak melalui Aku."',
    'Roma 5:7-8 Sungguh, hampir tidak ada orang yang mau mati untuk orang benar, barangkali ada yang berani mati untuk orang yang baik. Tetapi Allah menunjukkan kasih-Nya kepada kita, oleh karena Kristus telah mati untuk kita, ketika kita masih berdosa.',
    'Galatia 2:20 Aku telah disalibkan dengan Kristus dan aku hidup, bukan lagi aku sendiri, melainkan Kristus yang hidup di dalam aku. Dan aku hidup di dalam tubuh ini oleh iman dalam Anak Allah yang telah mengasihi aku dan menyerahkan diri-Nya untuk aku.',
    'Ibrani 8:1-2 Inti dari apa yang kita katakan ialah: kita mempunyai Imam Besar yang duduk di sebelah kanan takhta Yang Mahamulia di sorga, sebagai pelayan tempat kudus dan kemah yang benar, yang didirikan oleh TUHAN, bukan oleh manusia.',
  ];

  function parseEnExam(lines) {
    const out = [];
    let i = 0;
    let section = null;

    function at(r) {
      return i < lines.length && r.test(lines[i]);
    }

    function flushFill(buf) {
      if (buf) out.push({ type: 'fill', prompt: normFill(buf) });
    }

    function parseFill(stopRe) {
      let buf = '';
      while (i < lines.length && !stopRe.test(lines[i])) {
        const l = lines[i];
        const isNew =
          /^\d+\.\s/.test(l) ||
          /^\d+\s+[A-Za-z"“]/.test(l) ||
          /^•\s/.test(l) ||
          /^•/.test(l);
        if (isNew) {
          flushFill(buf);
          buf = l.replace(/^•\s*/, '').replace(/^•/, '');
        } else if (buf) buf += ' ' + l;
        i++;
      }
      flushFill(buf);
    }

    function parseSingle(stopRe) {
      while (i < lines.length && !stopRe.test(lines[i])) {
        const l = lines[i];
        if (!/^\d+\./.test(l)) {
          i++;
          continue;
        }
        let ans = null;
        const mParen = l.match(/（([A-D])）/);
        if (mParen) ans = mParen[1];
        else {
          const mE = l.match(/\s([A-D])\s*$/);
          if (mE) ans = mE[1];
        }
        let prompt = '';
        let options = ['', '', '', ''];
        if (l.includes('A.') && l.includes('B.') && l.includes('C.') && l.includes('D.')) {
          const startA = l.indexOf('A.');
          prompt = l
            .slice(0, startA)
            .replace(/^\d+\.\s*/, '')
            .replace(/（[A-D]）/g, '')
            .trim();
          const optMap = parseLetterItems(l.slice(startA));
          options = ['A', 'B', 'C', 'D'].map((L) => optMap[L] || '');
        } else {
          prompt = l
            .replace(/^\d+\.\s*/, '')
            .replace(/（[A-D]）/g, '')
            .replace(/\s+[A-D]\s*$/, '')
            .trim();
          let j = i + 1;
          let optStr = '';
          while (j < lines.length && !/^\d+\./.test(lines[j]) && !stopRe.test(lines[j])) {
            if (/[A-D]\./.test(lines[j])) optStr += (optStr ? ' ' : '') + lines[j];
            j++;
          }
          const optMap = parseLetterItems(optStr);
          options = ['A', 'B', 'C', 'D'].map((L) => optMap[L] || '');
          i = j - 1;
        }
        out.push({ type: 'single', prompt, options, answer_index: ans ? { A: 0, B: 1, C: 2, D: 3 }[ans] : 0 });
        i++;
      }
    }

    function parseMatchOt() {
      const promptBits = [];
      while (i < lines.length && !/^\(\s*\)\s*\d+\./.test(lines[i])) {
        const pl = lines[i];
        if (!/^Sons of Jacob$|^Content of the prophecy$/i.test(pl)) promptBits.push(pl);
        i++;
      }
      const left = [];
      const right = {};
      while (i < lines.length && !/^IV\.\s*True or False/i.test(lines[i])) {
        const l = lines[i];
        const mL = l.match(/^\(\s*\)\s*\d+\.\s*(.+)$/);
        if (mL) left.push(mL[1].trim());
        else {
          const mR = l.match(/^([A-K])\.\s*(.+)$/);
          if (mR) right[mR[1]] = mR[2].trim();
          else if (/^\t•\t(.+)$/.test(l) || /^•\s*(.+)$/.test(l)) {
            const t = l.replace(/^\t•\t/, '').replace(/^•\s*/, '').trim();
            if (t) right['G'] = t;
          }
        }
        i++;
      }
      const letters = Object.keys(right).sort();
      const right_items = letters.map((L) => right[L]);
      out.push({ type: 'match', prompt: promptBits.join(' ').trim() || 'Jacob — Genesis 49', left_items: left, right_items });
    }

    function parseTf(stopRe) {
      while (i < lines.length && !stopRe.test(lines[i])) {
        const l = lines[i];
        if (!/^\d+\.\s*/.test(l)) {
          i++;
          continue;
        }
        const stmt = l
          .replace(/^\d+\.\s*/, '')
          .replace(/\s*\([^)]*\)\s*$/,'')
          .replace(/\s*\([√×\s]*\)\s*$/,'')
          .trim();
        if (stmt) out.push({ type: 'truefalse', prompt: stmt });
        i++;
      }
    }

    function parseOrder(stopRe) {
      while (i < lines.length && !stopRe.test(lines[i])) {
        const l = lines[i];
        if (!/^\d+\.\s/.test(l) || !/order|Order|Sequencing|verses|events|following/i.test(l)) {
          i++;
          continue;
        }
        const seq = (l.match(/\s+([A-Z]{3,})\s*$/i) || [])[1] || '';
        let prompt = l.replace(/^\d+\.\s*/, '').replace(/\s+[A-Z]{3,}\s*$/i, '').trim();
        let j = i + 1;
        let optStr = '';
        while (j < lines.length && !/^\d+\.\s/.test(lines[j]) && !stopRe.test(lines[j])) {
          optStr += (optStr ? ' ' : '') + lines[j];
          j++;
        }
        const itemMap = parseLetterItems(optStr);
        const letters = Object.keys(itemMap).sort();
        const items = letters.map((k) => ({ key: k, text: itemMap[k] }));
        out.push({ type: 'order', prompt, items, correct_seq: seq.toUpperCase() });
        i = j;
      }
    }

    function parseDict(stopRe, isStart) {
      const chunk = [];
      while (i < lines.length) {
        if (stopRe && stopRe.test(lines[i])) break;
        chunk.push(lines[i]);
        i++;
      }
      const starts = [];
      for (let k = 0; k < chunk.length; k++) {
        if (isStart(chunk[k])) starts.push(k);
      }
      for (let s = 0; s < starts.length; s++) {
        const from = starts[s];
        const to = s + 1 < starts.length ? starts[s + 1] : chunk.length;
        const block = chunk.slice(from, to).join(' ').replace(/\s+/g, ' ').trim();
        if (block.length > 8) out.push({ type: 'dictation', prompt: block.slice(0, 140), expected: block });
      }
    }

    function otDictStart(L) {
      return (
        /^Genesis\s/i.test(L) ||
        /^2\s+Exodus/i.test(L) ||
        /^3\.\s*Proverbs/i.test(L) ||
        /^4\.\s*Isaiah/i.test(L) ||
        /^5\.\s*Malachi/i.test(L)
      );
    }

    function ntDictStart(L) {
      return /^\d+\.\s*Mark\s/i.test(L) || /^\d+\.\s*John\s/i.test(L) || /^\d+\.\s*Romans/i.test(L) || /^\d+\.\s*Galatians/i.test(L) || /^\d+\.\s*Hebrews/i.test(L);
    }

    while (i < lines.length) {
      const l = lines[i];
      if (/^Old Testament section/i.test(l)) {
        section = 'ot';
        i++;
        continue;
      }
      if (/^New Testament section/i.test(l)) {
        section = 'nt';
        i++;
        continue;
      }
      if (section === 'ot' && /^I\.\s*Fill in the blanks/i.test(l)) {
        i++;
        parseFill(/^II\.\s*Single-choice/i);
        continue;
      }
      if (section === 'ot' && /^II\.\s*Single-choice/i.test(l)) {
        i++;
        parseSingle(/^III\.\s*Connecting/i);
        continue;
      }
      if (section === 'ot' && /^III\.\s*Connecting/i.test(l)) {
        i++;
        parseMatchOt();
        continue;
      }
      if (section === 'ot' && /^IV\.\s*True or False/i.test(l)) {
        i++;
        parseTf(/^V\.\s*Sequencing/i);
        continue;
      }
      if (section === 'ot' && /^V\.\s*Sequencing/i.test(l)) {
        i++;
        parseOrder(/^VI\.\s*Write/i);
        continue;
      }
      if (section === 'ot' && /^VI\.\s*Write/i.test(l)) {
        i++;
        parseDict(/^New Testament section/i, otDictStart);
        continue;
      }
      if (section === 'nt' && /^I\.\s*Fill in the blanks/i.test(l)) {
        i++;
        parseFill(/^II\.\s*Multiple-choice/i);
        continue;
      }
      if (section === 'nt' && /^II\.\s*Multiple-choice/i.test(l)) {
        i++;
        parseSingle(/^III\.\s*True or False/i);
        continue;
      }
      if (section === 'nt' && /^III\.\s*True or False/i.test(l)) {
        i++;
        parseTf(/^IV\.\s*Sequencing/i);
        continue;
      }
      if (section === 'nt' && /^IV\.\s*Sequencing/i.test(l)) {
        i++;
        parseOrder(/^V\.\s*Write/i);
        continue;
      }
      if (section === 'nt' && /^V\.\s*Write/i.test(l)) {
        i++;
        parseDict(null, ntDictStart);
        break;
      }
      i++;
    }
    return out;
  }

  function parseIdExam(lines) {
    const out = [];
    let i = 0;
    let section = null;

    function flushFill(buf) {
      if (buf) out.push({ type: 'fill', prompt: normFill(buf) });
    }

    function parseFillId(stopRe) {
      let buf = '';
      while (i < lines.length && !stopRe.test(lines[i])) {
        const l = lines[i];
        if (/^\t*\d+\.\s/.test(l) || /^•\s/.test(l) || /^•/.test(l) || /^\d+\.\s/.test(l)) {
          flushFill(buf);
          buf = l.replace(/^\t+/, '').replace(/^•\s*/, '');
        } else if (buf && l.length > 0) buf += ' ' + l;
        i++;
      }
      flushFill(buf);
    }

    function parseSingleId(stopRe) {
      while (i < lines.length && !stopRe.test(lines[i])) {
        const l = lines[i];
        if (!/^\t*\d+\.\s/.test(l) && !/^\d+\.\s/.test(l)) {
          i++;
          continue;
        }
        const line = l.replace(/^\t+/, '');
        let ans = null;
        const mParen = line.match(/（([A-D])）/);
        if (mParen) ans = mParen[1];
        const mE = line.match(/\s([A-D])\s*$/);
        if (!ans && mE) ans = mE[1];
        let prompt = '';
        let options = ['', '', '', ''];
        if (line.includes('A.') && line.includes('B.') && line.includes('C.') && line.includes('D.')) {
          const startA = line.indexOf('A.');
          prompt = line
            .slice(0, startA)
            .replace(/^\d+\.\s*/, '')
            .replace(/（[A-D]）/g, '')
            .trim();
          const optMap = parseLetterItems(line.slice(startA));
          options = ['A', 'B', 'C', 'D'].map((L) => optMap[L] || '');
        } else {
          prompt = line
            .replace(/^\d+\.\s*/, '')
            .replace(/（[A-D]）/g, '')
            .replace(/\s+[A-D]\s*$/, '')
            .trim();
          let j = i + 1;
          let optStr = '';
          while (j < lines.length && !/^\t*\d+\.\s/.test(lines[j]) && !/^\d+\.\s/.test(lines[j]) && !stopRe.test(lines[j])) {
            if (/[A-D]\./.test(lines[j])) optStr += (optStr ? ' ' : '') + lines[j].replace(/^\t+/, '');
            j++;
          }
          const optMap = parseLetterItems(optStr);
          options = ['A', 'B', 'C', 'D'].map((L) => optMap[L] || '');
          i = j - 1;
        }
        out.push({ type: 'single', prompt, options, answer_index: ans ? { A: 0, B: 1, C: 2, D: 3 }[ans] : 0 });
        i++;
      }
    }

    function parseMatchId() {
      const promptBits = [];
      while (i < lines.length && !/^Anak Yakub/i.test(lines[i].replace(/^\t+/, ''))) {
        promptBits.push(lines[i].replace(/^\t+/, ''));
        i++;
      }
      const left = [];
      const right = {};
      let mode = 'seek';
      while (i < lines.length && !/^IV\.\s*Soal Benar/i.test(lines[i])) {
        const l = lines[i].replace(/^\t+/, '');
        if (/^Anak Yakub/i.test(l)) {
          mode = 'left';
          i++;
          continue;
        }
        if (/^Isi Nubuat/i.test(l)) {
          mode = 'right';
          i++;
          continue;
        }
        if (mode === 'left') {
          const m = l.match(/^\d+\.\s*(.+)$/);
          if (m) left.push(m[1].trim());
        } else if (mode === 'right') {
          const m = l.match(/^([A-K])\.\s*(.+)$/);
          if (m) right[m[1]] = m[2].trim();
        }
        i++;
      }
      const letters = Object.keys(right).sort();
      const right_items = letters.map((L) => right[L]);
      out.push({ type: 'match', prompt: promptBits.join(' ').trim() || 'Yakub — Kejadian 49', left_items: left, right_items });
    }

    function parseTfId(stopRe) {
      while (i < lines.length && !stopRe.test(lines[i])) {
        const l = lines[i].replace(/^\t+/, '');
        if (!/^\d+\.\s/.test(l)) {
          i++;
          continue;
        }
        const paren = l.match(/^(.+?)（[\s\u2003\u00a0]*）\s*$/);
        const stmt = paren ? paren[1].replace(/^\d+\.\s*/, '').trim() : l.replace(/^\d+\.\s*/, '').trim();
        if (stmt) out.push({ type: 'truefalse', prompt: stmt });
        i++;
      }
    }

    function parseOrderId(stopRe) {
      while (i < lines.length && !stopRe.test(lines[i])) {
        const l = lines[i].replace(/^\t+/, '');
        if (!/^\d+\.\s/.test(l) || !/Urutkan|Susun|urutan/i.test(l)) {
          i++;
          continue;
        }
        const seq = (l.match(/\s+([A-Z]{3,})\s*$/i) || [])[1] || '';
        let prompt = l.replace(/^\d+\.\s*/, '').replace(/\s+[A-Z]{3,}\s*$/i, '').trim();
        let j = i + 1;
        let optStr = '';
        while (j < lines.length && !/^\t*\d+\.\s/.test(lines[j]) && !/^\d+\.\s/.test(lines[j]) && !stopRe.test(lines[j])) {
          optStr += (optStr ? ' ' : '') + lines[j].replace(/^\t+/, '');
          j++;
        }
        const itemMap = parseLetterItems(optStr);
        const letters = Object.keys(itemMap).sort();
        const items = letters.map((k) => ({ key: k, text: itemMap[k] }));
        out.push({ type: 'order', prompt, items, correct_seq: seq.toUpperCase() });
        i = j;
      }
    }

    function idOtDictStart(L) {
      return (
        /\(TB\s*Kej/i.test(L) ||
        /\(TB\s*Kel/i.test(L) ||
        /\(TB\s*Ams/i.test(L) ||
        /\(TB\s*Yes/i.test(L) ||
        /\(TB\s*Mal/i.test(L)
      );
    }

    function idNtDictStart(L) {
      return (
        /^\d+\.\s*Markus/i.test(L) ||
        /^\d+\.\s*Yohanes/i.test(L) ||
        /^\d+\.\s*Roma/i.test(L) ||
        /^\d+\.\s*Galatia/i.test(L) ||
        /^\d+\.\s*Ibrani/i.test(L)
      );
    }

    function parseIdDictChunk(stopRe, isStart) {
      const chunk = [];
      while (i < lines.length) {
        if (stopRe && stopRe.test(lines[i])) break;
        chunk.push(lines[i].replace(/^\t+/, ''));
        i++;
      }
      const starts = [];
      for (let k = 0; k < chunk.length; k++) {
        if (isStart(chunk[k])) starts.push(k);
      }
      for (let s = 0; s < starts.length; s++) {
        const from = starts[s];
        const to = s + 1 < starts.length ? starts[s + 1] : chunk.length;
        const block = chunk.slice(from, to).join(' ').replace(/\s+/g, ' ').trim();
        if (block.length > 8) out.push({ type: 'dictation', prompt: block.slice(0, 140), expected: block });
      }
    }

    while (i < lines.length) {
      const l = lines[i];
      if (/BAGIAN PERJANJIAN LAMA/i.test(l)) {
        section = 'ot';
        i++;
        continue;
      }
      if (/Bagian Perjanjian Baru/i.test(l)) {
        section = 'nt';
        i++;
        continue;
      }
      if (section === 'ot' && /Isian singkat/i.test(l) && /20 poin/i.test(l)) {
        i++;
        parseFillId(/^II\.\s*Pilihan Ganda/i);
        continue;
      }
      if (section === 'ot' && /^II\.\s*Pilihan Ganda/i.test(l)) {
        i++;
        parseSingleId(/^III\.\s*Soal Menghubungkan/i);
        continue;
      }
      if (section === 'ot' && /^III\.\s*Soal Menghubungkan/i.test(l)) {
        i++;
        parseMatchId();
        continue;
      }
      if (section === 'ot' && /^IV\.\s*Soal Benar/i.test(l)) {
        i++;
        while (i < lines.length && !/^\d+\.\s/.test(lines[i]) && !/^V\.\s*Soal Urutan/i.test(lines[i])) i++;
        parseTfId(/^V\.\s*Soal Urutan/i);
        continue;
      }
      if (section === 'ot' && /^V\.\s*Soal Urutan/i.test(l)) {
        i++;
        while (i < lines.length && !/Urutkan ayat/i.test(lines[i]) && !/Soal Hafalan/i.test(lines[i]) && !/^•\s*Soal Hafalan/i.test(lines[i])) i++;
        parseOrderId(/Soal Hafalan|•\s*Soal Hafalan/i);
        continue;
      }
      if (section === 'ot' && (/Soal Hafalan ayat/i.test(l) || /^•\s*Soal Hafalan/i.test(l))) {
        i++;
        parseIdDictChunk(/^Bagian Perjanjian Baru/i, idOtDictStart);
        continue;
      }
      if (section === 'nt' && /Isian Singkat/i.test(l) && /20 poin/i.test(l)) {
        i++;
        parseFillId(/^II\.\s*Pilihan Ganda/i);
        continue;
      }
      if (section === 'nt' && /^II\.\s*Pilihan Ganda/i.test(l)) {
        i++;
        parseSingleId(/^III\.\s*Benar/i);
        continue;
      }
      if (section === 'nt' && /^III\.\s*Benar/i.test(l)) {
        i++;
        while (i < lines.length && !/^\d+\.\s/.test(lines[i]) && !/^IV\.\s*Soal Urutan/i.test(lines[i])) i++;
        parseTfId(/^IV\.\s*Soal Urutan/i);
        continue;
      }
      if (section === 'nt' && /^IV\.\s*Soal Urutan/i.test(l)) {
        i++;
        parseOrderId(/^V\.\s*Soal Hafalan/i);
        continue;
      }
      if (section === 'nt' && /^V\.\s*Soal Hafalan/i.test(l)) {
        i++;
        parseIdDictChunk(null, idNtDictStart);
        break;
      }
      i++;
    }
    return out;
  }

  /** 从整段默写标准答案中截取「书卷 章:节」提示，避免题干泄露经文正文（英/印试卷共用拉丁字母书名著录格式） */
  function extractLatinScriptDictRef(block) {
    const s = String(block || '')
      .replace(/^\d+\.\s*/, '')
      .trim();
    const m = s.match(/^((?:[A-Z][a-z]+)(?:\s+[A-Z][a-z]+)*\s+\d+:\d+(?:-\d+)?)\b/);
    return m ? m[1] : '';
  }

  function buildExamLocaleList(rawText, lang) {
    const text = String(rawText || '').replace(/\f/g, '\n').replace(/\u2028/g, ' ');
    const lines = text.split(/\r\n|\n|\r/).map((l) => l.trim()).filter(Boolean);
    if (lang === 'en') return parseEnExam(lines);
    if (lang === 'id') return parseIdExam(lines);
    return [];
  }

  function mergeLocaleIntoQuestions(zhQs, enList, idList) {
    let fillIx = 0;
    let dictIx = 0;
    return zhQs.map((q, idx) => {
      const o = Object.assign({}, q);
      const e = enList[idx];
      const d = idList[idx];

      if (q.type === 'fill') {
        if (FILL_ANSWERS_EN[fillIx]) o.answers_en = FILL_ANSWERS_EN[fillIx].slice();
        if (FILL_ANSWERS_ID[fillIx]) o.answers_id = FILL_ANSWERS_ID[fillIx].slice();
        fillIx++;
      }
      if (q.type === 'dictation') {
        if (DICT_EXPECTED_EN[dictIx]) o.expected_en = DICT_EXPECTED_EN[dictIx];
        if (DICT_EXPECTED_ID[dictIx]) o.expected_id = DICT_EXPECTED_ID[dictIx];
        dictIx++;
      }

      if (e && e.type === q.type) {
        if (e.prompt && q.type !== 'dictation') {
          o.prompt_en = e.prompt;
        }
        if (q.type === 'single' && e.options) o.options_en = e.options.map((x) => String(x || '').trim());
        if (q.type === 'match') {
          if (e.left_items && e.left_items.length === q.left_items.length) o.left_items_en = e.left_items.slice();
          if (e.right_items && e.right_items.length === q.right_items.length) o.right_items_en = e.right_items.slice();
        }
        if (q.type === 'order' && e.items) o.items_en = e.items.map((x) => Object.assign({}, x));
      }
      if (d && d.type === q.type) {
        if (d.prompt && q.type !== 'dictation') {
          o.prompt_id = d.prompt;
        }
        if (q.type === 'single' && d.options) o.options_id = d.options.map((x) => String(x || '').trim());
        if (q.type === 'match') {
          if (d.left_items && d.left_items.length === q.left_items.length) o.left_items_id = d.left_items.slice();
          if (d.right_items && d.right_items.length === q.right_items.length) o.right_items_id = d.right_items.slice();
        }
        if (q.type === 'order' && d.items) o.items_id = d.items.map((x) => Object.assign({}, x));
      }
      if (q.type === 'dictation') {
        if (o.expected_en) {
          const enRef = extractLatinScriptDictRef(o.expected_en);
          if (enRef) o.prompt_en = 'Write from memory: ' + enRef;
        }
        if (o.expected_id) {
          const idRef = extractLatinScriptDictRef(o.expected_id);
          if (idRef) o.prompt_id = 'Tuliskan dari hafalan: ' + idRef;
        }
      }
      return o;
    });
  }

  globalThis.EXAM_LOCALE = {
    buildExamLocaleList: buildExamLocaleList,
    mergeLocaleIntoQuestions: mergeLocaleIntoQuestions,
    FILL_ANSWERS_EN: FILL_ANSWERS_EN,
    FILL_ANSWERS_ID: FILL_ANSWERS_ID,
  };
})();

