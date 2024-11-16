#include "init.h"
#include "sm.h"

int main(void)
{
    init();
    while (1)
    {
        sm_execute();
    }
}
