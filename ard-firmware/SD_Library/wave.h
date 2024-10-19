#ifndef WAVE_H_
#define WAVE_H_

typedef struct Wave_info
{
    uint32_t file_size;
    uint32_t wave_chunk;
    uint16_t wave_type;
    uint16_t num_channels;
    uint32_t sample_rate;
    uint16_t block_align;
    uint16_t bits_per_sample;

}   Wave_info;

void wave_write_header(Wave_info info);

#endif /* WAVE_H_ */
