#include "mempool.h"
#include "led.h"
#include "gpio.h"

struct Led
{
    Gpio *gpio;
    Gpio_bit bit;
};

Led *led_create(Led_color color)
{
    Led *led = mempool_allocate(sizeof(Led));
    switch (color)
    {
    case LED_RED:   led->gpio = gpio_address(GPIO_PORTD);
                    led->bit  = GPIO_BIT7;
                    break;
    case LED_BLUE:  led->gpio = gpio_address(GPIO_PORTD);
                    led->bit  = GPIO_BIT5;
                    break;
    case LED_GREEN: led->gpio = gpio_address(GPIO_PORTD);
                    led->bit  = GPIO_BIT6;
                    break;
    }
    return led;
}

void led_on(Led *led)
{
    gpio_write_high(led->gpio, led->bit);
}

void led_off(Led *led)
{
    gpio_write_low(led->gpio, led->bit);
}

void led_toggle(Led *led)
{
    gpio_write_toggle(led->gpio, led->bit);
}

