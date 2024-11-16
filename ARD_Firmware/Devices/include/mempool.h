#ifndef MEMPOOL_H_
#define MEMPOOL_H_

#include <stdlib.h>

#define MEMPOOL_SIZE 512

void *mempool_allocate(size_t size);

#endif /* MEMPOOL_H_ */
