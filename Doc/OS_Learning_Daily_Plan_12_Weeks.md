# Kế hoạch học chi tiết theo ngày — 12 tuần OSTEP

Tài liệu này chi tiết hoá [`OS_Learning_Roadmap_Graphics_Programmer.md`](OS_Learning_Roadmap_Graphics_Programmer.md) thành việc làm cụ thể cho từng ngày.

**Ngân sách thời gian:** Thứ 2 → Thứ 6: 1h/ngày (5h) · Thứ 7: 2h · Chủ nhật: 2h → **9h/tuần**, tổng **108h** cho 12 tuần.

Roadmap gốc giả định 6h/tuần (72h). Phần dư 36h được dùng có chủ đích:

- +1h/tuần **buffer** (Chủ nhật, giờ cuối) — để trượt tiến độ không phá cả lộ trình;
- lab cuối tuần sâu hơn (2h thay vì 1h): chạy nhiều lần, lấy median, ghi bảng số liệu;
- thêm 1 buổi/tuần viết glossary "giải thích bằng lời của mình".

> Vẫn giữ 12 tuần thay vì nén lại, vì độ khó tăng dần ở tuần 6–8 (concurrency) rất dễ ngốn thời gian. Nếu bạn thấy nhàn, có thể nén buffer lại và xong sớm ~1–2 tuần.

---

## 1. Cấu trúc tuần chuẩn (áp cho cả 12 tuần)

| Slot | Thời lượng | Loại việc | Nội dung |
|---|---|---|---|
| **Thứ 2** | 60' | Đọc A | Chương/thư mục thứ nhất + ghi note khái niệm |
| **Thứ 3** | 60' | Đọc B | Phần tiếp theo, trả lời câu hỏi "cơ chế này giải quyết vấn đề gì" |
| **Thứ 4** | 60' | Đọc C + glossary | Phần còn lại + viết 1–2 mục glossary bằng lời của mình |
| **Thứ 5** | 60' | Code nhỏ (drill) | Tái hiện khái niệm bằng 30–80 dòng C++ |
| **Thứ 6** | 60' | Code nhỏ (drill 2) | Mở rộng drill, bắt đầu in số liệu thô |
| **Thứ 7** | 120' | Lab | Bài tập chính của tuần: viết + chạy + đo nhiều lần |
| **Chủ nhật** | 60' + 60' | Đo & viết | 60' chốt số liệu/bảng + 60' write-up, tick tiêu chí, **buffer** |

Nhịp này tương ứng đúng tỷ lệ 2h đọc / 3h code / 1h tổng kết trong roadmap, chỉ phóng to theo quỹ thời gian thật.

### Quy tắc

1. **Ngày thường chỉ đọc/ôn và drill nhỏ.** Benchmark dở dang lúc hết 1h là thứ dễ bỏ nhất — để dành cho Thứ 7.
2. **Mỗi ngày kết thúc bằng 5' ghi note vào website** (tuần hiện tại → ô Ghi chú). Không dồn ghi chép tới cuối tuần.
3. **Chủ nhật commit** `labs/wNN/` + `notes/wNN.md`, rồi Export JSON tiến độ. Lịch sử git = bằng chứng bạn học đều.
4. **Tiêu chí hoàn thành là cửa chặn:** chỉ tick khi tự trả lời được bằng lời của mình, không tick vì "đã đọc xong".
5. **Trượt 1 ngày thì bù ngay trong tuần** (dùng 1h buffer Chủ nhật), trượt 2 ngày trở lên thì cắt phần "nếu dư" của tuần đó, không dồn sang tuần sau.

### Môi trường đo của bạn (đã kiểm tra)

- Apple Silicon 10 core (4P + 6E), 16GB RAM, **page size 16KB**, **cache line 128B** → mọi thí nghiệm về trang nhớ/cache phải dùng bội số của 16KB/128B, không dùng 4KB/64B kiểu sách x86.
- `clang++ 16` (Apple), GNU `make`, `python3`. **Không có CMake, không có full Xcode → không có Instruments/xctrace.**
- Bộ công cụ dùng xuyên suốt:
  - build: `clang++ -std=c++20 -O2 -Wall -Wextra` (Release, luôn giữ nguyên flag giữa các lần đo)
  - thời gian: `std::chrono::steady_clock`, in **median của ≥5 lần chạy**
  - `/usr/bin/time -l` → max RSS, page faults, context switches
  - `sample <pid> 5 -file out.txt` → profiler sampling có sẵn của macOS (thay Time Profiler)
  - `vmmap -summary <pid>`, `heap <pid>`, `leaks <pid>`
  - `-fsanitize=address`, `-fsanitize=thread` cho tuần 2 và tuần 6
  - `ps -o pid,ppid,stat,time,comm`, `top -l 2 -o cpu -n 10`
- Nếu sau này cài full Xcode thì thêm Instruments (Time Profiler, Allocations) ở tuần 11.

---

## 2. Kế hoạch từng tuần

### Tuần 1 — Chương trình và process

**Chương:** Ch. 2 (Introduction) · Ch. 4 (Processes) · Ch. 5 (Process API)
**Deliverable:** `labs/w01/` (3 chương trình) + `notes/w01.md`

| Ngày | Phút | Việc | Xong khi |
|---|---|---|---|
| Thứ 2 | 60 | Đọc Ch. 2 — ba ý tưởng lớn: virtualization, concurrency, persistence | Note được 3 dòng: mỗi phần trả lời câu hỏi gì |
| Thứ 3 | 60 | Đọc Ch. 4 — process là gì, process state (Running/Ready/Blocked), PCB | Vẽ lại được sơ đồ chuyển state, không nhìn sách |
| Thứ 4 | 60 | Đọc Ch. 5 — `fork`, `wait`, `exec` | Viết lại được thứ tự xảy ra khi fork+exec, kèm glossary "process vs program" |
| Thứ 5 | 60 | `labs/w01/pid.cpp`: in PID/PPID, `sleep(5)`; chạy song song `ps -o pid,ppid,stat,time,comm` | Thấy process của mình trong `ps` và giải thích cột STAT |
| Thứ 6 | 60 | `labs/w01/fork_demo.cpp`: fork, in PID hai phía, `wait` và không `wait` | Giải thích được vì sao không `wait` thì có process "mồ côi"/zombie |
| Thứ 7 | 120 | `labs/w01/fork_exec.cpp`: child gọi `execv("/bin/echo", ...)`; so sánh với gọi `echo` bằng `system()`; xem executable bằng `file`, `otool -L`, `nm` | Phân biệt được compiler / linker / executable và cái gì nằm trong binary |
| Chủ nhật | 60+60 | Chốt bảng quan sát (`pid`, `ppid`, `stat`, thời gian sống) → viết `notes/w01.md`: chương trình vs process, luồng chạy từ `./a.out` tới exit, vì sao user không đọc được kernel memory; tick 3 tiêu chí | 3 tiêu chí tuần 1 tick được mà không mở lại sách |

*Nếu dư thời gian:* đọc thêm Ch. 5 phần `dup2` và thử redirect stdout của child vào file.

---

### Tuần 2 — Virtual memory và address space

**Chương:** Ch. 13 (Address Spaces) · Ch. 14 (Memory API) · Ch. 15 (Address Translation)
**Deliverable:** `labs/w02/` + bảng RSS/VSZ + `notes/w02.md`

| Ngày | Phút | Việc | Xong khi |
|---|---|---|---|
| Thứ 2 | 60 | Ch. 13 — kiến trúc address space: code, global/static, stack, heap | Vẽ được layout và chỉ đúng biến nào nằm đâu |
| Thứ 3 | 60 | Ch. 14 — `malloc/free`, stack vs heap, lỗi thường gặp (leak, dangling, double free) | Liệt kê được 3 lỗi và cách nhận ra chúng |
| Thứ 4 | 60 | Ch. 15 — địa chỉ ảo → vật lý: base+bounds, page, page table, page fault ở mức khái niệm | Giải thích được "vì sao địa chỉ ảo ≠ địa chỉ RAM" trong 5 câu, ghi glossary "page fault" |
| Thứ 5 | 60 | `labs/w02/addresses.cpp`: in địa chỉ local/global/static/`new`; chạy 2 lần liên tiếp | Thấy địa chỉ đổi giữa 2 lần chạy và giải thích được đó là ASLR |
| Thứ 6 | 60 | Thêm `sleep` vào cuối chương trình, chạy nền rồi `vmmap <pid>` và `heap <pid>` | Chỉ được vùng tương ứng trên `vmmap` với từng loại biến |
| Thứ 7 | 120 | `labs/w02/alloc_touch.cpp`: cấp phát 1 GiB nhưng **chỉ ghi 1 byte mỗi 16KB**; so với bản ghi toàn bộ; đo bằng `/usr/bin/time -l` + `vmmap -summary`; thử ASan (`-fsanitize=address`) với double free và leak | Thấy rõ cấp phát ≠ chạm vào RAM vật lý (RSS khác VSZ) |
| Chủ nhật | 60+60 | Bảng: cấp phát / đã ghi / max RSS / page faults cho 3 biến thể; write-up + tick tiêu chí | Bảng số liệu + giải thích page fault bằng lời của mình |

*Nếu dư:* thử `mmap` anonymous thay `new` để thấy cùng cơ chế.

---

### Tuần 3 — Memory allocation và fragmentation

**Chương:** Ch. 17 (Free-Space Management) + ôn Ch. 14
**Deliverable:** `labs/w03/` allocator tự viết + bảng utilization

| Ngày | Phút | Việc | Xong khi |
|---|---|---|---|
| Thứ 2 | 60 | Ch. 17 nửa đầu — free list, splitting, coalescing | Giải thích được vì sao cần coalescing bằng ví dụ tự nghĩ |
| Thứ 3 | 60 | Ch. 17 nửa sau — first-fit / best-fit / worst-fit, segregated list | So sánh được 3 chiến lược về ưu/nhược điểm |
| Thứ 4 | 60 | Ôn Ch. 14 + glossary "internal vs external fragmentation" | Phân biệt được 2 loại fragmentation bằng ví dụ số cụ thể |
| Thứ 5 | 60 | `labs/w03/arena.cpp`: 1 MiB buffer, `alloc(size)` kiểu bump pointer, `free` ghi header độ dài block | Cấp phát/giải phóng được nhiều block, in được free list |
| Thứ 6 | 60 | Thêm chọn block theo first-fit; sửa lỗi khi `free` liền kề (chưa cần coalesce) | In được danh sách block: địa chỉ, size, trống/dùng |
| Thứ 7 | 120 | Workload ngẫu nhiên có seed cố định: 10k thao tác (alloc size 16–4096, free ngẫu nhiên), chạy 5 seed; đo **utilization = bytes cấp phát được / 1 MiB** và số lần fail; so first-fit vs best-fit | Có bảng utilization cho 2 chiến lược × 5 seed |
| Chủ nhật | 60+60 | Thêm coalescing rồi đo lại; thí nghiệm `std::vector::push_back` (realloc pattern) đo allocation count bằng cách override `operator new`; write-up + tick tiêu chí | Chỉ ra được 1 con số chứng minh coalescing giúp giảm fragmentation |

*Nếu kẹt:* bỏ best-fit, chỉ cần first-fit + coalescing là đủ tiêu chí.

---

### Tuần 4 — CPU cache và memory locality

**Tài liệu:** không có chương OSTEP tương ứng — dùng:
- Drepper, *What Every Programmer Should Know About Memory* (2007), phần cache hierarchy & locality
  (bản PDF phổ biến: `https://people.freebsd.org/~lstewart/articles/cpumemory.pdf`, hoặc loạt bài trên LWN `https://lwn.net/Articles/250967/`)
- Ghi chú Apple Silicon: 128B cache line, 16KB page, 4 P-core + 6 E-core

**Deliverable:** 3 benchmark + bảng median + `notes/w04.md`

| Ngày | Phút | Việc | Xong khi |
|---|---|---|---|
| Thứ 2 | 60 | Đọc phần cache hierarchy: L1/L2/L3, cache line, tại sao cache line chứ không phải từng byte | Giải thích được "đọc 4 byte vẫn phải nạp 128 byte" |
| Thứ 3 | 60 | Đọc phần locality & prefetch: spatial/temporal locality, phần nào lập trình viên kiểm soát được | Nêu được 3 cách code ảnh hưởng locality |
| Thứ 4 | 60 | `sysctl hw.cachelinesize hw.l1icachesize hw.l2cachesize hw.ncpu`; viết glossary: cache line, spatial/temporal locality, cache miss | Glossary 3 mục, mỗi mục ≤3 câu |
| Thứ 5 | 60 | `labs/w04/seq_vs_rand.cpp`: mảng `uint64_t` 256 MiB; duyệt tuần tự vs stride 16KB vs random (seed cố định); in thời gian | Chạy được 3 biến thể, cùng một khối lượng truy cập |
| Thứ 6 | 60 | `labs/w04/aos_soa.cpp`: 1M object (pos float[3], radius, id) ở dạng AoS và SoA; cùng workload cộng dồn `x` | Hai bản cho cùng kết quả checksum |
| Thứ 7 | 120 | Chạy mỗi biến thể ≥5 lần, lấy median; thêm `labs/w04/false_sharing.cpp`: 2 thread cùng tăng biến trong cùng cache line vs có padding 128B | Có bảng median đầy đủ + chênh lệch false sharing |
| Chủ nhật | 60+60 | Bảng tổng hợp + giải thích; phân biệt cache miss vs page fault (dùng số liệu tuần 2); liên hệ ECS/culling; tick tiêu chí | Giải thích được mọi con số trong bảng của mình |

*Lưu ý:* trên Apple Silicon number rất "phẳng" ở mức vài ns — đừng kết luận từ 1 lần chạy; luôn so sánh tương đối giữa các biến thể.

---

### Tuần 5 — CPU scheduling và context switch

**Chương:** Ch. 6 (Direct Execution) · Ch. 7 (CPU Scheduling) · Ch. 10 (Multi-CPU Scheduling)
**Deliverable:** bảng thread scaling 1→10 + đo chi phí context switch

| Ngày | Phút | Việc | Xong khi |
|---|---|---|---|
| Thứ 2 | 60 | Ch. 6 — user mode/kernel mode, system call, trap; cách OS chuyển giữa các process | Mô tả được đường đi của 1 system call bằng lời |
| Thứ 3 | 60 | Ch. 7 — metric (turnaround, response), FIFO/SJF/STCF/RR, time slice | Tính tay được 1 ví dụ 3 process với RR |
| Thứ 4 | 60 | Ch. 10 — cache affinity, single vs multi queue, load balancing; glossary "context switch" | Phân biệt context switch với gọi hàm bình thường |
| Thứ 5 | 60 | `labs/w05/burn.cpp`: workload CPU-bound thuần, chạy 1/2/4/8/10 thread; đo wall vs CPU time bằng `/usr/bin/time -l` | Có số cho ít nhất 3 mức thread |
| Thứ 6 | 60 | `labs/w05/ctx.cpp`: 2 thread ping-pong qua `socketpair`/pipe; so với vòng lặp gọi hàm rỗng (đo ns/lần chuyển) | Có con số ns cho 1 lần chuyển, và cho 1 lần gọi hàm |
| Thứ 7 | 120 | Hoàn thiện bảng 1/2/4/8/10 thread (≥5 lần, median); chạy `sample <pid> 5` để xem thread nằm ở đâu; `top -l 2 -o cpu` xem utilization | Bảng scaling + nhận xét P-core/E-core |
| Chủ nhật | 60+60 | Write-up: vì sao thêm thread không tuyến tính, giới hạn của benchmark đơn giản này; tick tiêu chí (có phần "hiểu giới hạn") | Trả lời được "10 core nhưng speedup ≠ 10×" bằng số liệu của mình |

*Nếu dư:* dùng `os_signpost`/`sample` để thấy thread migrate giữa P/E core (chỉ quan sát, không cần kết luận sâu).

---

### Tuần 6 — Thread và data race

**Chương:** Ch. 26 (Concurrency and Threads) · Ch. 27 (Thread API)
**Deliverable:** 3 phiên bản counter + TSan report dán vào notes

| Ngày | Phút | Việc | Xong khi |
|---|---|---|---|
| Thứ 2 | 60 | Ch. 26 — thread chia sẻ gì (address space, code, global) và riêng gì (stack, register); race condition | Vẽ lại được sơ đồ chia sẻ giữa 2 thread |
| Thứ 3 | 60 | Ch. 27 — `pthread` / `std::thread`, `join`, `detach`, `std::jthread` (C++20) | Viết được 3 dòng code tạo + join thread không cần tra |
| Thứ 4 | 60 | Ôn + glossary "data race vs race condition" | Phân biệt bằng 1 ví dụ mỗi loại |
| Thứ 5 | 60 | `labs/w06/counter.cpp`: 4 thread × 1M lần `counter++`, in giá trị cuối; chạy 100 lần, đếm số lần sai | Có con số "x/100 lần sai" |
| Thứ 6 | 60 | Sửa bằng `std::mutex`, rồi bằng `std::atomic<long>::fetch_add(relaxed)`; so throughput | 3 phiên bản cho kết quả đúng/ sai rõ ràng |
| Thứ 7 | 120 | Build lại bản unsync với `-fsanitize=thread` → lưu warning vào notes; thử thêm volatile (vẫn sai); đo throughput 3 phiên bản (≥5 lần, median) | Có TSan report + bảng throughput |
| Chủ nhật | 60+60 | Write-up: vì sao `counter++` không atomic, vì sao volatile không cứu được; tick tiêu chí (giờ thứ hai = buffer nếu trượt TSan/đo) | 3 tiêu chí tuần 6 tick, có bằng chứng |

---

### Tuần 7 — Locks và synchronization

**Chương:** Ch. 28 (Locks) · Ch. 30 (Condition Variables) · Ch. 31 (Semaphores)
**Deliverable:** bounded queue + 2 phiên bản (mutex+CV, semaphore) + bảng throughput

| Ngày | Phút | Việc | Xong khi |
|---|---|---|---|
| Thứ 2 | 60 | Ch. 28 — critical section, mutual exclusion, spinlock, test-and-set, lock contention | Giải thích được vì sao spin giúp ích khi critical section rất ngắn |
| Thứ 3 | 60 | Ch. 30 — `wait`/`signal`, lý do phải `while` chứ không `if`, mất signal | Viết đúng mẫu producer/consumer trên giấy |
| Thứ 4 | 60 | Ch. 31 — semaphore như lock và như điều kiện; glossary "semaphore vs CV" | Nêu được khi nào chọn cái nào |
| Thứ 5 | 60 | `labs/w07/queue_mutex.cpp`: bounded queue (ring buffer) với mutex + 2 CV, `push`/`pop` chặn | Compile + chạy 1 producer 1 consumer không deadlock |
| Thứ 6 | 60 | Thêm `queue_sem.cpp` dùng 2 semaphore; stress test: 4 producer + 4 consumer, kiểm tra tổng item khớp | Tổng item vào = tổng item ra ở 10 lần chạy |
| Thứ 7 | 120 | Đo throughput khi tăng số producer/consumer (1/2/4/8 mỗi loại) cho cả 2 phiên bản; cố tình tạo deadlock 2 lock ngược thứ tự rồi sửa | Bảng throughput + giải thích deadlock bằng chính code của mình |
| Chủ nhật | 60+60 | Write-up: vì sao contention làm giảm hiệu năng (dùng số liệu), starvation; tick tiêu chí | 3 tiêu chí tuần 7 tick |

*Nếu kẹt:* chỉ cần mutex+CV đúng và có bảng throughput — phần semaphore có thể lùi sang tuần 8 ngày Thứ 2.

---

### Tuần 8 — Parallelism và job system

**Chương:** Ch. 29 (Locked Data Structures) · Ch. 32 (Concurrency Bugs) · Ch. 33 (Event-based Concurrency)
**Deliverable:** `labs/w08/job_system` + bảng speedup 1→10 worker

| Ngày | Phút | Việc | Xong khi |
|---|---|---|---|
| Thứ 2 | 60 | Ch. 29 — concurrent counter/list/queue, hand-over-hand locking | Nêu được chi phí của lock mịn |
| Thứ 3 | 60 | Ch. 32 — non-deadlock bugs: atomicity violation, order violation | Kể được 2 bug và cách phát hiện |
| Thứ 4 | 60 | Ch. 33 — event loop, non-blocking I/O, so với thread-per-connection; glossary "event-based vs thread-based" | Nêu được 1 ưu và 1 nhược của mỗi mô hình |
| Thứ 5 | 60 | `labs/w08/job_queue.cpp`: queue `std::function<void()>`, N worker cố định, mutex + CV, `shutdown()` sạch | Submit 1000 job, chạy xong, không leak thread |
| Thứ 6 | 60 | Chia workload: tính tổng mảng lớn thành tasks theo chunk; chạy tuần tự → thread-per-task → pool | 3 phiên bản ra cùng checksum |
| Thứ 7 | 120 | Đo speedup 1/2/4/8/10 worker (≥5 lần, median); thử chunk quá nhỏ (1 task/10 phần tử) để thấy overhead; tính Amdahl với phần tuần tự | Bảng speedup + giải thích điểm gãy |
| Chủ nhật | 60+60 | Write-up: task granularity, vì sao task quá nhỏ lại chậm hơn; tick tiêu chí | 3 tiêu chí tuần 8 tick |

---

### Tuần 9 — I/O và file system

**Chương:** Ch. 36 (I/O Devices) · Ch. 39 (Files and Directories) · Ch. 40 (File System Implementation)
**Deliverable:** benchmark đọc file 512 MiB + bảng theo buffer size

| Ngày | Phút | Việc | Xong khi |
|---|---|---|---|
| Thứ 2 | 60 | Ch. 36 — interrupt vs DMA, driver, độ trễ đĩa/SSD | Giải thích được vì sao I/O nhỏ lẻ tốn kém |
| Thứ 3 | 60 | Ch. 39 — file descriptor, `open/read/write/lseek/stat`, directory entry, hardlink vs symlink | Phân biệt được hardlink và symlink bằng thí nghiệm nhỏ |
| Thứ 4 | 60 | Ch. 40 — inode, block map, buffered I/O và page cache của OS; glossary "buffered I/O" | Giải thích được vì sao lần đọc thứ 2 nhanh hơn hẳn |
| Thứ 5 | 60 | Tạo dữ liệu test bằng `python3`: file binary 512 MiB (`os.urandom` theo block); viết `labs/w09/read_sizes.cpp` đọc với buffer 4K/64K/1M/16M | Có số cho 4 buffer size |
| Thứ 6 | 60 | Thêm đọc kiểu `pread` theo offset ngẫu nhiên (cùng tổng bytes) để so tuần tự vs ngẫu nhiên | Có số cho cả 2 kiểu truy cập |
| Thứ 7 | 120 | Chạy ≥5 lần/ cấu hình (median); đo cold vs warm cache (file mới tạo vs file vừa đọc); quan sát `fs_usage -w -f filesys <pid>` và `/usr/bin/time -l` | Bảng đầy đủ + ghi rõ điều kiện cache cho từng số |
| Chủ nhật | 60+60 | Write-up: overhead của I/O nhỏ, cache ảnh hưởng kết quả thế nào, async I/O khác multithreading ở đâu (đo 1 thread buffer lớn vs 4 thread đọc song song); tick tiêu chí | 3 tiêu chí tuần 9 tick, mọi số đều ghi kèm điều kiện đo |

---

### Tuần 10 — Memory mapping và asset loading

**Tài liệu:** ôn Ch. 13–15, Ch. 36, Ch. 39 + `man mmap`, `man msync`
**Deliverable:** pipeline read → decode → runtime struct, 2 cách đọc, bảng tách I/O vs CPU

| Ngày | Phút | Việc | Xong khi |
|---|---|---|---|
| Thứ 2 | 60 | Ôn Ch. 15 + đọc `man mmap`: `MAP_PRIVATE` vs `MAP_SHARED`, `PROT_*`, `msync`, `munmap` | Giải thích được mmap không nạp cả file vào RAM |
| Thứ 3 | 60 | Đường đi page fault khi đọc file mmap; so với `read()` copy dữ liệu vào user buffer | Nêu được 2 khác biệt bản chất (copy vs map) |
| Thứ 4 | 60 | Thiết kế pipeline cho asset: record cố định (id, pos[3], radius) 1M bản ghi; viết outline + chọn cấu trúc runtime; glossary "demand paging" | Outline pipeline có 3 giai đoạn rõ ràng |
| Thứ 5 | 60 | Viết `labs/w10/gen_assets.py` sinh file binary ~24 MiB (1M record) + checksum; `labs/w10/read_buffered.cpp` đọc bằng `ifstream` và decode vào `std::vector` | Checksum khớp với file sinh ra |
| Thứ 6 | 60 | `labs/w10/read_mmap.cpp` đọc cùng file bằng `mmap` + decode; đo wall time; đếm page faults bằng `/usr/bin/time -l` | Cùng checksum, có số thời gian 3 giai đoạn (read/decode/alloc) |
| Thứ 7 | 120 | Đo ≥5 lần cả 2 cách (median), tách thời gian I/O vs decode; thử đọc mmap nhưng chỉ chạm 1/10 dữ liệu để thấy demand paging | Bảng: tổng thời gian, page faults, RSS cho 2 cách |
| Chủ nhật | 60+60 | Write-up: ưu/nhược của mmap vs buffered read cho asset pipeline, vì sao async load vẫn có hitch; tick tiêu chí | 3 tiêu chí tuần 10 tick |

---

### Tuần 11 — Profiling và phân tích hiệu năng

**Tài liệu:** ôn các tuần trước + `man sample`, `man time`; Instruments chỉ có nếu cài full Xcode
**Deliverable:** 1 harness đo thống nhất + 1 báo cáo tối ưu trước/sau

| Ngày | Phút | Việc | Xong khi |
|---|---|---|---|
| Thứ 2 | 60 | Lý thuyết: wall-clock vs CPU time vs throughput; sampling profiler vs instrumentation; flame graph | Phân biệt được 3 loại số đo và khi nào dùng cái nào |
| Thứ 3 | 60 | Đọc `man sample`, chạy thử `sample <pid> 2 -file /tmp/s.txt` trên 1 chương trình tuần 8 | Đọc được output, chỉ ra được hàm chiếm nhiều sample nhất |
| Thứ 4 | 60 | Viết `labs/bench/bench.hpp` dùng chung: timer, warm-up, N lần, median, in CSV; port lại benchmark tuần 4/5/8 sang harness này | 1 lệnh chạy ra bảng CSV cho ≥3 benchmark |
| Thứ 5 | 60 | `sample` trên benchmark tuần 4 (AoS vs SoA) → xác định hotspot thật | Ghi được hotspot + giả thuyết nguyên nhân |
| Thứ 6 | 60 | `sample` trên job system tuần 8 → chỗ contention/spin; `/usr/bin/time -l` cho context switches | Chỉ ra được 1 bottleneck có bằng chứng |
| Thứ 7 | 120 | Tối ưu **một** chỗ dựa trên bằng chứng (ví dụ SoA + chunk size lớn hơn, hoặc bỏ allocation trong loop), đo lại ≥5 lần cùng dữ liệu | Có before/after với chênh lệch rõ ràng hơn nhiễu |
| Chủ nhật | 60+60 | Viết báo cáo ngắn: bottleneck, bằng chứng (số sample), before/after, giới hạn; tick tiêu chí | Tách được "số liệu đo" và "giả thuyết nguyên nhân" trong báo cáo |

*Nếu có full Xcode:* thay `sample` bằng Instruments Time Profiler + Allocations và đối chiếu 2 công cụ.

---

### Tuần 12 — Mini-project: CPU-side Rendering Workload Simulator

**Deliverable:** `labs/final/` + báo cáo `notes/w12-report.md`

| Ngày | Phút | Việc | Xong khi |
|---|---|---|---|
| Thứ 2 | 60 | Thiết kế: 1M object (pos, radius, flags), camera/frustum đơn giản (hộp AABB), output danh sách visible; viết `README` mục tiêu + interface + cách đo | Có khung interface + tiêu chí benchmark viết ra giấy |
| Thứ 3 | 60 | Implement AoS single-thread baseline (culling đơn giản) + sinh dữ liệu seed cố định + checksum kết quả | Baseline chạy được, in checksum + thời gian |
| Thứ 4 | 60 | Implement SoA single-thread, cùng checksum | Checksum AoS == SoA |
| Thứ 5 | 60 | Worker pool cho AoS: chia chunk theo index, không cấp phát trong vòng lặp nóng (buffer output cấp phát trước) | Kết quả đúng, không alloc trong hot loop (kiểm bằng `heap`/exit stats) |
| Thứ 6 | 60 | SoA + pool; rà lại correctness (so checksum), sửa lỗi dữ liệu chia không đều | 4 phiên bản cho cùng checksum |
| Thứ 7 | 120 | Benchmark matrix: {AoS, SoA} × {1, 2, 4, 8, 10} worker × ≥5 lần → median, độ biến thiên; lưu CSV | Bảng đầy đủ + CSV trong `labs/final/results/` |
| Chủ nhật | 60+60 | Viết báo cáo: bottleneck, tác động memory locality vs threading, giới hạn (không đo GPU, không phải renderer thật), liên hệ Unity/ECS; tick toàn bộ tiêu chí; Export JSON + commit | 4 tiêu chí tuần 12 tick + báo cáo đọc lại thấy rõ ràng |

---

## 3. Cách đối chiếu với website

- Mỗi sáng mở dashboard → làm đúng việc của ngày trong bảng trên.
- Tick **Kiến thức** khi đọc xong phần tương ứng, tick **Bài tập** khi chương trình chạy được.
- Tick **Tiêu chí hoàn thành** chỉ vào Chủ nhật, sau khi viết write-up.
- Ghi chú của tuần: dùng làm nơi dán số liệu thô, TSan/sample report, câu hỏi còn mở.
- Export JSON ngay sau khi commit cuối tuần → `git add` file export cùng `labs/` và `notes/`.

## 4. Khi trượt tiến độ (làm trước, đừng nghĩ nhiều)

1. Bỏ phần "nếu dư" của tuần.
2. Gộp Thứ 6 + Thứ 7 nếu ngày thường bị cắt (lab quan trọng hơn drill 2).
3. Tuyệt đối không bỏ tuần 6, 7, 8 (concurrency) và tuần 11 (profiling) — đây là phần chuyển hoá được sang công việc rendering.
4. Trượt ≥ 1 tuần: dùng tuần cuối của tháng đó làm "tuần đệm", dời lịch 12 tuần thay vì học cưỡi ngựa xem hoa.
