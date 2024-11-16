#ifndef SW_H_
#define SW_H_

#include "stdbool.h"

typedef struct Sw Sw;

typedef enum
{
    SW1,
    SW2,
    SW3,
    SW4

}   Sw_num;

Sw *sw_create(Sw_num num);

bool sw_read(Sw *sw);

#endif /* SW_H_ */
