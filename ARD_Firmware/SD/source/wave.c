#include <stdint.h>
#include "wave.h"
#include "ff.h"

static void write_uint16(FIL* file, uint32_t bytes)
{
    for (uint8_t i = 0, j = 0; i < 2; i += 1, j += 8)
    {
        f_putc((bytes >> j), file);
    }
}

static void write_uint32(FIL* file, uint32_t bytes)
{
    for (uint8_t i = 0, j = 0; i < 4; i += 1, j += 8)
    {
        f_putc((bytes >> j), file);
    }
}

void wave_write_header(FIL* file, Wave_info *info)
{
    info->header_bytes = 0;
    info->chunk_size = 0;
    /**********************************************************
        (4) chunk_id:

        Contains the letters "RIFF" in ASCII form
        0x52494646 big-endian form.
    ***********************************************************/
    uint8_t chunk_id[] = {'R','I','F','F'};
    f_write(file, chunk_id, sizeof(chunk_id), 0);

    /**********************************************************
        (4) chunk_size :

        36 + SubChunk2Size, or more precisely:
        4 + (8 + SubChunk1Size) + (8 + SubChunk2Size)
        This is the size of the rest of the chunk
        following this number.  This is the size of the
        entire file in bytes minus 8 bytes for the
        two fields not included in this count:
        ChunkID and ChunkSize.
    **********************************************************/
    write_uint32(file, 0); // To be filled in on file close;

    /**********************************************************
        (4) format :

        Contains the letters "WAVE"
        0x57415645 big-endian form.
    ***********************************************************/
    uint8_t format[] = {'W','A','V','E'};
    f_write(file, format, sizeof(format), 0);
    info->header_bytes += sizeof(format);

    /**********************************************************
        (4) sub_chunk1_id :

        Contains the letters "fmt "
        0x666D7420 big-endian form.
    ***********************************************************/
    uint8_t sub_chunk1_id[] = {'f','m','t',' '};
    f_write(file, sub_chunk1_id, sizeof(sub_chunk1_id), 0);
    info->header_bytes += sizeof(sub_chunk1_id);

    /**********************************************************
        (4) sub_chunk1_size :

        16 for PCM.  This is the size of
        the rest of the Subchunk which follows this number.
    ***********************************************************/
    uint32_t sub_chunk1_size = 16;
    write_uint32(file, sub_chunk1_size);
    info->header_bytes += sizeof(sub_chunk1_size);

    /**********************************************************
        (4) audio_format :

        PCM = 1 (i.e. Linear quantization)
        Values other than 1 indicate some form of compression.
    ***********************************************************/
    uint16_t audio_format = 1;
    write_uint16(file, audio_format);
    info->header_bytes += sizeof(audio_format);

    /**********************************************************
        (2) num_channels :

        Mono = 1, Stereo = 2, etc.
    ***********************************************************/
    write_uint16(file, info->num_channels);
    info->header_bytes += sizeof(info->num_channels);

    /**********************************************************
        (4) sample_rate :

        8000, 44100, etc.
    ***********************************************************/
    write_uint32(file, info->sample_rate);
    info->header_bytes += sizeof(info->sample_rate);

    /**********************************************************
        (4) byte_rate :

        sample_rate * num_channels * bits_per_sample/8.
    ***********************************************************/
    uint32_t byte_rate = info->sample_rate * info->num_channels * info->bits_per_sample / 8;
    write_uint32(file, byte_rate);
    info->header_bytes += sizeof(byte_rate);

    /**********************************************************
        (2) block_align :

        num_channels * bits_per_sample / 8
        The number of bytes for one sample including all channels.
    ***********************************************************/
    uint16_t block_align =  info->num_channels * info->bits_per_sample / 8;
    write_uint16(file, block_align);
    info->header_bytes += sizeof(block_align);

    /**********************************************************
        (2) bits_per_sample :

        8 bits = 8, 16 bits = 16, etc.
    ***********************************************************/
    write_uint16(file, info->bits_per_sample);
    info->header_bytes += sizeof(info->bits_per_sample);

    /**********************************************************
        (4) sub_chunk2_id :

        Contains the letters "data"
        0x64617461 big-endian form.
    ***********************************************************/
    uint8_t sub_chunk2_id[] = {'d','a','t','a'};
    f_write(file, sub_chunk2_id, sizeof(sub_chunk2_id), 0);
    info->header_bytes += sizeof(sub_chunk2_id);

    /**********************************************************
        (4) sub_chunk2_size :

        NumSamples * NumChannels * BitsPerSample/8
        This is the number of bytes in the data.
    ***********************************************************/
    uint32_t sub_chunk2_size = 0; // To be filled in on file close;
    write_uint32(file, sub_chunk2_size);
    info->header_bytes += sizeof(sub_chunk2_size);

    info->chunk_size += info->header_bytes;
}

void wave_update_header(FIL *file, Wave_info *info)
{
    DWORD chunk_size_position = 4;
    f_lseek(file, chunk_size_position);
    write_uint32(file, info->chunk_size);

    DWORD sub_chunk2_size = 40;
    f_lseek(file, sub_chunk2_size);
    write_uint32(file, info->chunk_size - info->header_bytes);
}
