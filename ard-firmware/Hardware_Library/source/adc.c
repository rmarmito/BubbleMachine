#include <stdbool.h>
#include <stdint.h>
#include "Hardware_Library/adc.h"

struct Adc
{
    volatile uint32_t ADCACTSS;
    volatile uint32_t ADCRIS;
    volatile uint32_t ADCIM;
    volatile uint32_t ADCISC;
    volatile uint32_t ADCOSTAT;
    volatile uint32_t ADCEMUX;
    volatile uint32_t ADCUSTAT;
    volatile uint32_t ADCTSSEL;
    volatile uint32_t ADCSSPRI;
    volatile uint32_t ADCSPC;
    volatile uint32_t ADCPSSI;
    volatile uint32_t RESERVED_0[1];
    volatile uint32_t ADCSAC;
    volatile uint32_t ADCDCISC;
    volatile uint32_t ADCCTL;
    volatile uint32_t RESERVED_1[1];
    volatile uint32_t ADCSSMUX0;
    volatile uint32_t ADCSSCTL0;
    volatile uint32_t ADCSSFIFO0;
    volatile uint32_t ADCSSFSTAT0;
    volatile uint32_t ADCSSOP0;
    volatile uint32_t ADCSSDC0;
    volatile uint32_t RESERVED_2[2];
    volatile uint32_t ADCSSMUX1;
    volatile uint32_t ADCSSCTL1;
    volatile uint32_t ADCSSFIFO1;
    volatile uint32_t ADCSSFSTAT1;
    volatile uint32_t ADCSSOP1;
    volatile uint32_t ADCSSDC1;
    volatile uint32_t RESERVED_3[2];
    volatile uint32_t ADCSSMUX2;
    volatile uint32_t ADCSSCTL2;
    volatile uint32_t ADCSSFIFO2;
    volatile uint32_t ADCSSFSTAT2;
    volatile uint32_t ADCSSOP2;
    volatile uint32_t ADCSSDC2;
    volatile uint32_t RESERVED_4[2];
    volatile uint32_t ADCSSMUX3;
    volatile uint32_t ADCSSCTL3;
    volatile uint32_t ADCSSFIFO3;
    volatile uint32_t ADCSSFSTAT3;
    volatile uint32_t ADCSSOP3;
    volatile uint32_t ADCSSDC3;
    volatile uint32_t RESERVED_5[786];
    volatile uint32_t ADCDCRIC;
    volatile uint32_t RESERVED_6[63];
    volatile uint32_t ADCDCCTL0;
    volatile uint32_t ADCDCCTL1;
    volatile uint32_t ADCDCCTL2;
    volatile uint32_t ADCDCCTL3;
    volatile uint32_t ADCDCCTL4;
    volatile uint32_t ADCDCCTL5;
    volatile uint32_t ADCDCCTL6;
    volatile uint32_t ADCDCCTL7;
    volatile uint32_t RESERVED_7[8];
    volatile uint32_t ADCDCCMP0;
    volatile uint32_t ADCDCCMP1;
    volatile uint32_t ADCDCCMP2;
    volatile uint32_t ADCDCCMP3;
    volatile uint32_t ADCDCCMP4;
    volatile uint32_t ADCDCCMP5;
    volatile uint32_t ADCDCCMP6;
    volatile uint32_t ADCDCCMP7;
    volatile uint32_t RESERVED_8[88];
    volatile uint32_t ADCPP;
    volatile uint32_t ADCPC;
    volatile uint32_t ADCCC;
};

Adc *adc_address(Adc_module module)
{
    uint32_t reg[] =
    {
        0x40038000,
        0x40039000
    };
    return (void *)reg[module];
}

void adc_set_order(Adc *adc, Adc_sampler sampler, uint8_t num, Adc_channel channel)
{
    volatile uint32_t *reg[] =
    {
        &adc->ADCSSMUX0,
        &adc->ADCSSMUX1,
        &adc->ADCSSMUX2,
        &adc->ADCSSMUX3
    };
    uint32_t mask[] = {0, 4, 8, 12, 16, 20, 24, 28};
    *reg[sampler]  |= (channel << mask[num - 1]);
}

void adc_set_end(Adc *adc, Adc_sampler sampler, uint8_t num)
{
    volatile uint32_t *reg[] =
    {
        &adc->ADCSSCTL0,
        &adc->ADCSSCTL1,
        &adc->ADCSSCTL2,
        &adc->ADCSSCTL3
    };
    uint32_t mask[] =
    {
        1U << 1,  1U << 5,  1U << 9,  1U << 13,
        1U << 17, 1U << 21, 1U << 25, 1U << 29
    };
    *reg[sampler] |= mask[num - 1];
}

void adc_set_trigger(Adc *adc, Adc_sampler sampler, uint8_t num)
{
    volatile uint32_t *reg[] =
    {
        &adc->ADCSSCTL0,
        &adc->ADCSSCTL1,
        &adc->ADCSSCTL2,
        &adc->ADCSSCTL3
    };
    uint32_t mask[] =
    {
        1U << 2,  1U << 6,  1U << 10, 1U << 14,
        1U << 18, 1U << 22, 1U << 26, 1U << 30
    };
    *reg[sampler] |= mask[num - 1];
}

void adc_set_averaging(Adc *adc, Adc_oversample oversample)
{
    uint32_t mask[] = {0, 1, 2, 3, 4, 5, 6};
    adc->ADCSAC = mask[oversample];
}

void adc_enable_interrupt(Adc *adc, Adc_sampler sampler)
{
    adc->ADCIM |= (1U << sampler);
}

void adc_enable_sampler(Adc *adc, Adc_sampler sampler)
{
    adc->ADCACTSS |= (1U << sampler);
}

void adc_disable_sampler(Adc *adc, Adc_sampler sampler)
{
    adc->ADCACTSS &= ~(1U << sampler);
}

void adc_sample(Adc *adc, Adc_sampler sampler)
{
    adc->ADCPSSI |= (1U << sampler);
}

bool adc_busy(Adc *adc)
{
    if (adc->ADCACTSS & (1U << 16))
    {
        return true;
    }
    return false;
}

uint32_t adc_result(Adc *adc, Adc_sampler sampler)
{
    volatile uint32_t *reg[] =
    {
        &adc->ADCSSFIFO0,
        &adc->ADCSSFIFO1,
        &adc->ADCSSFIFO2,
        &adc->ADCSSFIFO3
    };
    return *reg[sampler];
}
