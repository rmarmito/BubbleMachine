#include <stdint.h>
#include "Hardware_Library/gpio.h"

struct Gpio
{
    volatile uint32_t RESERVED_0[255];
    volatile uint32_t GPIODATA;
    volatile uint32_t GPIODIR;
    volatile uint32_t GPIOIS;
    volatile uint32_t GPIOIBE;
    volatile uint32_t GPIOIEV;
    volatile uint32_t GPIOIM;
    volatile uint32_t GPIORIS;
    volatile uint32_t GPIOMIS;
    volatile uint32_t GPIOICR;
    volatile uint32_t GPIOAFSEL;
    volatile uint32_t RESERVED_1[55];
    volatile uint32_t GPIODR2R;
    volatile uint32_t GPIODR4R;
    volatile uint32_t GPIODR8R;
    volatile uint32_t GPIOODR;
    volatile uint32_t GPIOPUR;
    volatile uint32_t GPIOPDR;
    volatile uint32_t GPIOSLR;
    volatile uint32_t GPIODEN;
    volatile uint32_t GPIOLOCK;
    volatile uint32_t GPIOCR;
    volatile uint32_t GPIOAMSEL;
    volatile uint32_t GPIOPCTL;
    volatile uint32_t GPIOADCCTL;
    volatile uint32_t GPIODMACTL;
};

Gpio *gpio_address(Gpio_port port)
{
    uint32_t reg[] =
    {
        0x40058000,
        0x40059000,
        0x4005A000,
        0x4005B000,
        0x4005C000,
        0x4005D000,
        0x4005E000,
        0x4005F000,
        0x40060000,
        0x40061000
    };
    return (void *)reg[port];
}

void gpio_unlock(Gpio *gpio, Gpio_bit bit)
{
    gpio->GPIOLOCK = 0x4C4F434B;
    gpio->GPIOCR  |= (1U << bit);
}

void gpio_set_direction(Gpio *gpio, Gpio_bit bit, Gpio_direction direction)
{
    if (direction ==  GPIO_OUTPUT)
    {
        gpio->GPIODIR |= (1U << bit);
    }
    else
    {
        gpio->GPIODIR &= ~(1U << bit);
    }
}

void gpio_set_operation(Gpio *gpio, Gpio_bit bit, Gpio_operation operation)
{
    if (operation == GPIO_ALTERNATE)
    {
        gpio->GPIOAFSEL |= (1U << bit);
    }
    else
    {
        gpio->GPIOAFSEL &= ~(1U << bit);
    }
}

void gpio_set_resistor(Gpio *gpio, Gpio_bit bit, Gpio_resistor resistor)
{
    volatile uint32_t *reg[] =
    {
         &gpio->GPIOPUR,
         &gpio->GPIOPDR,
         &gpio->GPIOODR
    };
    *reg[resistor] |= (1U << bit);
}

void gpio_set_function(Gpio *gpio, Gpio_bit bit, Gpio_function function)
{
    uint8_t mask[] =
    {
      1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,
      1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,
      2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,
      2,  2,  2,  2,  2,  2,  2,  2,  2,  3,  3,  3,  3,  3,  3,  3,  3,  3,
      3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  4,  4,  4,
      4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,
      4,  4,  4,  4,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,
      5,  5,  5,  5,  5,  5,  5,  5,  5,  6,  6,  6,  6,  6,  6,  6,  6,  6,
      6,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6,  6,  7,  7,  7,  7,  7,
      7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,
      7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,
      7,  7,  7,  7,  7,  7,  7,  7,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,
      8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  9,  9,  9, 14, 14, 14, 14, 14
    };
    uint8_t shift[] = {0, 4, 8, 12, 16, 20, 24, 28};
    gpio->GPIOPCTL |= (mask[function] << shift[bit]);
}

void gpio_enable_digital(Gpio *gpio, Gpio_bit bit)
{
    gpio->GPIODEN |= (1U << bit);
}

void gpio_enable_analog(Gpio *gpio, Gpio_bit bit)
{
    gpio->GPIOAMSEL |= (1U << bit);
}

void gpio_write_high(Gpio *gpio, Gpio_bit bit)
{
    gpio->GPIODATA |= (1U << bit);
}

void gpio_write_low(Gpio *gpio, Gpio_bit bit)
{
    gpio->GPIODATA &= ~(1U << bit);
}

void gpio_write_toggle(Gpio *gpio, Gpio_bit bit)
{
    gpio->GPIODATA ^= (1U << bit);
}

uint32_t gpio_read(Gpio *gpio)
{
    return gpio->GPIODATA;
}
