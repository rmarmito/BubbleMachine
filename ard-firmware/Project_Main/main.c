#include "init.h"

int main(void)
{
    init();
    while (1)
    {
        sm_execute();
    }
}
