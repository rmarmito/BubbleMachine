#include <stdbool.h>
#include <stdint.h>
#include "Hardware_Library/systick.h"

struct Systick
{
    volatile uint32_t STCTRL;
    volatile uint32_t STRELOAD;
    volatile uint32_t STCURRENT;
};

static struct Systick *systick = (void *)0xE000E010UL;

void systick_source(Systick_source source)
{
    if (source == SYSTICK_SYSTEM_CLOCK)
    {
        systick->STCTRL |= (1U << 2);
    }
    else
    {
        systick->STCTRL &= ~(1U << 2);
    }
}

void systick_reload(uint32_t value)
{
    systick->STRELOAD = value;
}

void systick_reset(void)
{
    systick->STCURRENT = 0;
}

void systick_interrupt(void)
{
    systick->STCTRL |= (1U << 1);
}

void systick_start(void)
{
    systick->STCTRL |= (1U << 0);
}

void systick_stop(void)
{
    systick->STCTRL &= ~(1U << 0);
}

static volatile uint32_t count[SYSTICK_MAX];

bool systick_delay(Systick_timer event, uint32_t millisecond)
{
    if (count[event] >= millisecond)
    {
        count[event] = 0;
        return true;
    }
    return false;
}

uint32_t systick_current(Systick_timer event)
{
    return count[event];
}

void systick_clear(Systick_timer event)
{
    count[event] = 0;
}

void isr_systick(void)
{
    for (uint8_t i = 0; i < SYSTICK_MAX; i++)
    {
        count[i]++;
    }
}

