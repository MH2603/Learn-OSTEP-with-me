#!/usr/bin/env python3
"""Sinh web/data/roadmap.json từ hai file markdown trong thư mục Doc/.

Doc markdown là source of truth: sửa lộ trình / kế hoạch ngày trong .md rồi chạy lại.

    python3 web/tools/gen_roadmap.py
"""

import json
import re
from pathlib import Path
from urllib.parse import quote

SITE = Path(__file__).resolve().parent.parent  # web/
ROOT = SITE.parent                             # thư mục gốc repo
DOC_DIR = ROOT / "Doc"                         # tài liệu học (roadmap, kế hoạch, sách)
OUT = SITE / "data" / "roadmap.json"

PDF_NAME = "Operating Systems - Three Easy Pieces.pdf"


def find_doc(name):
    """Tìm file tài liệu trong Doc/, fallback về thư mục gốc repo."""
    for base in (DOC_DIR, ROOT):
        candidate = base / name
        if candidate.exists():
            return candidate
    return DOC_DIR / name


def pdf_href():
    """Đường dẫn tới PDF tính từ web/index.html."""
    for base, prefix in ((DOC_DIR, "../Doc/"), (ROOT, "../")):
        if (base / PDF_NAME).exists():
            return prefix + quote(PDF_NAME)
    return "../Doc/" + quote(PDF_NAME)


SRC = find_doc("OS_Learning_Roadmap_Graphics_Programmer.md")
PLAN_SRC = find_doc("OS_Learning_Daily_Plan_12_Weeks.md")

OSTEP_BASE = "https://pages.cs.wisc.edu/~remzi/OSTEP/"

# Chương OSTEP được dùng trong lộ trình: số chương -> (tiêu đề, tên file PDF).
# Tên file đã đối chiếu với mục lục chính thức https://pages.cs.wisc.edu/~remzi/OSTEP/
CHAPTERS = {
    2: ("Introduction", "intro.pdf"),
    4: ("Processes", "cpu-intro.pdf"),
    5: ("Process API", "cpu-api.pdf"),
    6: ("Direct Execution", "cpu-mechanisms.pdf"),
    7: ("CPU Scheduling", "cpu-sched.pdf"),
    10: ("Multi-CPU Scheduling", "cpu-sched-multi.pdf"),
    13: ("Address Spaces", "vm-intro.pdf"),
    14: ("Memory API", "vm-api.pdf"),
    15: ("Address Translation", "vm-mechanism.pdf"),
    17: ("Free-Space Management", "vm-freespace.pdf"),
    26: ("Concurrency and Threads", "threads-intro.pdf"),
    27: ("Thread API", "threads-api.pdf"),
    28: ("Locks", "threads-locks.pdf"),
    29: ("Locked Data Structures", "threads-locks-usage.pdf"),
    30: ("Condition Variables", "threads-cv.pdf"),
    31: ("Semaphores", "threads-sema.pdf"),
    32: ("Concurrency Bugs", "threads-bugs.pdf"),
    33: ("Event-based Concurrency", "threads-events.pdf"),
    36: ("I/O Devices", "file-devices.pdf"),
    39: ("Files and Directories", "file-intro.pdf"),
    40: ("File System Implementation", "file-implementation.pdf"),
}

CHAPTER_REF = re.compile(r"Ch\.?\s*(\d+)(?:\s*[–—-]\s*(\d+))?")
H2 = re.compile(r"^##\s+(.+)$")
H3 = re.compile(r"^###\s+(.+)$")
BOLD = re.compile(r"^\*\*(.+?)\*\*:?\s*(.*)$")
BULLET = re.compile(r"^[-*]\s+(?:\[( |x|X)\]\s+)?(.+)$")
NUMBERED = re.compile(r"^\d+\.\s+(.+)$")


def clean(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^\*\*(.+?)\*\*:?\s*", r"\1: ", text)
    return text.rstrip().rstrip(".").strip() if text.endswith(".") else text.strip()


def split_sections(lines):
    """Tách block văn bản thành {tên section: [dòng]}, giữ thứ tự."""
    sections = []
    for raw in lines:
        line = raw.rstrip()
        if not line.strip():
            continue
        m = BOLD.match(line.strip())
        if m and not line.strip().startswith("- "):
            sections.append([m.group(1).strip().rstrip(":"), [m.group(2)] if m.group(2) else []])
            continue
        if sections:
            sections[-1][1].append(line.strip())
    return sections


def list_items(lines):
    """Lấy bullet / numbered item trong một section."""
    items = []
    for line in lines:
        m = BULLET.match(line) or NUMBERED.match(line)
        if m:
            text = m.group(m.lastindex)
            text = clean(text)
            if text:
                items.append(text)
    return items


def chapter_resources(text):
    """Chuyển 'Ch. 13–15 về address space' thành các entry chương có link."""
    entries = []
    for m in CHAPTER_REF.finditer(text):
        start = int(m.group(1))
        end = int(m.group(2)) if m.group(2) else start
        for n in range(start, end + 1):
            if n in CHAPTERS:
                title, filename = CHAPTERS[n]
                entries.append(
                    {
                        "kind": "chapter",
                        "label": f"Ch. {n} — {title}",
                        "url": OSTEP_BASE + filename,
                    }
                )
    return entries


def parse_week(number, title, lines):
    resources, concepts, exercises, requirements, criteria = [], [], [], [], []
    note, game, project, goal = "", "", "", ""

    for name, body in split_sections(lines):
        lowered = name.lower()
        items = list_items(body)
        if lowered.startswith("tài liệu"):
            for item in items:
                chapters = chapter_resources(item)
                if chapters:
                    resources.extend(chapters)
                else:
                    resources.append({"kind": "text", "label": item, "url": None})
        elif lowered.startswith("kiến thức"):
            concepts.extend(items)
        elif lowered.startswith("bài tập"):
            exercises.extend(items)
        elif lowered.startswith("yêu cầu"):
            requirements.extend(items)
        elif lowered.startswith("tiêu chí"):
            criteria.extend(items)
        elif lowered.startswith("lưu ý"):
            note = " ".join(items) if items else clean(" ".join(body))
        elif lowered.startswith("liên hệ"):
            game = " ".join(items) if items else clean(" ".join(body))
        elif lowered.startswith("tên project"):
            project = clean(" ".join(body))
        elif lowered.startswith("mục tiêu"):
            goal = clean(" ".join(body))

    seen, unique_resources = set(), []
    for res in resources:
        key = (res["kind"], res["label"])
        if key not in seen:
            seen.add(key)
            unique_resources.append(res)

    week_id = f"w{number:02d}"
    return {
        "id": week_id,
        "number": number,
        "title": title.strip(),
        "resources": unique_resources,
        "concepts": [{"id": f"{week_id}-k{i}", "text": t} for i, t in enumerate(concepts, 1)],
        "exercises": [{"id": f"{week_id}-e{i}", "text": t} for i, t in enumerate(exercises, 1)],
        "requirements": [
            {"id": f"{week_id}-r{i}", "text": t} for i, t in enumerate(requirements, 1)
        ],
        "criteria": [{"id": f"{week_id}-c{i}", "text": t} for i, t in enumerate(criteria, 1)],
        "game": game,
        "note": note,
        "project": project,
        "goal": goal,
    }


def parse_final_checklist(lines):
    groups = []
    current = None
    for raw in lines:
        line = raw.strip()
        if not line or line == "---":
            continue
        m = H3.match(line)
        if m:
            current = {"title": m.group(1).strip(), "items": []}
            groups.append(current)
            continue
        m = BULLET.match(line)
        if m and current is not None and m.group(1) is not None:
            group_id = f"f{len(groups)}"
            current["items"].append(
                {"id": f"{group_id}-{len(current['items']) + 1}", "text": m.group(2).strip()}
            )
    return [g for g in groups if g["items"]]


# --------------------------------------------------------------------------- #
# Kế hoạch theo ngày (OS_Learning_Daily_Plan_12_Weeks.md)
# --------------------------------------------------------------------------- #

DAY_ROW = re.compile(
    r"^\|\s*(Thứ\s*[2-7]|Chủ nhật)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*$"
)
BOLD_FIELD = re.compile(r"^\*\*(.+?):\*\*\s*(.*)$")


def parse_plan_week(number, lines):
    """Lấy bảng 7 ngày + deliverable + ghi chú 'nếu kẹt/nếu dư' của một tuần."""
    week_id = f"w{number:02d}"
    deliverable = ""
    days = []
    notes = []

    for raw in lines:
        line = raw.strip()
        if not line:
            continue

        match = DAY_ROW.match(line)
        if match:
            day_name = re.sub(r"\s+", " ", match.group(1)).strip()
            minutes_cell = match.group(2)
            minutes = sum(int(n) for n in re.findall(r"\d+", minutes_cell))
            days.append(
                {
                    "id": f"{week_id}-d{len(days) + 1}",
                    "day": day_name,
                    "minutes": minutes,
                    "minutesLabel": re.sub(r"\s+", "", minutes_cell),
                    "task": re.sub(r"\s+", " ", match.group(3)).strip(),
                    "doneWhen": re.sub(r"\s+", " ", match.group(4)).strip(),
                }
            )
            continue

        if line.startswith("|"):  # header / separator của bảng
            continue

        field = BOLD_FIELD.match(line)
        if field:
            if field.group(1).strip().lower().startswith("deliverable"):
                deliverable = field.group(2).strip()
            continue

        if line.startswith("*") and not line.startswith("**"):
            note = line.strip("*").strip()
            note = re.sub(r"\*+", "", note)
            if note:
                notes.append(re.sub(r"\s+", " ", note))

    total_minutes = sum(day["minutes"] for day in days)
    return week_id, {
        "deliverable": deliverable,
        "days": days,
        "notes": notes,
        "minutesPerWeek": total_minutes,
    }


def parse_plan(path):
    """Trả về ({số tuần: plan}, meta bổ sung)."""
    plans = {}
    meta = {}
    if not path.exists():
        return plans, meta

    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()

    budget = next((l for l in lines if l.strip().startswith("**Ngân sách thời gian:**")), "")
    if budget:
        m = re.search(r"\*\*(\d+)h/tuần\*\*", budget)
        if m:
            meta["hoursPerWeek"] = int(m.group(1))
        m = re.search(r"tổng \*\*(\d+)h\*\*", budget)
        if m:
            meta["totalHours"] = int(m.group(1))
        m = re.search(
            r"\*\*Ngân sách thời gian:\*\*\s*(.+?)\s*→\s*\*\*\d+h/tuần\*\*", budget
        )
        if m:
            rhythm = re.sub(r"\*\*(.+?)\*\*", r"\1", m.group(1)).strip()
            meta["rhythm"] = rhythm
            meta["rhythmShort"] = (
                rhythm.replace("Thứ 2 → Thứ 6", "T2–T6")
                .replace("Thứ 7", "T7")
                .replace("Chủ nhật", "CN")
                .replace("(5h) ", "")
                .strip()
            )

    indices = [i for i, l in enumerate(lines) if H3.match(l) and H3.match(l).group(1).startswith("Tuần ")]
    for pos, start in enumerate(indices):
        heading = H3.match(lines[start]).group(1)
        m = re.match(r"Tuần\s+(\d+)", heading)
        if not m:
            continue
        end = indices[pos + 1] if pos + 1 < len(indices) else len(lines)
        block = []
        for line in lines[start + 1 : end]:
            if H2.match(line):
                break
            block.append(line)
        week_id, plan = parse_plan_week(int(m.group(1)), block)
        plans[week_id] = plan

    return plans, meta


def main():
    lines = SRC.read_text(encoding="utf-8").splitlines()

    title = next((l[2:].strip() for l in lines if l.startswith("# ")), "OSTEP Roadmap")
    hours_per_week = 6
    schedule = []
    for line in lines:
        m = re.match(r"^-\s+\*\*(\d+)\s*giờ:\*\*\s*(.+)$", line.strip())
        if m:
            schedule.append({"hours": int(m.group(1)), "label": clean(m.group(2))})
        m = re.match(r"^-\s+\*\*Khối lượng:\*\*\s*(\d+)[–-](\d+)\s*giờ/tuần", line.strip())
        if m:
            hours_per_week = int(m.group(2))

    plans, plan_meta = parse_plan(PLAN_SRC)
    if "hoursPerWeek" in plan_meta:
        hours_per_week = plan_meta["hoursPerWeek"]

    weeks = []
    indices = [i for i, l in enumerate(lines) if H3.match(l) and H3.match(l).group(1).startswith("Tuần ")]
    for pos, start in enumerate(indices):
        heading = H3.match(lines[start]).group(1)
        m = re.match(r"Tuần\s+(\d+)\s*[—–-]\s*(.+)$", heading)
        if not m:
            continue
        end = indices[pos + 1] if pos + 1 < len(indices) else len(lines)
        block = []
        for line in lines[start + 1 : end]:
            if H2.match(line) or line.strip() == "---":
                break
            block.append(line)
        week = parse_week(int(m.group(1)), m.group(2), block)
        week["plan"] = plans.get(week["id"]) or {
            "deliverable": "",
            "days": [],
            "notes": [],
            "minutesPerWeek": 0,
        }
        weeks.append(week)

    final_checklist = []
    in_section = False
    section_lines = []
    for line in lines:
        if H2.match(line):
            in_section = H2.match(line).group(1).startswith("6.")
            if in_section:
                continue
        if in_section:
            section_lines.append(line)
    if section_lines:
        final_checklist = parse_final_checklist(section_lines)

    total_minutes = sum(week["plan"]["minutesPerWeek"] for week in weeks)
    data = {
        "meta": {
            "title": title,
            "weekCount": len(weeks),
            "hoursPerWeek": hours_per_week,
            "totalHours": plan_meta.get("totalHours", round(total_minutes / 60)),
            "rhythm": plan_meta.get("rhythm", ""),
            "rhythmShort": plan_meta.get("rhythmShort", ""),
            "schedule": schedule,
            "planSource": PLAN_SRC.name if plans else "",
            # đường dẫn tới PDF tính từ web/index.html (PDF nằm trong Doc/)
            "localPdfHref": pdf_href(),
            "ostepIndex": OSTEP_BASE,
            "source": SRC.name,
        },
        "weeks": weeks,
        "finalChecklist": final_checklist,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    days = sum(len(week["plan"]["days"]) for week in weeks)
    print(
        f"Wrote {OUT.relative_to(ROOT)} — {len(weeks)} tuần, {days} ngày, "
        f"{total_minutes / 60:.0f}h, {len(final_checklist)} nhóm checklist cuối."
    )


if __name__ == "__main__":
    main()
