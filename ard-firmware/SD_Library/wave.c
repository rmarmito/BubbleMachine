#include <stdint.h>
#include "SD_Library/wave.h"

// result = f_write(&file, &byte, sizeof(uint8_t), &num_bytes);

/*for (uint8_t i = 0, j = 0; i < 4; i += 1, j += 8)
{
    bool success = sd_write_byte(bytes >> j);
    if (!success)
    {
        return false;
    }
}
return true;*/

void wave_write_header(Wave_info info)
{
//    uint32_t bytes_per_sec = (info.sample_rate * info.bits_per_sample * info.num_channels) / 8;
//    write_array((uint8_t []){'R','I','F','F'}, 4);
//    write_uint32(info.file_size);
//    write_array((uint8_t []){'W','A','V','E'}, 4);
//    write_array((uint8_t []){'f','m','t',' '}, 4);
//    write_uint32(info.wave_chunk);
//    write_uint16(info.wave_type);
//    write_uint16(info.num_channels);
//    write_uint32(info.sample_rate);
//    write_uint32(bytes_per_sec);
//    write_uint16(info.block_align);
//    write_uint16(info.bits_per_sample);
//    write_array((uint8_t []){'d','a','t','a'}, 4);
}
