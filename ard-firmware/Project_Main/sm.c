#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include "SD_Library/wave.h"
#include "SD_Library/fatfs/diskio.h"
#include "SD_Library/fatfs/ff.h"
#include "Device_Library/sw.h"
#include "Hardware_Library/adc.h"
#include "Hardware_Library/gpio.h"
#include "Hardware_Library/timer.h"
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
static uint8_t buffer[512];
static uint16_t index;
static FATFS fatfs;
static FIL file;

static void initial(void)
{
    start = sw_create(SW1);
    stop = sw_create(SW2);
    unmount = sw_create(SW3);
    detect = sw_create(SW4);
    timer0 = timer_address(TIMER_MOD0);
    portg = gpio_address(GPIO_PORTG);
    adc0 = adc_address(ADC_MOD0);
    info.file_size = 0xAABBCCDD,
    info.wave_chunk = 0xAABBCCDD;
    info.wave_type = 0xFFAA;
    info.num_channels = 0xFFAA;
    info.sample_rate = 0xAABBCCDD;
    info.block_align = 0xFFAA;
    info.bits_per_sample = 0xFFAA;
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
        //wave_write_header(info);
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
}

static void finish(void)
{
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
    gpio_write_toggle(portg, GPIO_BIT0);
    adc_sample(adc0, ADC_SAMPLER0);
    *(volatile unsigned int *)(0x40030024) |= 0x01F;
}

void isr_timer1A(void)
{
    disk_timerproc();
    *(volatile unsigned int *)(0x40031024) |= 0x01F;
}

extern void isr_adc0_sequence0(void)
{
    gpio_write_toggle(portg, GPIO_BIT1);
    uint16_t result = adc_result(adc0, ADC_SAMPLER0);
    buffer[index]     = result;
    buffer[index + 1] = result >> 8;
    index += 2;
    if (index >= sizeof(buffer)/sizeof(*buffer))
    {
        index = 0;
    }
    *(volatile unsigned int *)(0x4003800C) |= (1U << 0);
}
