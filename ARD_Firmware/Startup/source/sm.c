#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include "wave.h"
#include "diskio.h"
#include "ff.h"
#include "sw.h"
#include "adc.h"
#include "gpio.h"
#include "timer.h"
#include "sm.h"

static void initial(void);
static void wait(void);
static void open(void);
static void record(void);
static void finish(void);
static void error(void);

static void (*state)(void) = initial;

void sm_execute(void)
{
    (*state)();
}

static Gpio *portg;
static Adc *adc0;
static Sw *start;
static Sw *stop;
static Sw *unmount;
static Sw *detect;
static Timer *timer0;
static Wave_info info;
static FATFS fatfs;
static FIL file;

#define BUFFER_MAX 4096
#define DC_BIAS 0x04DB

static struct Buffer
{
    volatile int8_t buff1[BUFFER_MAX];
    volatile int8_t buff2[BUFFER_MAX];
    volatile int8_t *ptr1;
    volatile int8_t *ptr2;
    volatile bool swapped;
    volatile bool data_ready;
    volatile uint16_t index;

}   buffer;

void swap(void)
{
    if (!buffer.swapped)
    {
        buffer.ptr1 = buffer.buff2;
        buffer.ptr2 = buffer.buff1;
        buffer.swapped = true;
    }
    else
    {
        buffer.ptr1 = buffer.buff1;
        buffer.ptr2 = buffer.buff2;
        buffer.swapped = false;
    }
}

static void initial(void)
{
    buffer.ptr1 = buffer.buff1;
    buffer.ptr2 = buffer.buff2;
    buffer.swapped = false;
    buffer.data_ready = false;
    buffer.index = 0;

    start = sw_create(SW1);
    stop = sw_create(SW2);
    unmount = sw_create(SW3);
    detect = sw_create(SW4);
    timer0 = timer_address(TIMER_MOD0);
    portg = gpio_address(GPIO_PORTG);
    adc0 = adc_address(ADC_MOD0);

    info.chunk_size = 0;
    info.num_channels = 1;
    info.sample_rate = 40000;
    info.bits_per_sample = 16;

    FRESULT status = f_mount(0, &fatfs);
    if(status != FR_OK)
    {
        state = error;
    }
    state = wait;
}

static void wait(void)
{
    if (!sw_read(detect))
    {
        state = error;
    }
    if (sw_read(start))
    {
        state = open;
    }
}

static void open(void)
{
    FRESULT status = f_open(&file, "TEST.WAV", FA_CREATE_ALWAYS|FA_WRITE);
    if (status != FR_OK)
    {
        state = error;
    }
    else
    {
        wave_write_header(&file, &info);
        f_sync(&file);
        timer_enable(timer0, TIMER_A);
        state = record;
    }
}

static void record(void)
{
    if (!sw_read(detect))
    {
        state = error;
    }
    if (sw_read(stop))
    {
        timer_disable(timer0, TIMER_A);
        state = finish;
    }
    if (buffer.data_ready)
    {
        buffer.data_ready = false;
        UINT bytes_written;
        f_write(&file, (const void *)buffer.ptr2, BUFFER_MAX, &bytes_written);
        info.chunk_size += bytes_written;
    }
}

static void finish(void)
{
    wave_update_header(&file, &info);
    FRESULT result = f_close(&file);
    if (result != FR_OK)
    {
        state = error;
    }
    result = f_mount(0, NULL);
    if (result != FR_OK)
    {
        state = error;
    }
    while (1)
    {

    }
}

static void error(void)
{
    while (1)
    {

    }
}

void isr_timer0A(void)
{
    gpio_write_toggle(portg, GPIO_BIT1);
    adc_sample(adc0, ADC_SAMPLER0);
    *(volatile unsigned int *)(0x40030024) |= 0x01F;
}

void isr_timer1A(void)
{
    disk_timerproc();
    *(volatile unsigned int *)(0x40031024) |= 0x01F;
}

void isr_adc0_sequence0(void)
{
    int16_t result = (int16_t)adc_result(adc0, ADC_SAMPLER0);
    result -= DC_BIAS;
    *buffer.ptr1++ = result;
    *buffer.ptr1++ = result >> 8;
    buffer.index += 2;
    if (buffer.index >= BUFFER_MAX)
    {
        swap();
        buffer.index = 0;
        buffer.data_ready = true;
    }
    *(volatile unsigned int *)(0x4003800C) |= (1U << 0);
}
