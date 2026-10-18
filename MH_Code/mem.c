/*
 * mem.c — OSTEP, Chapter 2 (Introduction): the memory example.
 *
 * What this program demonstrates:
 *   1. `malloc` only reserves VIRTUAL address space. Physical RAM is handed
 *      out lazily by the OS on the first *touch* of each page (page fault).
 *   2. The printed address is a virtual address: private to this process and
 *      different on every run (ASLR on macOS). It is not a RAM chip address.
 *   3. `Spin(1)` busy-waits (100% of one CPU core, process stays RUNNING),
 *      unlike `sleep(1)` which blocks and yields the CPU.
 *
 * Build:  cc -g -Wall -Wextra -O2 -o build/mem mem.c
 * Run:    ./build/mem          (this version takes no arguments)
 * Stop:   Ctrl+C
 *
 * The // a1 ... a4 markers match the annotated listing in the book.
 */

#include <unistd.h>   // getpid()  — POSIX API (also fork(), read(), write(), sleep())
#include <stdio.h>    // printf()
#include <stdlib.h>   // malloc(), atoi(), exit()
#include "common.h"   // OSTEP helper: GetTime() + Spin()  (it also pulls in <assert.h>)

int main(int argc, char *argv[])
{
    /* argc / argv are UNUSED in this version, so the compiler warns with
     * -Wall -Wextra. Three ways to silence it:
     *   - int main(void)
     *   - add: (void) argc; (void) argv;
     *   - use them like the book does: *p = atoi(argv[1]); then `./build/mem 5`
     */

    int *p = malloc(sizeof(int));   // a1: ask the heap for 4 bytes (sizeof(int) == 4 on arm64)
                                    //   - `p` itself (the pointer, 8 bytes) lives on the STACK
                                    //   - the 4 bytes it points to live on the HEAP
                                    //   - malloc_size() reports 16 bytes: the allocator has a
                                    //     minimum chunk size + bookkeeping header
                                    //   - NOTHING is in physical RAM yet, only virtual space

    assert(p != NULL);              // cheap check: the allocator may return NULL (out of memory)

    /* a2: two interesting things in one call
     *   %d + getpid() -> a real SYSTEM CALL: user mode -> kernel mode -> back
     *   %p + p        -> the VIRTUAL address in hex, per process, randomized each run
     */
    printf("(%d) address pointed to by p: %p\n",
           getpid(), p);

    *p = 0;                         // a3: FIRST TOUCH of that page.
                                    //   The address is unmapped, so the CPU raises a PAGE FAULT;
                                    //   the kernel allocates a real physical page (16 KB on Apple
                                    //   Silicon), maps it into this process, and retries the
                                    //   instruction. Your code never notices.
                                    //   Lesson: allocating memory != using memory.

    while (1) {                     // infinite loop: the process stays alive until Ctrl+C (SIGINT)
        Spin(1);                    // busy-wait 1 second: loop on gettimeofday(), burns one core,
                                    //   keeps the process in RUNNING state (visible in ps/top).
                                    //   sleep(1) would be BLOCKED instead — that is the difference
                                    //   the book wants you to see.
        *p = *p + 1;                // read-modify-write on the heap int: load -> add -> store.
                                    //   Three steps, NOT atomic. Harmless with one thread, but this
                                    //   is exactly what breaks in Ch. 26 when threads share a counter.
        printf("(%d) p: %d\n", getpid(), *p);   // a4: here *p means "the VALUE at p", not the address.
                                                //   stdout is line-buffered on a terminal (one line per
                                                //   second) but fully buffered when redirected to a
                                                //   file — so `./mem > out.txt` looks empty until 4 KB
                                                //   accumulate (or forever, if you kill it).
    }

    return 0;                       // unreachable: while (1) never ends, and the OS reclaims the whole
                                    // address space when the process dies (which is why the missing
                                    // free(p) is not a leak *here*).
}
