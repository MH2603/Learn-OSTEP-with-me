# Kế hoạch học chi tiết theo ngày — 20 tuần OSTEP

Bản điều chỉnh sau khi đo thực tế: bài đầu tiên cần **~3× thời gian dự kiến**, chủ yếu ở **đọc chương** và
**viết note/glossary**. Vì vậy:

- **Giãn lịch 12 tuần → 20 tuần** (vẫn 9h/tuần), giữ nguyên nội dung 12 module của roadmap.
- **Tăng thời gian đọc**: 4 buổi đọc/tuần (240'/tuần) thay vì 3 buổi (180').
- **Bỏ glossary** và **bỏ drill thứ hai** trong tuần: chỉ còn **1 drill (Thứ 6)** + **1 lab (Thứ 7)**.
- **Mỗi module nội dung chiếm 1 hoặc 2 tuần lịch** (module nhiều chương: 2 tuần).

**Ngân sách:** Thứ 2 → Thứ 6: 1h/ngày (5h) · Thứ 7: 2h · Chủ nhật: 2h → **9h/tuần**, tổng **180h** cho 20 tuần.

> `OS_Learning_Roadmap_Graphics_Programmer.md` vẫn giữ 12 mục "Tuần 1–12" — đó là **12 module nội dung**,
> không phải 12 tuần lịch. Bảng dưới đây map module → tuần lịch.

---

## 1. Bản đồ module → tuần lịch

| Module | Nội dung | Tuần lịch | Số tuần |
|---|---|---|---|
| 1 | Chương trình và process (Ch. 2, 4, 5) | 1–2 | 2 |
| 2 | Virtual memory và address space (Ch. 13, 14, 15) | 3–4 | 2 |
| 3 | Memory allocation và fragmentation (Ch. 17) | 5–6 | 2 |
| 4 | CPU cache và memory locality | 7 | 1 |
| 5 | CPU scheduling và context switch (Ch. 6, 7, 10) | 8–9 | 2 |
| 6 | Thread và data race (Ch. 26, 27) | 10–11 | 2 |
| 7 | Locks và synchronization (Ch. 28, 30, 31) | 12–13 | 2 |
| 8 | Parallelism và job system (Ch. 29, 32, 33) | 14 | 1 |
| 9 | I/O và file system (Ch. 36, 39, 40) | 15–16 | 2 |
| 10 | Memory mapping và asset loading | 17 | 1 |
| 11 | Profiling và phân tích hiệu năng | 18 | 1 |
| 12 | Mini-project tổng hợp | 19–20 | 2 |

## 2. Cấu trúc tuần chuẩn

| Slot | Thời lượng | Việc |
|---|---|---|
| **Thứ 2** | 60' | Đọc phần A + ghi note ngay (10' cuối) |
| **Thứ 3** | 60' | Đọc phần B + ghi note |
| **Thứ 4** | 60' | Đọc phần C + ghi note |
| **Thứ 5** | 60' | Đọc phần D / đọc lại phần khó / đọc bản dịch nếu cần |
| **Thứ 6** | 60' | Drill code duy nhất trong tuần (30–60 dòng) |
| **Thứ 7** | 120' | Lab của module (viết + chạy + đo) |
| **Chủ nhật** | 60' + 60' | 60' chốt số liệu/bảng + 60' write-up ngắn (5–10 dòng), tick tiêu chí, **buffer** |

**Quy tắc:**

1. Đọc chậm là bình thường — mỗi buổi chỉ cần **1 phần nhỏ**, đừng cố đọc hết chương trong 1h.
2. Ghi note **ngay trong buổi đọc** (5–10' cuối), không dồn tới Chủ nhật.
3. Hết 1h mà chưa xong phần đọc → dừng, đẩy phần còn lại sang Thứ 5 hoặc giờ buffer Chủ nhật.
4. Chủ nhật giờ thứ hai là **buffer**: trượt thì bù, không trượt thì nghỉ.
5. Tiêu chí hoàn thành của module tick trên website, chỉ tick khi tự trả lời được.
6. Mỗi Chủ nhật: commit `labs/` + `notes/` + Export JSON tiến độ.

**Môi trường đo (đã kiểm tra):** Apple Silicon 10 core (4P + 6E), 16GB, page 16KB, cache line 128B, clang 16
(Command Line Tools — **không có Instruments/xctrace**). Công cụ: `cc -g -Wall -Wextra -O2`, `/usr/bin/time -l`,
`sample <pid> 5 -file out.txt`, `vmmap -summary`, `heap`, `-fsanitize=address|thread`, `ps`, `top`.

---

## 3. Kế hoạch từng module

### Module 1 — Chương trình và process (Tuần 1–2)

**Chương:** Ch. 2, Ch. 4, Ch. 5 · **Deliverable:** `labs/w01/` (3 chương trình) + `notes/w01.md`

| Tuần | Ngày | Phút | Việc | Xong khi |
|---|---|---|---|---|
| 1 | Thứ 2 | 60 | Đọc Ch. 2 — ba ý tưởng lớn: virtualization, concurrency, persistence | Note 3 dòng: mỗi phần trả lời câu hỏi gì |
| 1 | Thứ 3 | 60 | Đọc Ch. 4 — process là gì, process state (Running/Ready/Blocked), PCB | Vẽ lại sơ đồ chuyển state, không nhìn sách |
| 1 | Thứ 4 | 60 | Đọc Ch. 5 — `fork`, `wait`, `exec` | Viết lại được thứ tự fork → exec → exit |
| 1 | Thứ 5 | 60 | Đọc lại Ch. 4–5 phần chưa chắc + tra từ khó (dùng bản dịch nếu cần) | Trả lời miệng được "process khác program ở đâu" |
| 1 | Thứ 6 | 60 | Drill `labs/w01/pid.cpp`: in PID/PPID + `sleep(5)`; chạy kèm `ps -o pid,ppid,stat,time,comm` | Giải thích được cột STAT của process của mình |
| 1 | Thứ 7 | 120 | Lab phần 1 — `labs/w01/fork_demo.cpp`: fork, in PID hai phía, có `wait` và không `wait` | Chỉ ra được process mồ côi/zombie bằng `ps` |
| 1 | Chủ nhật | 60+60 | Chốt bảng quan sát (pid/ppid/stat/thời gian sống) + write-up 5 dòng | Bảng có số thật, không chép sách |
| 2 | Thứ 2 | 60 | Đọc Ch. 2 phần system call: user mode vs kernel mode | Giải thích được vì sao app thường không đọc được kernel memory |
| 2 | Thứ 3 | 60 | Đọc lại Ch. 5 + ghi chú 3 lỗi hay gặp với `fork` (fd chia sẻ, thứ tự in, exit status) | Liệt kê được 3 lỗi kèm ví dụ |
| 2 | Thứ 4 | 60 | Đọc phần "Limited Direct Execution" của Ch. 6 (chỉ lấy ý, học kỹ ở Module 5) | Nêu được trap/syscall là gì |
| 2 | Thứ 5 | 60 | Tự kiểm tra 5 câu về process bằng lời của mình (không nhìn sách) | Trả lời được ≥4/5 |
| 2 | Thứ 6 | 60 | Drill `labs/w01/fork_exec.cpp` bước 1: child gọi `execv("/bin/echo", ...)`, so với `system()` | Phân biệt được fork / exec / system |
| 2 | Thứ 7 | 120 | Lab phần 2 — hoàn thiện `fork_exec`, soi binary: `file`, `otool -L`, `nm`, `size` | Giải thích được vai trò compiler / linker / executable |
| 2 | Chủ nhật | 60+60 | Write-up đầy đủ `notes/w01.md` + tick 3 tiêu chí module | 3 tiêu chí tick được mà không mở lại sách |

*Nếu dư: đọc thêm `dup2` và thử redirect stdout của child vào file.*

### Module 2 — Virtual memory và address space (Tuần 3–4)

**Chương:** Ch. 13, Ch. 14, Ch. 15 · **Deliverable:** `labs/w02/` + bảng RSS/VSZ + `notes/w02.md`

| Tuần | Ngày | Phút | Việc | Xong khi |
|---|---|---|---|---|
| 1 | Thứ 2 | 60 | Đọc Ch. 13 — address space: code, global/static, stack, heap | Vẽ được layout, chỉ đúng biến nào nằm đâu |
| 1 | Thứ 3 | 60 | Đọc Ch. 14 — `malloc`/`free`, stack vs heap, vòng đời bộ nhớ, lỗi thường gặp | Phân biệt stack/heap bằng vòng đời, nêu 3 lỗi |
| 1 | Thứ 4 | 60 | Đọc Ch. 15 — địa chỉ ảo → vật lý: base+bounds, page, page table | Giải thích "địa chỉ ảo ≠ RAM vật lý" trong 5 câu |
| 1 | Thứ 5 | 60 | Đọc lại Ch. 15 + tra cụm "page fault", "demand paging" | Nêu được page fault ở mức khái niệm |
| 1 | Thứ 6 | 60 | Drill `labs/w02/addresses.cpp`: in địa chỉ local/global/static/`new`, chạy 2 lần | Chỉ đúng vùng nhớ trên layout của từng biến |
| 1 | Thứ 7 | 120 | Lab phần 1 — chương trình `sleep` rồi chạy `vmmap -summary` và `heap <pid>` | Map được từng loại biến lên output của `vmmap` |
| 1 | Chủ nhật | 60+60 | Bảng địa chỉ + nhận xét ASLR (địa chỉ đổi giữa 2 lần chạy) | Bảng + giải thích được vì sao địa chỉ đổi |
| 2 | Thứ 2 | 60 | Đọc Ch. 13–14 phần "vùng nhớ nào tự giải phóng, vùng nào không" | Giải thích được vì sao local biến mất sau return |
| 2 | Thứ 3 | 60 | Đọc Ch. 15 phần TLB (khái niệm) | Nêu được TLB giúp gì và khi nào miss |
| 2 | Thứ 4 | 60 | Đọc lại phần page fault + ghi chú cách đo RSS/VSZ/page faults | Biết sẽ đo gì trong lab |
| 2 | Thứ 5 | 60 | Tự kiểm tra 5 câu về virtual memory | Trả lời được ≥4/5 |
| 2 | Thứ 6 | 60 | Drill `labs/w02/alloc_touch.cpp` bước 1: cấp phát 1 GiB, in `vmmap` **trước khi** ghi | Thấy VSZ lớn nhưng RSS nhỏ |
| 2 | Thứ 7 | 120 | Lab phần 2 — ghi 1 byte mỗi 16KB vs ghi toàn bộ; đo `/usr/bin/time -l`; thử ASan với double free + leak | Có bảng page faults/RSS cho 3 biến thể |
| 2 | Chủ nhật | 60+60 | Write-up + tick tiêu chí module | Giải thích được "cấp phát ≠ chạm" bằng số của mình |

*Nếu dư: thay `new` bằng `mmap` anonymous để thấy cùng cơ chế.*

### Module 3 — Memory allocation và fragmentation (Tuần 5–6)

**Chương:** Ch. 17 + ôn Ch. 14 · **Deliverable:** `labs/w03/` allocator tự viết + bảng utilization

| Tuần | Ngày | Phút | Việc | Xong khi |
|---|---|---|---|---|
| 1 | Thứ 2 | 60 | Đọc Ch. 17 nửa đầu — free list, splitting, coalescing | Giải thích được vì sao cần coalescing bằng ví dụ tự nghĩ |
| 1 | Thứ 3 | 60 | Đọc Ch. 17 nửa sau — first-fit / best-fit / worst-fit, segregated list | So sánh 3 chiến lược về ưu/nhược điểm |
| 1 | Thứ 4 | 60 | Ôn Ch. 14 + đọc lại phần allocation header/metadata | Nêu được allocator cần lưu gì trong header |
| 1 | Thứ 5 | 60 | Đọc lại phần internal vs external fragmentation | Phân biệt bằng ví dụ số cụ thể |
| 1 | Thứ 6 | 60 | Drill `labs/w03/arena.cpp`: 1 MiB buffer, bump allocator, ghi header độ dài | Cấp phát được nhiều block, in được free list |
| 1 | Thứ 7 | 120 | Lab phần 1 — thêm `free` + first-fit tìm block đầu tiên phù hợp | In được danh sách block (địa chỉ, size, trống/dùng) |
| 1 | Chủ nhật | 60+60 | Kiểm tra tính đúng (không block nào overlap) + write-up 5 dòng | Không có block nào chồng lên nhau |
| 2 | Thứ 2 | 60 | Đọc Ch. 17 + tìm hiểu malloc chunk header thực tế | So sánh được allocator sách vs malloc thật |
| 2 | Thứ 3 | 60 | Đọc lại phần coalescing, viết trước 3 bước coalesce cho code của mình | Viết được 3 bước coalesce trên giấy |
| 2 | Thứ 4 | 60 | Đọc lại + chuẩn bị workload đo utilization | Biết sẽ đo gì (bytes dùng / 1 MiB, số lần fail) |
| 2 | Thứ 5 | 60 | Tự kiểm tra 5 câu về fragmentation | Trả lời được ≥4/5 |
| 2 | Thứ 6 | 60 | Drill: thêm coalescing cho `free` | Free list gộp được 2 block liền kề |
| 2 | Thứ 7 | 120 | Lab phần 2 — workload 10k thao tác (size 16–4096, seed cố định) × 5 seed; utilization first-fit vs best-fit; so trước/sau coalescing | Bảng utilization 2 chiến lược × 5 seed |
| 2 | Chủ nhật | 60+60 | Write-up + tick tiêu chí module | Chỉ ra 1 con số chứng minh coalescing giúp giảm fragmentation |

*Nếu kẹt: bỏ best-fit, chỉ cần first-fit + coalescing là đủ tiêu chí.*

### Module 4 — CPU cache và memory locality (Tuần 7)

**Tài liệu:** không có chương OSTEP tương ứng → Drepper, *What Every Programmer Should Know About Memory*
(`https://people.freebsd.org/~lstewart/articles/cpumemory.pdf`, hoặc loạt bài LWN `https://lwn.net/Articles/250967/`)
**Deliverable:** 2 benchmark + bảng median + `notes/w04.md`

| Tuần | Ngày | Phút | Việc | Xong khi |
|---|---|---|---|---|
| 1 | Thứ 2 | 60 | Đọc phần cache hierarchy: L1/L2/L3, cache line, vì sao nạp cả line | Giải thích được "đọc 4 byte vẫn nạp 128 byte" |
| 1 | Thứ 3 | 60 | Đọc phần locality & prefetch: spatial/temporal locality | Nêu 3 cách code ảnh hưởng locality |
| 1 | Thứ 4 | 60 | Đọc lại + `sysctl hw.cachelinesize hw.l1icachesize hw.l2cachesize` | Ghi lại số của máy mình vào note |
| 1 | Thứ 5 | 60 | Đọc phần data layout (AoS/SoA), ôn bằng ví dụ ECS | Nêu được khi nào AoS tốt hơn SoA |
| 1 | Thứ 6 | 60 | Drill `labs/w04/seq_vs_rand.cpp`: mảng 256 MiB, tuần tự vs stride 16KB vs random | 3 biến thể cùng khối lượng truy cập |
| 1 | Thứ 7 | 120 | Lab — `labs/w04/aos_soa.cpp`: 1M object AoS vs SoA, cùng workload; ≥5 lần lấy median | Hai bản cùng checksum + bảng median |
| 1 | Chủ nhật | 60+60 | Bảng tổng hợp + giải thích; phân biệt cache miss vs page fault | Giải thích được mọi con số trong bảng |

*Nếu dư: đổi kích thước mảng qua các mốc 1/4/16/64 MiB để thấy điểm gãy cache.*

### Module 5 — CPU scheduling và context switch (Tuần 8–9)

**Chương:** Ch. 6, Ch. 7, Ch. 10 · **Deliverable:** bảng thread scaling 1→10 + đo chi phí context switch

| Tuần | Ngày | Phút | Việc | Xong khi |
|---|---|---|---|---|
| 1 | Thứ 2 | 60 | Đọc Ch. 6 — limited direct execution, syscall, trap, context switch | Mô tả được đường đi của 1 system call |
| 1 | Thứ 3 | 60 | Đọc Ch. 7 nửa đầu — metric (turnaround, response), FIFO, SJF | Tính tay được 1 ví dụ 3 process với FIFO/SJF |
| 1 | Thứ 4 | 60 | Đọc Ch. 7 nửa sau — STCF, RR, time slice, ảnh hưởng của I/O | Tính tay được 1 ví dụ với RR |
| 1 | Thứ 5 | 60 | Đọc lại Ch. 6 phần context switch + tra "preemption" | Phân biệt context switch với gọi hàm |
| 1 | Thứ 6 | 60 | Drill `labs/w05/burn.cpp`: workload CPU-bound, 1/2/4 thread, đo wall vs CPU time | Có số cho ≥3 mức thread |
| 1 | Thứ 7 | 120 | Lab phần 1 — mở rộng 1/2/4/8/10 thread, ≥5 lần, median | Bảng scaling bước đầu |
| 1 | Chủ nhật | 60+60 | Chốt bảng + nhận xét sơ bộ P-core/E-core | Bảng có độ biến thiên giữa các lần chạy |
| 2 | Thứ 2 | 60 | Đọc Ch. 10 — cache affinity, single vs multi queue, load balancing | Nêu được vì sao cache affinity quan trọng |
| 2 | Thứ 3 | 60 | Đọc lại Ch. 7 phần RR + time slice, ghi chú trade-off | Giải thích được time slice nhỏ/lớn ảnh hưởng gì |
| 2 | Thứ 4 | 60 | Đọc lại Ch. 6–7, chuẩn bị đo chi phí chuyển ngữ cảnh | Biết sẽ đo gì (ns/lần chuyển) |
| 2 | Thứ 5 | 60 | Tự kiểm tra 5 câu về scheduling | Trả lời được ≥4/5 |
| 2 | Thứ 6 | 60 | Drill `labs/w05/ctx.cpp`: 2 thread ping-pong qua `socketpair`; so với vòng lặp gọi hàm rỗng | Có số ns cho 1 lần chuyển và 1 lần gọi hàm |
| 2 | Thứ 7 | 120 | Lab phần 2 — `sample <pid> 5` + `top -l 2 -o cpu` khi chạy 10 thread; hoàn thiện bảng scaling | Bảng + giải thích điểm gãy |
| 2 | Chủ nhật | 60+60 | Write-up: vì sao thêm thread không tuyến tính; giới hạn benchmark; tick tiêu chí | Trả lời được "10 core nhưng speedup ≠ 10×" bằng số của mình |

### Module 6 — Thread và data race (Tuần 10–11)

**Chương:** Ch. 26, Ch. 27 · **Deliverable:** 3 phiên bản counter + TSan report + false sharing demo

| Tuần | Ngày | Phút | Việc | Xong khi |
|---|---|---|---|---|
| 1 | Thứ 2 | 60 | Đọc Ch. 26 — thread chia sẻ gì (address space, code, global), riêng gì (stack, register) | Vẽ được sơ đồ chia sẻ giữa 2 thread |
| 1 | Thứ 3 | 60 | Đọc Ch. 27 — `pthread` / `std::thread`, `join`, `detach`, `jthread` | Viết 3 dòng tạo + join thread không cần tra |
| 1 | Thứ 4 | 60 | Đọc lại Ch. 26 phần race condition + ghi chú data race vs race condition | Phân biệt bằng 1 ví dụ mỗi loại |
| 1 | Thứ 5 | 60 | Đọc lại thread lifecycle + chuẩn bị thí nghiệm counter | Biết sẽ đo gì (số lần sai/100) |
| 1 | Thứ 6 | 60 | Drill `labs/w06/counter.cpp`: 4 thread × 1M `counter++`, chạy 100 lần | Có con số "x/100 lần sai" |
| 1 | Thứ 7 | 120 | Lab phần 1 — sửa bằng `std::mutex` rồi `std::atomic` (relaxed); so throughput | 3 phiên bản đúng/sai rõ ràng |
| 1 | Chủ nhật | 60+60 | Bảng throughput 3 phiên bản + write-up 5 dòng | Bảng có median ≥5 lần |
| 2 | Thứ 2 | 60 | Đọc lại Ch. 26–27 + cách đọc ThreadSanitizer report | Hiểu report đang nói gì |
| 2 | Thứ 3 | 60 | Đọc phần memory order (relaxed vs seq_cst) ở mức khái niệm | Nêu được khác biệt chính |
| 2 | Thứ 4 | 60 | Đọc lại + chuẩn bị false sharing (cache line 128B) | Biết sẽ đo gì |
| 2 | Thứ 5 | 60 | Tự kiểm tra 5 câu về thread và race | Trả lời được ≥4/5 |
| 2 | Thứ 6 | 60 | Drill `labs/w06/false_sharing.cpp`: 2 thread tăng biến cùng cache line vs padding 128B | Có số chênh lệch |
| 2 | Thứ 7 | 120 | Lab phần 2 — build bản unsync với `-fsanitize=thread`, lưu report; thử thêm `volatile` (vẫn sai) | TSan report + giải thích vì sao không cứu được |
| 2 | Chủ nhật | 60+60 | Write-up + tick tiêu chí module | Giải thích được `counter++` không atomic bằng lời của mình |

### Module 7 — Locks và synchronization (Tuần 12–13)

**Chương:** Ch. 28, Ch. 30, Ch. 31 · **Deliverable:** bounded queue (mutex+CV và semaphore) + bảng throughput

| Tuần | Ngày | Phút | Việc | Xong khi |
|---|---|---|---|---|
| 1 | Thứ 2 | 60 | Đọc Ch. 28 — critical section, mutual exclusion, spinlock, test-and-set | Giải thích được vì sao spin hữu ích khi critical section ngắn |
| 1 | Thứ 3 | 60 | Đọc Ch. 28 phần lock contention + fair lock | Nêu được trade-off của spinlock |
| 1 | Thứ 4 | 60 | Đọc Ch. 30 — `wait`/`signal`, vì sao phải `while` chứ không `if` | Viết đúng mẫu producer/consumer trên giấy |
| 1 | Thứ 5 | 60 | Đọc lại Ch. 30 phần mất signal + broadcast | Nêu được khi nào dùng broadcast |
| 1 | Thứ 6 | 60 | Drill `labs/w07/queue_mutex.cpp`: ring buffer + mutex + 2 CV, `push`/`pop` chặn | 1 producer + 1 consumer chạy không deadlock |
| 1 | Thứ 7 | 120 | Lab phần 1 — stress test 4 producer + 4 consumer, kiểm tra tổng item khớp | 10 lần chạy đều đúng tổng |
| 1 | Chủ nhật | 60+60 | Kiểm tra correctness + write-up 5 dòng | Không mất/nhân đôi item |
| 2 | Thứ 2 | 60 | Đọc Ch. 31 — semaphore như lock và như điều kiện | Nêu được khi nào chọn semaphore thay CV |
| 2 | Thứ 3 | 60 | Đọc lại Ch. 28–31, ghi chú 4 điều kiện deadlock | Kể được 4 điều kiện deadlock |
| 2 | Thứ 4 | 60 | Đọc lại + chuẩn bị đo contention | Biết sẽ đo gì (throughput theo số thread) |
| 2 | Thứ 5 | 60 | Tự kiểm tra 5 câu về lock/CV/semaphore | Trả lời được ≥4/5 |
| 2 | Thứ 6 | 60 | Drill `labs/w07/queue_sem.cpp`: cùng bài toán bằng 2 semaphore | Chạy đúng, so được với bản mutex |
| 2 | Thứ 7 | 120 | Lab phần 2 — throughput 1/2/4/8 producer+consumer cho 2 phiên bản; cố tình tạo deadlock 2 lock ngược thứ tự rồi sửa | Bảng throughput + giải thích deadlock bằng code của mình |
| 2 | Chủ nhật | 60+60 | Write-up + tick tiêu chí module | Giải thích được contention bằng số liệu |

*Nếu kẹt: chỉ cần bản mutex+CV đúng và có bảng throughput.*

### Module 8 — Parallelism và job system (Tuần 14)

**Chương:** Ch. 29, Ch. 32, Ch. 33 · **Deliverable:** `labs/w08/` job queue + bảng speedup

| Tuần | Ngày | Phút | Việc | Xong khi |
|---|---|---|---|---|
| 1 | Thứ 2 | 60 | Đọc Ch. 29 — concurrent counter/list/queue, hand-over-hand locking | Nêu được chi phí của lock mịn |
| 1 | Thứ 3 | 60 | Đọc Ch. 32 — atomicity violation, order violation | Kể được 2 bug và cách phát hiện |
| 1 | Thứ 4 | 60 | Đọc Ch. 33 — event loop, non-blocking I/O, so với thread-per-connection | Nêu 1 ưu + 1 nhược mỗi mô hình |
| 1 | Thứ 5 | 60 | Đọc lại Ch. 29 + Amdahl (phần tuần tự giới hạn speedup) | Giải thích được Amdahl bằng ví dụ |
| 1 | Thứ 6 | 60 | Drill `labs/w08/job_queue.cpp`: queue `std::function<void()>`, N worker, mutex+CV, `shutdown()` sạch | 1000 job chạy xong, không leak thread |
| 1 | Thứ 7 | 120 | Lab — chia workload mảng thành tasks; tuần tự → thread-per-task → pool; đo 1/2/4/8/10 worker | 3 phiên bản cùng checksum + bảng speedup |
| 1 | Chủ nhật | 60+60 | Thử chunk quá nhỏ để thấy overhead + write-up + tick tiêu chí | Giải thích được vì sao task quá nhỏ lại chậm hơn |

### Module 9 — I/O và file system (Tuần 15–16)

**Chương:** Ch. 36, Ch. 39, Ch. 40 · **Deliverable:** benchmark đọc file 512 MiB + bảng theo buffer size

| Tuần | Ngày | Phút | Việc | Xong khi |
|---|---|---|---|---|
| 1 | Thứ 2 | 60 | Đọc Ch. 36 — interrupt vs DMA, driver, độ trễ thiết bị | Giải thích được vì sao I/O nhỏ lẻ tốn kém |
| 1 | Thứ 3 | 60 | Đọc Ch. 39 — file descriptor, `open/read/write/lseek/stat`, directory entry | Nêu được fd là gì |
| 1 | Thứ 4 | 60 | Đọc Ch. 39 phần hardlink vs symlink | Phân biệt được bằng thí nghiệm `ln`/`ln -s` |
| 1 | Thứ 5 | 60 | Đọc lại Ch. 36+39, ghi chú "buffered I/O" | Giải thích được vì sao lần đọc 2 nhanh hơn hẳn |
| 1 | Thứ 6 | 60 | Drill: `labs/w09/gen_data.py` sinh file 512 MiB + `read_sizes.cpp` đọc buffer 64K | Đọc đúng checksum |
| 1 | Thứ 7 | 120 | Lab phần 1 — đo buffer 4K/64K/1M/16M, ≥5 lần median | Bảng theo buffer size |
| 1 | Chủ nhật | 60+60 | Chốt bảng + write-up 5 dòng | Bảng có điều kiện đo rõ ràng |
| 2 | Thứ 2 | 60 | Đọc Ch. 40 — inode, block map, page cache | Mô tả được đường đi của 1 lần `read` |
| 2 | Thứ 3 | 60 | Đọc lại Ch. 40 phần FFS/journaling ở mức khái niệm | Nêu được vì sao cần journaling |
| 2 | Thứ 4 | 60 | Đọc lại + chuẩn bị so tuần tự vs ngẫu nhiên | Biết sẽ đo gì |
| 2 | Thứ 5 | 60 | Tự kiểm tra 5 câu về file system | Trả lời được ≥4/5 |
| 2 | Thứ 6 | 60 | Drill: thêm `pread` theo offset ngẫu nhiên vào `read_sizes.cpp` | Cùng tổng bytes, khác kiểu truy cập |
| 2 | Thứ 7 | 120 | Lab phần 2 — so tuần tự vs ngẫu nhiên, cold vs warm cache; `fs_usage -w -f filesys`; `/usr/bin/time -l` | Bảng + ghi rõ trạng thái cache từng số |
| 2 | Chủ nhật | 60+60 | Write-up (async I/O khác multithreading thế nào) + tick tiêu chí | Mọi con số đều ghi kèm điều kiện đo |

### Module 10 — Memory mapping và asset loading (Tuần 17)

**Tài liệu:** ôn Ch. 13–15, Ch. 36, Ch. 39 + `man mmap`, `man msync`
**Deliverable:** pipeline read → decode → runtime struct, 2 cách đọc, bảng tách I/O vs CPU

| Tuần | Ngày | Phút | Việc | Xong khi |
|---|---|---|---|---|
| 1 | Thứ 2 | 60 | Ôn Ch. 15 + `man mmap`: `MAP_PRIVATE` vs `MAP_SHARED`, `PROT_*`, `munmap` | Giải thích được mmap không nạp cả file vào RAM |
| 1 | Thứ 3 | 60 | Đọc đường đi page fault khi đọc file mmap; so `read()` (copy) vs `mmap` (map) | Nêu 2 khác biệt bản chất |
| 1 | Thứ 4 | 60 | Thiết kế pipeline asset: record cố định 1M bản ghi; outline 3 giai đoạn | Outline có 3 giai đoạn rõ ràng |
| 1 | Thứ 5 | 60 | Đọc `man msync` + ghi chú khi nào cần msync/không cần | Biết khi nào dữ liệu được ghi xuống đĩa |
| 1 | Thứ 6 | 60 | Drill: `labs/w10/gen_assets.py` sinh file ~24 MiB + checksum; `read_buffered.cpp` đọc bằng `ifstream` | Checksum khớp file sinh ra |
| 1 | Thứ 7 | 120 | Lab — `read_mmap.cpp` đọc cùng file bằng `mmap` + decode; đo 3 giai đoạn (read/decode/alloc) | Cùng checksum, có số từng giai đoạn |
| 1 | Chủ nhật | 60+60 | Đo ≥5 lần cả 2 cách (median), tách I/O vs decode; thử mmap chỉ chạm 1/10 dữ liệu | Bảng: thời gian, page faults, RSS |

*Nếu dư: thử `madvise(MADV_SEQUENTIAL)` rồi so lại.*

### Module 11 — Profiling và phân tích hiệu năng (Tuần 18)

**Tài liệu:** ôn các module trước + `man sample`, `man time`
**Deliverable:** 1 harness đo dùng chung + 1 báo cáo tối ưu trước/sau

| Tuần | Ngày | Phút | Việc | Xong khi |
|---|---|---|---|---|
| 1 | Thứ 2 | 60 | Lý thuyết: wall-clock vs CPU time vs throughput; sampling vs instrumentation | Phân biệt 3 loại số đo và khi nào dùng |
| 1 | Thứ 3 | 60 | Đọc `man sample`, chạy thử trên 1 chương trình của module 8 | Đọc được output, chỉ ra hàm nhiều sample nhất |
| 1 | Thứ 4 | 60 | Đọc lại ý nghĩa page faults / context switches trong `/usr/bin/time -l` | Biết chỉ số nào phản ánh vấn đề gì |
| 1 | Thứ 5 | 60 | Viết `labs/bench/bench.hpp`: timer, warm-up, N lần, median, CSV | 1 lệnh chạy ra CSV cho ≥3 benchmark cũ |
| 1 | Thứ 6 | 60 | Drill: `sample` trên benchmark module 4 (AoS vs SoA) | Ghi được hotspot + giả thuyết |
| 1 | Thứ 7 | 120 | Lab — tối ưu **một** chỗ dựa trên bằng chứng (SoA/chunk size/bỏ alloc trong loop), đo lại ≥5 lần | Có before/after chênh lệch hơn nhiễu |
| 1 | Chủ nhật | 60+60 | Viết báo cáo ngắn (bottleneck, bằng chứng, before/after, giới hạn) + tick tiêu chí | Tách được số liệu đo và giả thuyết |

### Module 12 — Mini-project: CPU-side Rendering Workload Simulator (Tuần 19–20)

**Deliverable:** `labs/final/` + báo cáo `notes/w12-report.md`

| Tuần | Ngày | Phút | Việc | Xong khi |
|---|---|---|---|---|
| 1 | Thứ 2 | 60 | Thiết kế: 1M object (pos, radius, flags), frustum AABB đơn giản, output visible list; viết README project | Có interface + cách đo viết ra giấy |
| 1 | Thứ 3 | 60 | Implement AoS single-thread baseline + sinh dữ liệu seed cố định + checksum | Baseline chạy, in checksum + thời gian |
| 1 | Thứ 4 | 60 | Implement SoA single-thread, cùng checksum | Checksum AoS == SoA |
| 1 | Thứ 5 | 60 | Đọc lại module 4 + 8, ghi chú lựa chọn thiết kế cho bản song song | Nêu được sẽ chia chunk thế nào |
| 1 | Thứ 6 | 60 | Drill: worker pool cho AoS (chunk theo index, buffer output cấp phát trước) | Kết quả đúng, không alloc trong hot loop |
| 1 | Thứ 7 | 120 | Lab phần 1 — SoA + pool; rà correctness (checksum), sửa chia chunk không đều | 4 phiên bản cùng checksum |
| 1 | Chủ nhật | 60+60 | Chạy matrix nhỏ (AoS/SoA × 1/4 thread) để chắc harness đúng | Số liệu hợp lý, không outlier lạ |
| 2 | Thứ 2 | 60 | Đọc lại kết quả, chọn 1 giả thuyết cần chứng minh | Có 1 giả thuyết rõ ràng |
| 2 | Thứ 3 | 60 | Tối ưu theo giả thuyết (layout/chunk/alloc) và đo lại | Có before/after |
| 2 | Thứ 4 | 60 | Chạy matrix đầy đủ: {AoS, SoA} × {1,2,4,8,10} × ≥5 lần | CSV trong `labs/final/results/` |
| 2 | Thứ 5 | 60 | Kiểm tra lại correctness sau tối ưu + đọc lại số liệu | Checksum không đổi |
| 2 | Thứ 6 | 60 | Viết phần "kết quả" của báo cáo (bảng + biểu đồ nếu có) | Bảng số có median + độ biến thiên |
| 2 | Thứ 7 | 120 | Viết phần "bottleneck + giới hạn" + liên hệ Unity/ECS | Báo cáo nói rõ cái gì đo được, cái gì không |
| 2 | Chủ nhật | 60+60 | Rà báo cáo, tick toàn bộ tiêu chí module, Export JSON + commit | 4 tiêu chí tick + báo cáo đọc lại thấy rõ |

---

## 4. Khi trượt tiến độ

1. Dùng giờ buffer Chủ nhật trước, rồi mới cắt phần "nếu dư".
2. Nếu 1 module 2 tuần vẫn chưa xong: dừng đọc thêm, chốt phần đang có, tick tiêu chí nào trả lời được — rồi đi tiếp.
3. Không bỏ Module 6–8 (concurrency) và Module 11 (profiling).
4. Trượt ≥2 tuần: giãn thêm 1 tuần cho module đang học và dời các module sau — đừng học cưỡi ngựa xem hoa.
