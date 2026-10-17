# OSTEP Learning Tracker

Website tĩnh (1 trang) để theo dõi tiến độ học **Operating Systems: Three Easy Pieces** theo
lộ trình 12 tuần trong [`Doc/OS_Learning_Roadmap_Graphics_Programmer.md`](Doc/OS_Learning_Roadmap_Graphics_Programmer.md).

Toàn bộ website nằm trong thư mục [`web/`](web/). Không cần cài đặt gì: HTML + CSS + JS thuần,
dữ liệu tiến độ lưu trong `localStorage` của trình duyệt.

## Chạy

```bash
# chạy từ thư mục gốc repo
python3 -m http.server 8000
# mở http://localhost:8000/web/
```

Mở trực tiếp bằng `file://` sẽ không được: trang cần `fetch()` file `data/roadmap.json` qua HTTP.
Chạy server **từ thư mục gốc** (không phải từ trong `web/`) để link tới bản PDF offline vẫn mở được.

## Có gì trong bản này

- **Kế hoạch theo ngày**: [`Doc/OS_Learning_Daily_Plan_12_Weeks.md`](Doc/OS_Learning_Daily_Plan_12_Weeks.md) —
  9h/tuần (1h các ngày trong tuần, 2h Thứ 7, 2h Chủ nhật), chia việc cụ thể cho từng ngày của cả 12 tuần.
  Website đọc trực tiếp file này và hiển thị thành 84 task ngày.
- **Hôm nay**: dashboard luôn mở đầu bằng việc của hôm nay (theo thứ trong tuần + tuần hiện tại),
  kèm "Xong khi…" và checkbox để tick.
- **Dashboard**: % tiêu chí, tuần đã xong, số ngày đã xong (x/84), giờ đã hoàn thành theo kế hoạch (x/108h),
  ngày bắt đầu có thể chỉnh, lưới 12 tuần, danh sách ngày còn lại của tuần hiện tại, checklist tổng kết sau 12 tuần.
- **Week detail** (`#/week/w04`): kế hoạch 7 ngày (checkbox + phút + "xong khi") và deliverable của tuần,
  chương OSTEP kèm link PDF chính thức + PDF offline trong `Doc/`, checklist kiến thức / bài tập /
  yêu cầu (tuần 12) / tiêu chí hoàn thành, ô ghi chú tự lưu, callout "Liên hệ với game" và "Lưu ý".
  Có 2 thanh tiến độ: **ngày** (x/7) và **tiêu chí**.
- **Export / Import JSON**: tải tiến độ về file để backup hoặc commit vào repo.

Quy ước tiến độ:

- **% của tuần (và % toàn khóa) = số tiêu chí hoàn thành / tổng tiêu chí** — đúng tinh thần
  "tiêu chí hoàn thành" của roadmap, không phải số checkbox bất kỳ.
- **Task ngày** (84 task) đo mức độ đều đặn: tick khi làm xong việc của ngày đó; số giờ hoàn thành
  được tính từ phút của các ngày đã tick (60' ngày thường, 120' Thứ 7/CN).

## Cấu trúc

```
Doc/                                           # tài liệu học (source of truth)
├── OS_Learning_Roadmap_Graphics_Programmer.md  # lộ trình 12 tuần
├── OS_Learning_Daily_Plan_12_Weeks.md          # kế hoạch từng ngày
└── Operating Systems - Three Easy Pieces.pdf   # sách offline
README.md

web/                       # toàn bộ website
├── index.html             # khung trang
├── styles.css             # giao diện (dark, responsive)
├── app.js                 # router hash, state localStorage, render, export/import
├── data/roadmap.json      # dữ liệu sinh tự động từ 2 file .md trong Doc/
└── tools/gen_roadmap.py   # script sinh dữ liệu
```

`web/data/roadmap.json` được sinh từ chính hai file markdown — **doc là source of truth**:

- `Doc/OS_Learning_Roadmap_Graphics_Programmer.md` → chương, kiến thức, bài tập, tiêu chí, liên hệ game;
- `Doc/OS_Learning_Daily_Plan_12_Weeks.md` → bảng 7 ngày/tuần (phút, việc, "xong khi"), deliverable,
  ghi chú "nếu kẹt/nếu dư", và ngân sách 9h/tuần · 108h.

Khi sửa một trong hai file, chạy lại:

```bash
python3 web/tools/gen_roadmap.py
```

Script tìm file `.md` trong `Doc/` (fallback về thư mục gốc nếu bạn đổi chỗ), rồi báo số tuần, số ngày,
tổng giờ và số nhóm checklist cuối đã đọc được. Nếu thêm chương OSTEP mới,
bổ sung mapping `Ch. số → tên file PDF` trong `CHAPTERS` của script. Nếu đổi cấu trúc bảng trong file
kế hoạch (ví dụ thêm cột), cập nhật `DAY_ROW` tương ứng.

## Tiến độ được lưu ở đâu

`localStorage` key `ostep.progress.v1`, dạng:

```json
{
  "version": 1,
  "startDate": "2026-01-05",
  "done": { "w01-d1": true, "w01-k1": true, "w01-c1": true },
  "notes": { "w01": "..." }
}
```

`done` chứa id của cả task ngày (`w01-d1`…`w01-d7`), kiến thức (`-k`), bài tập (`-e`), yêu cầu (`-r`)
và tiêu chí (`-c`).

Xóa cache trình duyệt là mất tiến độ → nên **Export** định kỳ và commit file JSON vào repo.
Import sẽ thay thế toàn bộ tiến độ hiện tại (có hỏi xác nhận).

## Chưa có (cố ý để sau)

Glossary, bảng Benchmarks, chart tiến độ theo tuần, timer/pomodoro, nhắc việc.
Chỉ nên thêm khi thực sự thấy thiếu trong lúc học.
