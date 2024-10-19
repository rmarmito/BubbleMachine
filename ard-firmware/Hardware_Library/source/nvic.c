#include <stdint.h>
#include "Hardware_Library/nvic.h"

struct Nvic
{
    volatile uint32_t EN0;
    volatile uint32_t EN1;
    volatile uint32_t EN2;
    volatile uint32_t EN3;
    volatile uint32_t EN4;
    volatile uint32_t RESERVED_0[27];
    volatile uint32_t DIS0;
    volatile uint32_t DIS1;
    volatile uint32_t DIS2;
    volatile uint32_t DIS3;
    volatile uint32_t DIS4;
    volatile uint32_t RESERVED_1[27];
    volatile uint32_t PEND0;
    volatile uint32_t PEND1;
    volatile uint32_t PEND2;
    volatile uint32_t PEND3;
    volatile uint32_t PEND4;
    volatile uint32_t RESERVED_2[27];
    volatile uint32_t UNPEND0;
    volatile uint32_t UNPEND1;
    volatile uint32_t UNPEND2;
    volatile uint32_t UNPEND3;
    volatile uint32_t UNPEND4;
    volatile uint32_t RESERVED_3[27];
    volatile uint32_t ACTIVE0;
    volatile uint32_t ACTIVE1;
    volatile uint32_t ACTIVE2;
    volatile uint32_t ACTIVE3;
    volatile uint32_t ACTIVE4;
    volatile uint32_t RESERVED_4[59];
    volatile uint32_t PRI0;
    volatile uint32_t PRI1;
    volatile uint32_t PRI2;
    volatile uint32_t PRI3;
    volatile uint32_t PRI4;
    volatile uint32_t PRI5;
    volatile uint32_t PRI6;
    volatile uint32_t PRI7;
    volatile uint32_t PRI8;
    volatile uint32_t PRI9;
    volatile uint32_t PRI10;
    volatile uint32_t PRI11;
    volatile uint32_t PRI12;
    volatile uint32_t PRI13;
    volatile uint32_t PRI14;
    volatile uint32_t PRI15;
    volatile uint32_t PRI16;
    volatile uint32_t PRI17;
    volatile uint32_t PRI18;
    volatile uint32_t PRI19;
    volatile uint32_t PRI20;
    volatile uint32_t PRI21;
    volatile uint32_t PRI22;
    volatile uint32_t PRI23;
    volatile uint32_t PRI24;
    volatile uint32_t PRI25;
    volatile uint32_t PRI26;
    volatile uint32_t PRI27;
    volatile uint32_t PRI28;
    volatile uint32_t PRI29;
    volatile uint32_t PRI30;
    volatile uint32_t PRI31;
    volatile uint32_t PRI32;
    volatile uint32_t PRI33;
    volatile uint32_t PRI34;
    volatile uint32_t RESERVED_5[669];
    volatile uint32_t SWTRIG;
};

static struct Nvic *nvic = (void *)0xE000E100UL;

void nvic_enable_interrupt(Nvic_vector vector)
{
    uint8_t vector_number[] =
    {
        16,  17,  18,  19,  20,  21,  22,  23,  24,  25,
        26,  27,  28,  29,  30,  31,  32,  33,  34,  35,
        36,  37,  38,  39,  40,  41,  42,  43,  44,  45,
        46,  47,  48,  49,  50,  51,  52,  53,  54,  55,
        56,  59,  60,  61,  62,  63,  64,  65,  66,  67,
        70,  71,  73,  74,  75,  76,  77,  78,  79,  84,
        85,  86,  87,  108, 109, 110, 111, 112, 113, 114,
        115, 116, 117, 118, 119, 120, 121, 122, 125, 126,
        150, 151, 152, 153, 154
    };
    uint32_t value = vector_number[vector];

    if (value < 32  + 16)
    {
        nvic->EN0  |= (1U << (value - 16 * 1));
    }
    else if (value < 64  + 16)
    {
        nvic->EN1 |= (1U << (value - 16 * 3));
    }
    else if (value < 96  + 16)
    {
        nvic->EN2 |= (1U << (value - 16 * 5));
    }
    else if (value < 128 + 16)
    {
        nvic->EN3 |= (1U << (value - 16 * 7));
    }
    else if (value < 160 + 16)
    {
        nvic->EN4 |= (1U << (value - 16 * 9));
    }
}
