#include <stdlib.h>
#include <stdint.h>
#include "mempool.h"

static uint8_t mempool[MEMPOOL_SIZE];
static size_t  index;

void *mempool_allocate(size_t size)
{
    uint8_t *p;
    if(index + size > sizeof(mempool))
    {
        return NULL;
    }
    p = &mempool[index];
    index += size;
    return p;
}