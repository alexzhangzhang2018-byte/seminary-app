/** 创世记英文卷 I 大题经文填空（答案版空格分组） */
export const GENESIS_EN_FILL_LINES = [
  'Genesis 1:1–2 In the beginning, God 【created the heavens and the earth】. The earth was 【without form】 and 【void】, and darkness was over the face of the deep. And the 【Spirit】 of God was hovering over the face of the waters.',
  'Genesis 2:16–17 And the LORD God commanded the man, saying, "You may surely eat of every tree of the garden, but of the tree of the 【knowledge】 of 【good】 and 【evil】 you shall not eat, for in the day that you eat of it you shall 【surely die】."',
  'Genesis 3:4–5 But the serpent said to the woman, "You will not surely 【die】. For God knows that when you eat of it your 【eyes】 will be opened, and you will be like God, 【knowing good】 and 【evil】."',
  'Genesis 11:4 Then they said, "Come, let us build ourselves a city and a tower with its top in the heavens, and let us make a 【name】 for ourselves, lest we be 【dispersed】 over the face of the whole earth."',
  'Genesis 15:6 And he (Abram) 【believed】 the LORD, and he counted it to him as 【righteousness】.',
  'Genesis 21:9–10 But Sarah saw the son of Hagar the Egyptian, whom she had borne to Abraham, laughing. So she said to Abraham, "Cast out this slave woman with her son, for the son of this slave woman shall not be 【heir】 with my son 【Isaac】."',
  'Genesis 22:1–2 After these things God 【tested】 Abraham and said to him, "Abraham!" And he said, "Here I am." He said, "Take your 【son】, your only 【son】, 【Isaac】, whom you love, and go to the land of 【Moriah】, and offer him there as a 【burnt】 offering on one of the mountains of which I shall tell you."',
  'Genesis 25:21–23 And Isaac prayed to the LORD for his wife, because she was barren. And the LORD granted his prayer, and Rebekah his wife conceived. The children struggled together within her, and she said, "If it is thus, why is this happening to me?" So she went to inquire of the LORD. And the LORD said to her, "【Two nations】 are in your womb, and 【two】 peoples from within you shall be divided; the one shall be stronger than the other, the 【older】 shall serve the 【younger】."',
  'Genesis 25:34 Then Jacob gave Esau bread and lentil stew, and he ate and drank and rose and went his way. Thus Esau 【despised】 his 【birthright】.',
  'Genesis 28:12–14 And he dreamed, and behold, there was a ladder set up on the earth, and the top of it reached to heaven. And behold, the 【angels】 of God were ascending and descending on it! And behold, the 【LORD】 stood above it and said, "I am the LORD, the God of Abraham your father and the God of Isaac. The land on which you lie I will give to you and to your 【offspring】. Your offspring shall be like the 【dust】 of the earth, and you shall spread abroad to the west and to the east and to the north and to the south, and in you and your offspring shall all the families of the earth be 【blessed】."',
  'Genesis 32:9–11 And Jacob said, "O God of my father Abraham and God of my father Isaac, O LORD who said to me, \'Return to your country and to your kindred, that I may do you 【good】,\' I am not worthy of the least of all the 【steadfast love】 and all the 【faithfulness】 that you have shown to your servant, for with only my 【staff】 I crossed this Jordan, and now I have become two 【camps】. Please deliver me from the hand of my brother, from the hand of Esau, for I fear him, that he may come and attack me, the mothers with the children."',
  'Genesis 38:24–26About three months later Judah was told, "Tamar your daughter-in-law has been 【immoral】, and moreover she is pregnant by 【immorality】." And Judah said, "Bring her out, and let her be burned." As she was being brought out, she sent word to her father-in-law, "By the man to whom these belong, I am pregnant." And she said, "Please identify whose these are, the signet and the cord and the staff." Then Judah identified them and said, "【She is more righteous than I】," since I did not give her to my son Shelah." And he did not know her again.',
  'Genesis 39:23 The keeper of the prison paid no attention to anything that was in Joseph\'s charge, because the LORD was 【with him】. And whatever he did, the LORD made it 【succeed】.',
  'Genesis 46:2–4 And God spoke to Israel in visions of the night and said, "Jacob, Jacob." And he said, "Here I am." Then he said, "I am God, the God of your father. Do not be afraid to go down to Egypt, for there I will make you into a 【great nation】. I myself will go down with you to Egypt, and I will also bring you 【up】 again, and 【Joseph】 shall put his hand on your eyes."',
  'Genesis 49:10 The 【scepter】 shall not depart from Judah, nor the ruler\'s 【staff】 from between his feet, until 【Shiloh】 comes; and to him shall be the obedience of the 【peoples】.',
  'Genesis 50:25 Then Joseph made the sons of Israel swear, saying, "God will surely 【visit】 you, and you shall carry up my 【bones】 from here."',
];

const PER_BLANK = 0.5;

/** 覆盖英文创世记 snapshot 中 section 一 的填空题干与答案 */
export function applyGenesisEnFillPatch(snapshot, { parseLineBracketFills }) {
  if (!Array.isArray(snapshot)) return snapshot;
  const fills = snapshot.filter((q) => q.type === 'fill' && (q.section === '一' || q.section === 'I'));
  if (!fills.length) return snapshot;

  GENESIS_EN_FILL_LINES.forEach((text, i) => {
    const q = fills[i];
    if (!q) return;
    const parsed = parseLineBracketFills(`${i + 1}. ${text}`);
    if (!parsed?.answers?.length) return;
    q.locales = q.locales || {};
    q.locales.en = {
      stem: parsed.prompt,
      options: [],
      answer_key: { answers: parsed.answers },
    };
    const n = parsed.answers.length;
    q.score = Math.round(n * PER_BLANK * 100) / 100;
    q.blank_count = n;
  });
  return snapshot;
}
