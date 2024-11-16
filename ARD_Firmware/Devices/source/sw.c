#include "stdbool.h"
#include "mempool.h"
#include "sw.h"
#include "gpio.h"

struct Sw
{
    Gpio *gpio;
    Gpio_bit bit;
};

Sw *sw_create(Sw_num num)
{
    Sw *sw = mempool_allocate(sizeof(Sw));
    switch (num)
    {
    case SW1: sw->gpio = gpio_address(GPIO_PORTF);
              sw->bit  = GPIO_BIT4;
              break;
    case SW2: sw->gpio = gpio_address(GPIO_PORTF);
              sw->bit  = GPIO_BIT5;
              break;
    case SW3: sw->gpio = gpio_address(GPIO_PORTF);
              sw->bit  = GPIO_BIT6;
              break;
    case SW4: sw->gpio = gpio_address(GPIO_PORTD);
              sw->bit  = GPIO_BIT4;
              break;
    }
    return sw;
}

bool sw_read(Sw *sw)
{
    uint32_t value = gpio_read(sw->gpio);
    if (value & (1U << sw->bit))
    {
        return false;
    }
    return true;
}



