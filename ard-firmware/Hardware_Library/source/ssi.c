#include <stdbool.h>
#include <stdint.h>
#include "Hardware_Library/ssi.h"

struct Ssi
{
    volatile uint32_t SSICR0;
    volatile uint32_t SSICR1;
    volatile uint32_t SSIDR;
    volatile uint32_t SSISR;
    volatile uint32_t SSICPSR;
    volatile uint32_t SSIIM;
    volatile uint32_t SSIRIS;
    volatile uint32_t SSIMIS;
    volatile uint32_t SSIICR;
    volatile uint32_t SSIDMACTL;
    volatile uint32_t RESERVED_0[1000];
    volatile uint32_t SSICC;
};

Ssi *ssi_address(Ssi_module module)
{
    uint32_t reg[] =
    {
        0x40008000,
        0x40009000,
        0x4000A000,
        0x4000B000
    };
    return (void *)reg[module];
}

void ssi_set_phase(Ssi *ssi, Ssi_phase phase)
{
    if (phase == SSI_SECOND_EDGE)
    {
        ssi->SSICR0 |= (1U << 7);
    }
    else
    {
        ssi->SSICR0 &= ~(1U << 7);
    }
}

void ssi_set_polarity(Ssi *ssi, Ssi_polarity polarity)
{
    if (polarity == SSI_STEADY_STATE_HIGH)
    {
        ssi->SSICR0 |= (1U << 6);
    }
    else
    {
        ssi->SSICR0 &= ~(1U << 6);
    }
}

void ssi_set_format(Ssi *ssi, Ssi_format format)
{
    uint32_t mask[] =
    {
        0x0U << 4,
        0x1U << 4,
        0x2U << 4
    };
    ssi->SSICR0 |= mask[format];
}

void ssi_set_rate(Ssi *ssi, Ssi_rate rate)
{
    uint32_t mask[] =
    {
        0x02, 0x04,
        0x08, 0x10
    };
    ssi->SSICPSR = mask[rate];
}

void ssi_set_size(Ssi *ssi, Ssi_size size)
{
    uint32_t mask[] =
    {
        0x3, 0x4, 0x5, 0x6,
        0x7, 0x8, 0x9, 0xA,
        0xB, 0xC, 0xD, 0xE,
        0xF
    };
    ssi->SSICR0 |= mask[size];
}

void ssi_set_mode(Ssi *ssi, Ssi_mode mode)
{
    if (mode == SSI_SLAVE)
    {
        ssi->SSICR1 |= (1U << 2);
    }
    else
    {
        ssi->SSICR1 &= ~(1U << 2);
    }
}

void ssi_enable_module(Ssi *ssi)
{
    ssi->SSICR1 |= (1U << 1);
}

void ssi_disable_module(Ssi *ssi)
{
    ssi->SSICR1 &= ~(1U << 1);
}

uint16_t ssi_write(Ssi *ssi, uint16_t data)
{
    ssi->SSIDR = data;
    bool busy = true;
    while (busy)
    {
        busy = ssi->SSISR & (1U << 4);
    }
    return ssi->SSIDR;
}
