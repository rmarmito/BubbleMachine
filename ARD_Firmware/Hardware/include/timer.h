#ifndef TIMER_H_
#define TIMER_H_

#include <stdbool.h>
#include <stdint.h>

typedef struct Timer Timer;

typedef enum
{
    TIMER_MOD0,
    TIMER_MOD1,
    TIMER_MOD2,
    TIMER_MOD3,
    TIMER_MOD4,
    TIMER_MOD5

}   Timer_module;

typedef enum
{
    TIMER_32_BIT,
    TIMER_16_BIT

}   Timer_width;

typedef enum
{
    TIMER_A,
    TIMER_B

}   Timer_select;

typedef enum
{
    TIMER_ONE_SHOT,
    TIMER_PERIODIC,

}   Timer_mode;

typedef enum
{
    TIMER_A_TIMEOUT,
    TIMER_B_TIMEOUT

}   Timer_interrupt;

typedef enum
{
    TIMER_0,
    TIMER_1,
    TIMER_2,
    TIMER_3,
    TIMER_EVENT_MAX

}   Timer_event;

Timer *timer_address(Timer_module module);

void timer_set_width(Timer *timer, Timer_width width);

void timer_set_mode(Timer *timer, Timer_select select, Timer_mode mode);

void timer_set_load(Timer *timer, Timer_select select, uint32_t load);

void timer_enable(Timer *timer, Timer_select select);

void timer_disable(Timer *timer, Timer_select select);

void timer_interrupt(Timer *timer, Timer_interrupt timer_interrupt);

#endif /* TIMER_H_ */
