# Lộ trình học Operating Systems cho Graphics Programmer / Rendering Engineer

**Thời lượng:** 12 tuần  
**Khối lượng:** 5–7 giờ/tuần (mục tiêu lập kế hoạch: khoảng 6 giờ/tuần)  
**Nền tảng hiện tại:** Có thể đọc và viết C/C++, nhưng chưa hiểu sâu internals  
**Định hướng:** Graphics Programmer / Rendering Engineer

## 1. Mục tiêu

Sau 12 tuần, mục tiêu là có thể:

- Giải thích các khái niệm OS ảnh hưởng trực tiếp đến hiệu năng game engine.
- Hiểu process, virtual memory, allocation, CPU cache, scheduling, threading, synchronization và I/O.
- Viết benchmark C++ nhỏ để kiểm chứng giả thuyết về hiệu năng.
- Dùng profiler để tìm bottleneck và giải thích kết quả dựa trên số liệu.
- Liên hệ kiến thức OS với CPU-side rendering, asset loading, render thread và GPU command submission.

Đây là lộ trình xây dựng nền tảng, không nhằm đào tạo kernel developer trong 12 tuần.

## 2. Tài liệu chính

1. **Operating Systems: Three Easy Pieces (OSTEP)** — tài liệu chính, miễn phí:  
   https://pages.cs.wisc.edu/~remzi/OSTEP/
2. **LearnCpp** — ôn C++, pointer, memory và compilation:  
   https://www.learncpp.com/
3. **MIT Operating System Engineering** — tài liệu nâng cao về OS và xv6:  
   https://ocw.mit.edu/courses/6-1810-operating-system-engineering-fall-2023/
4. **OSTEP code examples** — ví dụ mã nguồn theo chủ đề:  
   https://github.com/remzi-arpacidusseau/ostep-code

### Cách sử dụng tài liệu

- Dùng OSTEP làm tài liệu chính.
- Chỉ ôn LearnCpp khi gặp lỗ hổng về C/C++.
- Dùng tài liệu MIT sau này nếu muốn tìm hiểu sâu về kernel, system calls và context switching.
- Không cần đọc hết OSTEP theo thứ tự hoặc hoàn thành mọi bài tập. Ưu tiên các chủ đề được liệt kê trong kế hoạch tuần.

## 3. Nhịp học hằng tuần

Mục tiêu khoảng 6 giờ mỗi tuần:

- **2 giờ:** Đọc lý thuyết và ghi chú các khái niệm chính.
- **3 giờ:** Viết code, chạy thí nghiệm và đo kết quả.
- **1 giờ:** Tổng kết, giải thích lại bằng lời của mình và liên hệ với game engine.

Khi benchmark, hãy ưu tiên build Release, giữ workload nhất quán, chạy nhiều lần và ghi lại môi trường thực nghiệm. Không kết luận nguyên nhân chỉ từ một lần đo.

---

## 4. Kế hoạch 12 tuần

### Tuần 1 — Chương trình và process

**Tài liệu OSTEP**
- Ch. 2 — Introduction
- Ch. 4 — Processes
- Ch. 5 — Process API

**Kiến thức cần nắm**
- Source code, executable, process và thread khác nhau thế nào.
- Process state, process creation và termination.
- System call; user mode và kernel mode.

**Bài tập**
1. Viết chương trình C++ in PID nếu hệ điều hành hỗ trợ.
2. Trên macOS/Linux, quan sát process bằng `ps` và `top`.
3. Biên dịch chương trình C++ và tìm hiểu vai trò của compiler, linker và executable.

**Tiêu chí hoàn thành**
- [ ] Giải thích được sự khác nhau giữa chương trình và process.
- [ ] Mô tả được luồng từ lúc chạy executable đến khi chương trình kết thúc.
- [ ] Giải thích được vì sao ứng dụng thông thường không thể tùy ý truy cập kernel memory.

**Liên hệ với game:** Vòng đời ứng dụng, process của game và công cụ hỗ trợ, ranh giới user/kernel.

### Tuần 2 — Virtual memory và address space

**Tài liệu OSTEP**
- Ch. 13 — Address Spaces
- Ch. 14 — Memory API
- Ch. 15 — Address Translation

**Kiến thức cần nắm**
- Stack, heap, global/static data và code segment.
- Virtual address và physical address.
- Address translation, page và page table.
- Cấp phát động và vòng đời bộ nhớ.

**Bài tập**
1. In địa chỉ của biến local, global, static và vùng nhớ cấp phát bằng `new`.
2. Cấp phát mảng lớn, ghi dữ liệu và quan sát memory usage.
3. So sánh việc cấp phát bộ nhớ với việc thực sự truy cập/ghi vào vùng nhớ đó.

**Tiêu chí hoàn thành**
- [ ] Giải thích được vì sao địa chỉ ảo không nhất thiết là địa chỉ RAM vật lý.
- [ ] Phân biệt được stack và heap về cách sử dụng và vòng đời.
- [ ] Giải thích được page fault ở mức khái niệm.

**Liên hệ với game:** Memory footprint, lỗi truy cập bộ nhớ và chi phí chạm vào các trang nhớ.

### Tuần 3 — Memory allocation và fragmentation

**Tài liệu OSTEP**
- Ch. 17 — Free-Space Management
- Ôn lại Ch. 14 — Memory API

**Kiến thức cần nắm**
- Cấp phát và giải phóng bộ nhớ.
- Internal fragmentation và external fragmentation.
- First-fit, best-fit và free-list.
- Khác biệt giữa allocator của chương trình và quản lý virtual memory của OS.

**Bài tập**
1. Viết allocator đơn giản dùng một buffer lớn, hỗ trợ cấp phát và thu hồi block.
2. Mô phỏng free-list với first-fit và best-fit.
3. Tạo workload với block kích thước khác nhau và đo tỷ lệ sử dụng bộ nhớ.

**Tiêu chí hoàn thành**
- [ ] Giải thích được vì sao tổng bộ nhớ trống vẫn có thể không đủ cho một block liên tục.
- [ ] Đo được tỷ lệ bộ nhớ hữu dụng so với tổng buffer.
- [ ] Phân biệt được allocator tự viết, `malloc`/`new` và quản lý trang của OS.

**Liên hệ với game:** Memory allocator, object pooling, cấp phát trong vòng lặp nóng và giảm allocation không cần thiết.

### Tuần 4 — CPU cache và memory locality

**Tài liệu**
- Ôn các khái niệm computer architecture: cache lines, cache hierarchy và memory locality.
- Chủ đề này bổ sung cho OSTEP; không phải chỉ riêng kiến thức OS.

**Kiến thức cần nắm**
- Cache hierarchy: L1, L2, L3 và RAM.
- Spatial locality, temporal locality và cache miss.
- Array of Structures (AoS) và Structure of Arrays (SoA).
- False sharing giữa các thread.

**Bài tập**
1. Benchmark C++ truy cập mảng lớn theo thứ tự tuần tự và thứ tự ngẫu nhiên.
2. So sánh AoS và SoA trên cùng workload.
3. Chạy mỗi benchmark nhiều lần, dùng build Release và giữ nguyên dữ liệu.

**Tiêu chí hoàn thành**
- [ ] Giải thích được vì sao truy cập tuần tự thường có locality tốt hơn.
- [ ] Phân biệt được cache miss và page fault.
- [ ] Có bảng số liệu cùng giải thích kết quả, không chỉ kết luận theo cảm giác.

**Liên hệ với game:** Scene data, culling, xử lý transform, ECS và CPU-side rendering.

### Tuần 5 — CPU scheduling và context switch

**Tài liệu OSTEP**
- Ch. 6 — Direct Execution
- Ch. 7 — CPU Scheduling
- Ch. 10 — Multi-CPU Scheduling

**Kiến thức cần nắm**
- Scheduling, preemption và time slice.
- Context switch và chi phí chuyển đổi thực thi.
- CPU-bound so với I/O-bound workload.
- Khác biệt giữa số thread và số core CPU.

**Bài tập**
1. Viết chương trình tạo CPU-bound workload với nhiều số lượng thread.
2. Đo thời gian khi số thread là 1, 2, 4 và nhiều hơn nếu phù hợp với máy.
3. Ghi lại CPU utilization và thời gian hoàn thành.

**Tiêu chí hoàn thành**
- [ ] Giải thích được vì sao thêm thread không phải lúc nào cũng tăng tốc.
- [ ] Phân biệt context switch với việc một thread gọi hàm thông thường.
- [ ] Hiểu được giới hạn của benchmark CPU-bound đơn giản.

**Liên hệ với game:** Main thread, render thread, worker threads và CPU bottleneck.

### Tuần 6 — Thread và data race

**Tài liệu OSTEP**
- Ch. 26 — Concurrency and Threads
- Ch. 27 — Thread API

**Kiến thức cần nắm**
- Process và thread chia sẻ tài nguyên nào.
- Race condition và data race.
- `std::thread`, `std::jthread` nếu compiler hỗ trợ C++20.
- Thread lifecycle, `join` và `detach`.

**Bài tập**
1. Tăng một counter từ nhiều thread.
2. Quan sát kết quả sai lệch khi dùng biến chung không có synchronization.
3. Sửa bằng `std::mutex` hoặc `std::atomic`.

**Tiêu chí hoàn thành**
- [ ] Giải thích được vì sao `counter++` không mặc nhiên là atomic.
- [ ] Phân biệt data race và race condition.
- [ ] Kiểm tra tính đúng đắn trước khi đo hiệu năng.

**Liên hệ với game:** Job System, xử lý dữ liệu song song và các lỗi khó tái hiện.

### Tuần 7 — Locks và synchronization

**Tài liệu OSTEP**
- Ch. 28 — Locks
- Ch. 30 — Condition Variables
- Ch. 31 — Semaphores

**Kiến thức cần nắm**
- Critical section và mutual exclusion.
- Mutex, condition variable và semaphore.
- Deadlock, lock contention và starvation.
- Spinlock và blocking lock ở mức nguyên lý.

**Bài tập**
1. Xây dựng producer-consumer queue có giới hạn dung lượng.
2. Dùng mutex và condition variable để đồng bộ.
3. Đo hiệu năng khi tăng số producer và consumer.

**Tiêu chí hoàn thành**
- [ ] Không mất hoặc nhân đôi dữ liệu trong workload kiểm thử.
- [ ] Giải thích được điều kiện dẫn đến deadlock.
- [ ] Giải thích được vì sao lock contention có thể làm giảm hiệu năng.

**Liên hệ với game:** Đồng bộ worker thread, hàng đợi lệnh và tranh chấp tài nguyên dùng chung.

### Tuần 8 — Parallelism và job system

**Tài liệu OSTEP**
- Ch. 29 — Locked Data Structures
- Ch. 32 — Concurrency Bugs
- Ch. 33 — Event-based Concurrency

**Kiến thức cần nắm**
- Task parallelism và data parallelism.
- Work queue, task dependencies và worker threads.
- Chi phí scheduling, synchronization và chia nhỏ công việc.
- Speedup, throughput và định luật Amdahl.

**Bài tập**
1. Viết job queue C++ có số lượng worker cố định.
2. Chia workload tính toán mảng thành nhiều task.
3. So sánh thực thi tuần tự, tạo thread cho từng task và dùng worker pool.

**Tiêu chí hoàn thành**
- [ ] Kết quả tính toán giống nhau giữa các phương án.
- [ ] Đo được speedup khi tăng worker count.
- [ ] Giải thích được vì sao task quá nhỏ có thể khiến phiên bản song song chậm hơn.

**Liên hệ với game:** Unity Job System, task scheduling và parallel CPU-side rendering.

### Tuần 9 — I/O và file system

**Tài liệu OSTEP**
- Ch. 36 — I/O Devices
- Ch. 39 — Files and Directories
- Ch. 40 — File System Implementation

**Kiến thức cần nắm**
- File descriptor/handle và system calls.
- Buffered I/O, đọc tuần tự và đọc ngẫu nhiên.
- Filesystem, metadata và chi phí I/O.
- Khái niệm asynchronous I/O.

**Bài tập**
1. Viết chương trình đọc file binary lớn với nhiều buffer size.
2. So sánh đọc tuần tự và đọc ngẫu nhiên.
3. Ghi thời gian và lượng dữ liệu đọc; lưu ý ảnh hưởng của OS cache.

**Tiêu chí hoàn thành**
- [ ] Giải thích được vì sao nhiều thao tác I/O nhỏ có thể gây overhead.
- [ ] Phân biệt asynchronous I/O với multithreading thông thường.
- [ ] Hiểu kết quả benchmark phụ thuộc cache, storage và workload.

**Liên hệ với game:** Asset loading, streaming world và đọc dữ liệu binary.

### Tuần 10 — Memory mapping và asset loading

**Tài liệu OSTEP**
- Ôn Ch. 13–15 về address space và virtual memory.
- Ôn Ch. 36 và Ch. 39 về I/O, file và directory.
- Thực hành thêm với API phù hợp của hệ điều hành.

**Kiến thức cần nắm**
- Memory-mapped files và demand paging.
- Buffered read so với memory mapping.
- I/O latency, decompression và CPU work khi nạp dữ liệu.
- Vì sao asynchronous loading không đồng nghĩa với không có hitch.

**Bài tập**
1. Đọc file binary chứa nhiều record bằng buffered read và memory mapping nếu nền tảng hỗ trợ.
2. Xây dựng pipeline nhỏ gồm đọc dữ liệu, giải mã và chuyển dữ liệu sang cấu trúc runtime.
3. Đo từng giai đoạn và tách thời gian I/O khỏi xử lý CPU khi có thể.

**Tiêu chí hoàn thành**
- [ ] Giải thích được memory mapping không có nghĩa toàn bộ file lập tức nằm trong RAM vật lý.
- [ ] Xác định được giai đoạn nào chiếm nhiều thời gian nhất.
- [ ] Nêu được ưu và nhược điểm của hai cách đọc dữ liệu.

**Liên hệ với game:** Asset streaming, binary asset pipeline và giảm hitch khi tải nội dung.

### Tuần 11 — Profiling và phân tích hiệu năng

**Tài liệu**
- Ôn các chủ đề OSTEP đã học.
- Thực hành với profiler của hệ điều hành và compiler.

**Kiến thức cần nắm**
- Wall-clock time, CPU time và throughput.
- Sampling profiler, call stack và flame graph.
- CPU utilization khác với mức độ sử dụng hiệu quả.
- Benchmark Release, warm-up và độ biến thiên kết quả.

**Bài tập**
1. Profile benchmark ở tuần 4, 5 và 8.
2. Nếu công cụ hỗ trợ, quan sát cache misses, context switches và page faults.
3. Tối ưu một workload rồi benchmark lại với cùng dữ liệu.

**Tiêu chí hoàn thành**
- [ ] Tìm được ít nhất một bottleneck có bằng chứng.
- [ ] Báo cáo median hoặc phân bố thời gian qua nhiều lần chạy.
- [ ] Phân biệt số liệu đo thực tế với giả thuyết về nguyên nhân.

**Liên hệ với game:** Dùng Unity Profiler và công cụ native để đối chiếu CPU Timeline, GC Alloc và hoạt động của thread.

### Tuần 12 — Mini-project tổng hợp

**Tên project:** CPU-side Rendering Workload Simulator

**Mục tiêu:** Mô phỏng một phần công việc CPU trước khi render. Chương trình xử lý dữ liệu của nhiều object, tính toán transform hoặc visibility đơn giản, rồi tạo danh sách object cần render.

**Yêu cầu**
- Có phiên bản AoS và SoA để so sánh.
- Có phiên bản single-thread và worker pool.
- Tránh cấp phát bộ nhớ trong vòng lặp nóng nếu không cần thiết.
- Đo thời gian xử lý, throughput và độ biến thiên.
- Viết báo cáo giải thích bottleneck, kết quả và giới hạn của benchmark.

**Tiêu chí hoàn thành**
- [ ] Kết quả đúng giữa các phiên bản.
- [ ] Có benchmark baseline trước tối ưu.
- [ ] Có ít nhất một tối ưu được chứng minh bằng số liệu.
- [ ] Giải thích được ảnh hưởng của memory locality, threading và synchronization.

**Lưu ý:** Project này mô phỏng CPU-side workload, không phải renderer đầy đủ và không đo trực tiếp GPU performance.

---

## 5. Công cụ nên sử dụng

| Công cụ | Mục đích |
|---|---|
| C++ compiler + CMake | Build benchmark độc lập, tránh overhead từ Unity Editor |
| Xcode Instruments | Quan sát CPU, memory và thời gian thực thi trên macOS |
| `ps`, `top`, `vmmap` | Quan sát process và thông tin bộ nhớ trên macOS |
| AddressSanitizer / ThreadSanitizer | Phát hiện một số lỗi memory và concurrency nếu nền tảng hỗ trợ |
| Unity Profiler | Đối chiếu với CPU Timeline, GC Alloc và các thread trong Unity |

Không cần dùng tất cả ngay từ đầu. Một compiler, một profiler và bộ benchmark được kiểm soát tốt là đủ để bắt đầu.

## 6. Checklist đánh giá sau 12 tuần

### Memory
- [ ] Giải thích virtual memory, paging và page fault.
- [ ] So sánh allocation, fragmentation và memory locality.

### Concurrency
- [ ] Giải thích race condition, mutex, atomic và deadlock.
- [ ] Xây dựng worker pool có kết quả đúng và đo được speedup.

### Performance
- [ ] Benchmark có baseline, nhiều lần chạy và số liệu đáng tin cậy.
- [ ] Dùng profiler tìm bottleneck rồi kiểm chứng tối ưu.

### Graphics application
- [ ] Giải thích mối liên hệ giữa CPU scheduling, cache và render workload.
- [ ] Nêu được giới hạn khi áp dụng benchmark C++ sang Unity hoặc renderer thực tế.

Mục tiêu sau 12 tuần là giải thích được cơ chế, tự viết thí nghiệm và đọc kết quả profiler. Không cần tự viết kernel hay nhớ chi tiết mọi thuật toán scheduling.

## 7. Sau 12 tuần nên học gì tiếp?

### A. Computer Architecture & Performance
- Cache coherence, SIMD, branch prediction và memory ordering.
- Profiling ở mức phần cứng.
- Mục tiêu: tối ưu CPU-side rendering, visibility, culling và xử lý scene data.

### B. GPU Architecture & Graphics API
- GPU execution model, command buffers, resource lifetime và synchronization.
- CPU-GPU pipeline và chi phí submit công việc.
- Mục tiêu: hiểu tác động của draw submission, resource synchronization và GPU workload lên frame time.

### C. Engine Systems & Data-Oriented Design
- Memory allocator, job system, render graph, resource streaming và dữ liệu thân thiện với cache.
- Mục tiêu: kết hợp OS, CPU architecture và graphics programming để thiết kế hệ thống hiệu năng cao.

## 8. Khuyến nghị cuối cùng

Đừng cố hoàn thành OSTEP từ đầu đến cuối ngay. Ưu tiên các chương:
- Ch. 4–7
- Ch. 13–19
- Ch. 26–33
- Ch. 36, 39–40

Các chương về advanced filesystem, RAID, distributed systems và kernel implementation có thể để sau, trừ khi công việc thực tế yêu cầu.

Với 5–7 giờ mỗi tuần, sau 12 tuần bạn sẽ có nền tảng tốt hơn để bước vào computer architecture và GPU architecture — hai mảng quan trọng cho con đường Rendering Engineer.
