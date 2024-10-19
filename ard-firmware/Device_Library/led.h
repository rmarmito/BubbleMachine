#ifndef LED_H_
#define LED_H_

typedef struct Led Led;

typedef enum
{
    LED_RED,
    LED_BLUE,
    LED_GREEN

}   Led_color;

Led *led_create(Led_color color);

void led_on(Led *led);

void led_off(Led *led);

void led_toggle(Led *led);

#endif /* LED_H_ */
