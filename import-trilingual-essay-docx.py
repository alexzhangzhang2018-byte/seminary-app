#!/usr/bin/env python3
"""解析三语合一的课程简答卷 .docx → student_exam snapshot_json"""
from __future__ import annotations

import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def extract_lines(path: str | Path) -> list[str]:
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    lines: list[str] = []
    for p in root.findall(".//w:p", NS):
        parts: list[str] = []
        for t in p.findall(".//w:t", NS):
            if t.text:
                parts.append(t.text)
            if t.tail:
                parts.append(t.tail)
        s = re.sub(r"\s+", " ", "".join(parts)).strip()
        if s:
            lines.append(s)
    return lines


def norm_q(text: str) -> str:
    s = re.sub(r"[\u200b\u2060\ufeff]", "", text or "")
    return re.sub(r"^\d+\.\s*", "", s).strip()


def find_lang_blocks(lines: list[str]) -> tuple[int, int, int]:
    """返回 (zh_start, id_start, en_start) 行索引。"""
    id_start = None
    en_start = None
    for i, line in enumerate(lines):
        if id_start is None and (
            line.startswith("Kitab ")
            or (i > 2 and re.match(r"^Kitab\b", line))
        ):
            id_start = i
        if en_start is None and re.match(r"^The Book", line):
            en_start = i
    if id_start is None or en_start is None:
        raise ValueError("未能识别印尼语/英语区块（需含 Kitab… 与 The Book… 标题行）")
    return 0, id_start, en_start


def parse_trilingual_essay(lines: list[str], score_per_q: float = 25.0) -> list[dict]:
    zh0, id0, en0 = find_lang_blocks(lines)
    zh_title = lines[zh0]
    zh_instr = lines[zh0 + 1]
    id_title = lines[id0]
    id_instr = lines[id0 + 1]
    en_title = lines[en0]
    en_instr = lines[en0 + 1]

    zh_qs = [norm_q(x) for x in lines[zh0 + 2 : id0] if norm_q(x)]
    id_qs = [norm_q(x) for x in lines[id0 + 2 : en0] if norm_q(x)]
    en_qs = [norm_q(x) for x in lines[en0 + 2 :] if norm_q(x)]

    n = min(len(zh_qs), len(id_qs), len(en_qs))
    if n == 0:
        raise ValueError("未解析到简答题")

    section_label = zh_instr
    section_labels = {"zh": zh_instr, "id": id_instr, "en": en_instr}

    snapshot = []
    for i in range(n):
        snapshot.append(
            {
                "group_id": f"q{i + 1:02d}",
                "sort_order": i + 1,
                "type": "essay",
                "section": "一",
                "score": score_per_q,
                "essay_kind": "short",
                "section_label": section_label,
                "section_labels": section_labels,
                "locales": {
                    "zh": {"stem": zh_qs[i], "options": [], "answer_key": {}},
                    "id": {"stem": id_qs[i], "options": [], "answer_key": {}},
                    "en": {"stem": en_qs[i], "options": [], "answer_key": {}},
                },
            }
        )
    return snapshot, zh_title


def docx_to_snapshot(path: str | Path) -> tuple[list[dict], str]:
    lines = extract_lines(path)
    snap, title = parse_trilingual_essay(lines)
    return snap, title


def main() -> None:
    if len(sys.argv) < 2:
        print("用法: python3 scripts/import-trilingual-essay-docx.py <file.docx> [out.json]")
        sys.exit(1)
    path = Path(sys.argv[1])
    snap, title = docx_to_snapshot(path)
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else path.with_suffix(".json")
    out.write_text(json.dumps(snap, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK {title}: {len(snap)} 题 → {out}")


if __name__ == "__main__":
    main()
