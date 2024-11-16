#ifndef SYSTICK_H_
#define SYSTICK_H_

#include <stdbool.h>
#include <stdint.h>

typedef enum
{
    SYSTICK_PIOSC_DIV4,
    SYSTICK_SYSTEM_CLOCK

}   Systick_source;

typedef enum
{
    SYSTICK0,
    SYSTICK1,
    SYSTICK2,
    SYSTICK3,
    SYSTICK_MAX

}   Systick_timer;

void systick_source(Systick_source source);

void systick_reload(uint32_t value);

void systick_reset(void);

void systick_interrupt(void);

void systick_start(void);

void systick_stop(void);

bool systick_delay(Systick_timer event, uint32_t millisecond);

uint32_t systick_current(Systick_timer event);

void systick_clear(Systick_timer event);

#endif /* SYSTICK_H_ */
