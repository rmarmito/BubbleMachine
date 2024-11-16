#ifndef WAVE_H_
#define WAVE_H_

#include <stdint.h>
#include "ff.h"

/*
    https://hexed.it/
    https://ccrma.stanford.edu/courses/422-winter-2014/projects/WaveFormat/
*/

typedef struct Wave_info
{
    uint32_t chunk_size;
    uint16_t num_channels;
    uint32_t sample_rate;
    uint16_t bits_per_sample;
    uint32_t header_bytes;

}   Wave_info;

void wave_write_header(FIL *file, Wave_info *info);

void wave_update_header(FIL *file, Wave_info *info);

#endif /* WAVE_H_ */
