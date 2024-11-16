#ifndef SYSCTL_H_
#define SYSCTL_H_

typedef enum
{
    SYSCTL_PORTA,
    SYSCTL_PORTB,
    SYSCTL_PORTC,
    SYSCTL_PORTD,
    SYSCTL_PORTE,
    SYSCTL_PORTF,
    SYSCTL_PORTG,
    SYSCTL_PORTH,
    SYSCTL_PORTJ,
    SYSCTL_PORTK

}   Sysctl_port;

typedef enum
{
    SYSCTL_MOD0,
    SYSCTL_MOD1,
    SYSCTL_MOD2,
    SYSCTL_MOD3,
    SYSCTL_MOD4,
    SYSCTL_MOD5,
    SYSCTL_MOD6,
    SYSCTL_MOD7

}   Sysctl_module;

typedef enum
{
    SYSCTL_RUN_MODE,
    SYSCTL_SLEEP_MODE,
    SYSCTL_DEEP_SLEEP_MODE

}   Sysctl_mode;

typedef enum
{
    SYSCTL_DIV_2,
    SYSCTL_DIV_4,
    SYSCTL_DIV_8,
    SYSCTL_DIV_16,
    SYSCTL_DIV_32,
    SYSCTL_DIV_64

}   Sysctl_divisor;

void sysctl_enable_run_mode(void);

void sysctl_enable_ahb(Sysctl_port port);

void sysctl_set_clock_adc(Sysctl_module module, Sysctl_mode mode);

void sysctl_set_clock_dma(Sysctl_mode mode);

void sysctl_set_clock_gpio(Sysctl_port port, Sysctl_mode mode);

void sysctl_set_clock_pwm(Sysctl_module module, Sysctl_mode mode);

void sysctl_set_clock_ssi(Sysctl_module module, Sysctl_mode mode);

void sysctl_set_clock_timer(Sysctl_module module, Sysctl_mode mode);

void sysctl_set_clock_uart(Sysctl_module module, Sysctl_mode mode);

#endif /* SYSCTL_H_ */
