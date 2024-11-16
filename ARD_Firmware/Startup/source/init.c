#include "adc.h"
#include "gpio.h"
#include "nvic.h"
#include "ssi.h"
#include "sysctl.h"
#include "timer.h"

static void sysctl(void)
{
    sysctl_enable_run_mode();
    sysctl_enable_ahb(SYSCTL_PORTB);
    sysctl_enable_ahb(SYSCTL_PORTD);
    sysctl_enable_ahb(SYSCTL_PORTF);
    sysctl_enable_ahb(SYSCTL_PORTG);
    sysctl_set_clock_adc  (SYSCTL_MOD0,  SYSCTL_RUN_MODE);
    sysctl_set_clock_gpio (SYSCTL_PORTB, SYSCTL_RUN_MODE);
    sysctl_set_clock_gpio (SYSCTL_PORTD, SYSCTL_RUN_MODE);
    sysctl_set_clock_gpio (SYSCTL_PORTF, SYSCTL_RUN_MODE);
    sysctl_set_clock_gpio (SYSCTL_PORTG, SYSCTL_RUN_MODE);
    sysctl_set_clock_ssi  (SYSCTL_MOD1,  SYSCTL_RUN_MODE);
    sysctl_set_clock_timer(SYSCTL_MOD0,  SYSCTL_RUN_MODE);
    sysctl_set_clock_timer(SYSCTL_MOD1,  SYSCTL_RUN_MODE);
}

static void portb(void)
{
    Gpio *portb = gpio_address(GPIO_PORTB);
    /*
            ADC0 INPUT (PB5)
    */
    gpio_set_operation(portb, GPIO_BIT5, GPIO_ALTERNATE);
    gpio_enable_analog(portb, GPIO_BIT5);
}

static void portd(void)
{
    Gpio *portd = gpio_address(GPIO_PORTD);
    /*
        SSI1: SDCARD CS (PD1)
    */
    gpio_enable_digital(portd, GPIO_BIT1);
    gpio_set_direction (portd, GPIO_BIT1, GPIO_OUTPUT);
    gpio_write_high    (portd, GPIO_BIT1);
    /*
        SSI1: SDCARD (PD0 PD2 PD3)
    */
    gpio_set_operation (portd, GPIO_BIT0, GPIO_ALTERNATE);
    gpio_set_operation (portd, GPIO_BIT2, GPIO_ALTERNATE);
    gpio_set_operation (portd, GPIO_BIT3, GPIO_ALTERNATE);
    gpio_enable_digital(portd, GPIO_BIT0);
    gpio_enable_digital(portd, GPIO_BIT2);
    gpio_enable_digital(portd, GPIO_BIT3);
    gpio_set_resistor  (portd, GPIO_BIT2, GPIO_PULL_UP);
    gpio_set_function  (portd, GPIO_BIT0, GPIO_PD0_SSI1CLK);
    gpio_set_function  (portd, GPIO_BIT2, GPIO_PD2_SSI1RX);
    gpio_set_function  (portd, GPIO_BIT3, GPIO_PD3_SSI1TX);
    /*
        CARD DETECT (PD4)
    */
    gpio_enable_digital(portd, GPIO_BIT4);
    gpio_set_direction (portd, GPIO_BIT4, GPIO_INPUT);
    gpio_set_resistor  (portd, GPIO_BIT4, GPIO_OPEN_DRAIN);
    /*
        LED: BLUE/GREEN/RED (PD5 PD6 PD7)
    */
    //gpio_unlock(portd, GPIO_BIT7);
    //gpio_enable_digital(portd, GPIO_BIT5);
    //gpio_enable_digital(portd, GPIO_BIT6);
    //gpio_enable_digital(portd, GPIO_BIT7);
    //gpio_set_direction (portd, GPIO_BIT5, GPIO_OUTPUT);
    //gpio_set_direction (portd, GPIO_BIT6, GPIO_OUTPUT);
    //gpio_set_direction (portd, GPIO_BIT7, GPIO_OUTPUT);
    //gpio_write_low     (portd, GPIO_BIT5);
    //gpio_write_low     (portd, GPIO_BIT6);
    //gpio_write_low     (portd, GPIO_BIT7);
}

static void portf(void)
{
    Gpio *portf = gpio_address(GPIO_PORTF);
    /*
            BTN: 1/2/3 (PF4 PF5 PF6)
    */
    gpio_enable_digital(portf, GPIO_BIT4);
    gpio_enable_digital(portf, GPIO_BIT5);
    gpio_enable_digital(portf, GPIO_BIT6);
    gpio_set_direction (portf, GPIO_BIT4, GPIO_INPUT);
    gpio_set_direction (portf, GPIO_BIT5, GPIO_INPUT);
    gpio_set_direction (portf, GPIO_BIT6, GPIO_INPUT);
    gpio_set_resistor  (portf, GPIO_BIT4, GPIO_OPEN_DRAIN);
    gpio_set_resistor  (portf, GPIO_BIT5, GPIO_OPEN_DRAIN);
    gpio_set_resistor  (portf, GPIO_BIT6, GPIO_OPEN_DRAIN);
}

static void portg(void)
{
    Gpio *portg = gpio_address(GPIO_PORTG);
    /*
        TEST PIN 1/2 (PG0 PG1)
    */
    gpio_enable_digital(portg, GPIO_BIT0);
    gpio_enable_digital(portg, GPIO_BIT1);
    gpio_set_direction (portg, GPIO_BIT0, GPIO_OUTPUT);
    gpio_set_direction (portg, GPIO_BIT1, GPIO_OUTPUT);
    gpio_write_low     (portg, GPIO_BIT0);
    gpio_write_low     (portg, GPIO_BIT1);
}

static void adc0(void)
{
    Adc  *adc0  = adc_address(ADC_MOD0);
    adc_disable_sampler(adc0, ADC_SAMPLER0);
    /*
        INPUT
    */
    adc_set_order     (adc0, ADC_SAMPLER0, 1, ADC_AIN11);
    adc_set_end       (adc0, ADC_SAMPLER0, 1);
    adc_set_trigger   (adc0, ADC_SAMPLER0, 1);
    adc_set_averaging (adc0, ADC_0X);
    adc_enable_interrupt(adc0, ADC_SAMPLER0);
    nvic_enable_interrupt(NVIC_VECTOR_ADC0_SEQUENCE0);
    adc_enable_sampler(adc0, ADC_SAMPLER0);
}

static void ssi1(void)
{
    Ssi  *ssi1  = ssi_address(SSI_MOD1);
    /*
        SSI1: SDCARD
    */
    ssi_disable_module(ssi1);
    ssi_set_phase     (ssi1, SSI_FIRST_EDGE);
    ssi_set_polarity  (ssi1, SSI_STEADY_STATE_LOW);
    ssi_set_format    (ssi1, SSI_FREESCALE);
    ssi_set_rate      (ssi1, SSI_4_MHZ);
    ssi_set_size      (ssi1, SSI_SIZE_8);
    ssi_set_mode      (ssi1, SSI_MASTER);
    ssi_enable_module (ssi1);
}

static void timer0(void)
{
    Timer *timer0 = timer_address(TIMER_MOD0);
    timer_disable  (timer0, TIMER_A);
    timer_set_width(timer0, TIMER_32_BIT);
    timer_set_mode (timer0, TIMER_A, TIMER_PERIODIC);
    /*
        CPU_FREQ/TIMER_FREQ - 1
    */
    timer_set_load (timer0, TIMER_A, 0x007CF);
    timer_interrupt(timer0, TIMER_A_TIMEOUT);
    nvic_enable_interrupt(NVIC_VECTOR_16_32_TIMER_0A);
}

static void timer1(void)
{
    Timer *timer1 = timer_address(TIMER_MOD1);
    timer_disable  (timer1, TIMER_A);
    timer_set_width(timer1, TIMER_32_BIT);
    timer_set_mode (timer1, TIMER_A, TIMER_PERIODIC);
    timer_set_load (timer1, TIMER_A, 0xC34FF);
    timer_interrupt(timer1, TIMER_A_TIMEOUT);
    nvic_enable_interrupt(NVIC_VECTOR_16_32_TIMER_1A);
    timer_enable(timer1, TIMER_A);
}

void init(void)
{
    sysctl();
    portb();
    portd();
    portf();
    portg();
    adc0();
    ssi1();
    timer0();
    timer1();
}
