#ifndef SSI_H_
#define SSI_H_

#include <stdint.h>

typedef struct Ssi Ssi;

typedef enum
{
    SSI_MOD0,
    SSI_MOD1,
    SSI_MOD2,
    SSI_MOD3

}   Ssi_module;

typedef enum
{
    SSI_FIRST_EDGE,
    SSI_SECOND_EDGE

}   Ssi_phase;

typedef enum
{
    SSI_STEADY_STATE_HIGH,
    SSI_STEADY_STATE_LOW

}   Ssi_polarity;

typedef enum
{
    SSI_FREESCALE,
    SSI_TI,
    SSI_MICROWIRE

}   Ssi_format;

typedef enum
{
    SSI_8_MHZ,
    SSI_4_MHZ,
    SSI_2_MHZ,
    SSI_1_MHZ

}   Ssi_rate;

typedef enum
{
    SSI_SIZE_4,
    SSI_SIZE_5,
    SSI_SIZE_6,
    SSI_SIZE_7,
    SSI_SIZE_8,
    SSI_SIZE_9,
    SSI_SIZE_10,
    SSI_SIZE_11,
    SSI_SIZE_12,
    SSI_SIZE_13,
    SSI_SIZE_14,
    SSI_SIZE_15,
    SSI_SIZE_16

}   Ssi_size;

typedef enum
{
    SSI_MASTER,
    SSI_SLAVE

}   Ssi_mode;

Ssi *ssi_address(Ssi_module module);

void ssi_set_phase(Ssi *ssi, Ssi_phase phase);

void ssi_set_polarity(Ssi *ssi, Ssi_polarity polarity);

void ssi_set_format(Ssi *ssi, Ssi_format format);

void ssi_set_rate(Ssi *ssi, Ssi_rate rate);

void ssi_set_size(Ssi *ssi, Ssi_size size);

void ssi_set_mode(Ssi *ssi, Ssi_mode mode);

void ssi_enable_module(Ssi *ssi);

void ssi_disable_module(Ssi *ssi);

uint16_t ssi_write(Ssi *ssi, uint16_t data);

#endif /* SSI_H_ */
