#include <stdbool.h>
#include <stdint.h>
#include "Hardware_Library/timer.h"

struct Timer
{
    volatile uint32_t GPTMCFG;
    volatile uint32_t GPTMTAMR;
    volatile uint32_t GPTMTBMR;
    volatile uint32_t GPTMCTL;
    volatile uint32_t GPTMSYNC;
    volatile uint32_t RESERVED_0[1];
    volatile uint32_t GPTMIMR;
    volatile uint32_t GPTMRIS;
    volatile uint32_t GPTMMIS;
    volatile uint32_t GPTMICR;
    volatile uint32_t GPTMTAILR;
    volatile uint32_t GPTMTBILR;
    volatile uint32_t GPTMTAMATCHR;
    volatile uint32_t GPTMTBMATCHR;
    volatile uint32_t GPTMTAPR;
    volatile uint32_t GPTMTBPR;
    volatile uint32_t GPTMTAPMR;
    volatile uint32_t GPTMTBPMR;
    volatile uint32_t GPTMTAR;
    volatile uint32_t GPTMTBR;
    volatile uint32_t GPTMTAV;
    volatile uint32_t GPTMTBV;
    volatile uint32_t GPTMRTCPD;
    volatile uint32_t GPTMTAPS;
    volatile uint32_t GPTMTBPS;
    volatile uint32_t GPTMTAPV;
    volatile uint32_t GPTMTBPV;
    volatile uint32_t RESERVED_1[981];
    volatile uint32_t GPTMPP;
};

Timer *timer_address(Timer_module module)
{
    uint32_t reg[] =
    {
        0x40030000,
        0x40031000,
        0x40032000,
        0x40033000,
        0x40034000,
        0x40035000
    };
    return (void *)reg[module];
}

void timer_set_width(Timer *timer, Timer_width width)
{
    if (width == TIMER_16_BIT)
    {
        timer->GPTMCFG |=  0x04;
    }
    else
    {
        timer->GPTMCFG &= ~0x07;
    }
}

void timer_set_mode(Timer *timer, Timer_select select, Timer_mode mode)
{
    volatile uint32_t *reg[] =
    {
        &timer->GPTMTAMR,
        &timer->GPTMTBMR
    };
    uint32_t mask[] = {0x1, 0x2};
    *reg[select] |= mask[mode];
}

void timer_set_load(Timer *timer, Timer_select select, uint32_t load)
{
    volatile uint32_t *reg[] =
    {
        &timer->GPTMTAILR,
        &timer->GPTMTBILR
    };
    *reg[select] = load;
}

void timer_enable(Timer *timer, Timer_select select)
{
    uint32_t mask[] = {(1 << 0), (1 << 8)};
    timer->GPTMCTL |= mask[select];
}

void timer_disable(Timer *timer, Timer_select select)
{
    uint32_t mask[] = {(1 << 0), (1 << 8)};
    timer->GPTMCTL &= ~mask[select];
}

void timer_interrupt(Timer *timer, Timer_interrupt timer_interrupt)
{
    uint32_t mask[] = {(1 << 0), (1 << 8)};
    timer->GPTMIMR |= mask[timer_interrupt];
}


