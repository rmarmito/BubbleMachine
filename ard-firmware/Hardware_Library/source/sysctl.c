#include <stdint.h>
#include "Hardware_Library/sysctl.h"

struct Sysctl
{
    volatile uint32_t DID0;
    volatile uint32_t DID1;
    volatile uint32_t RESERVED_0[10];
    volatile uint32_t PBORCTL;
    volatile uint32_t RESERVED_1[7];
    volatile uint32_t RIS;
    volatile uint32_t IMC;
    volatile uint32_t MISC;
    volatile uint32_t RESC;
    volatile uint32_t RCC;
    volatile uint32_t RESERVED_2[2];
    volatile uint32_t GPIOHBCTL;
    volatile uint32_t RCC2;
    volatile uint32_t RESERVED_3[2];
    volatile uint32_t MOSCCTL;
    volatile uint32_t RESERVED_4[49];
    volatile uint32_t DSLPCLKCFG;
    volatile uint32_t RESERVED_5[1];
    volatile uint32_t SYSPROP;
    volatile uint32_t PIOSCCAL;
    volatile uint32_t PIOSCSTAT;
    volatile uint32_t RESERVED_6[2];
    volatile uint32_t PLLFREQ0;
    volatile uint32_t PLLFREQ1;
    volatile uint32_t PLLSTAT;
    volatile uint32_t RESERVED_7[7];
    volatile uint32_t SLPPWRCFG;
    volatile uint32_t DSLPPWRCFG;
    volatile uint32_t RESERVED_8[9];
    volatile uint32_t LDOSPCTL;
    volatile uint32_t LDOSPCAL;
    volatile uint32_t LDODPCTL;
    volatile uint32_t LDODPCAL;
    volatile uint32_t RESERVED_9[2];
    volatile uint32_t SDPMST;
    volatile uint32_t RESERVED_10[76];
    volatile uint32_t PPWD;
    volatile uint32_t PPTIMER;
    volatile uint32_t PPGPIO;
    volatile uint32_t PPDMA;
    volatile uint32_t RESERVED_11[1];
    volatile uint32_t PPHIB;
    volatile uint32_t PPUART;
    volatile uint32_t PPSSI;
    volatile uint32_t PPI2C;
    volatile uint32_t RESERVED_12[1];
    volatile uint32_t PPUSB;
    volatile uint32_t RESERVED_13[2];
    volatile uint32_t PPCAN;
    volatile uint32_t PPADC;
    volatile uint32_t PPACMP;
    volatile uint32_t PPPWM;
    volatile uint32_t PPQEI;
    volatile uint32_t RESERVED_14[4];
    volatile uint32_t PPEEPROM;
    volatile uint32_t PPWTIMER;
    volatile uint32_t RESERVED_15[104];
    volatile uint32_t SRWD;
    volatile uint32_t SRTIMER;
    volatile uint32_t SRGPIO;
    volatile uint32_t SRDMA;
    volatile uint32_t RESERVED_16[1];
    volatile uint32_t SRHIB;
    volatile uint32_t SRUART;
    volatile uint32_t SRSSI;
    volatile uint32_t SRI2C;
    volatile uint32_t RESERVED_17[1];
    volatile uint32_t SRUSB;
    volatile uint32_t RESERVED_18[2];
    volatile uint32_t SRCAN;
    volatile uint32_t SRADC;
    volatile uint32_t SRACMP;
    volatile uint32_t SRPWM;
    volatile uint32_t SRQEI;
    volatile uint32_t RESERVED_19[4];
    volatile uint32_t SREEPROM;
    volatile uint32_t SRWTIMER;
    volatile uint32_t RESERVED_20[40];
    volatile uint32_t RCGCWD;
    volatile uint32_t RCGCTIMER;
    volatile uint32_t RCGCGPIO;
    volatile uint32_t RCGCDMA;
    volatile uint32_t RESERVED_21[1];
    volatile uint32_t RCGCHIB;
    volatile uint32_t RCGCUART;
    volatile uint32_t RCGCSSI;
    volatile uint32_t RCGCI2C;
    volatile uint32_t RESERVED_22[1];
    volatile uint32_t RCGCUSB;
    volatile uint32_t RESERVED_23[2];
    volatile uint32_t RCGCCAN;
    volatile uint32_t RCGCADC;
    volatile uint32_t RCGCACMP;
    volatile uint32_t RCGCPWM;
    volatile uint32_t RCGCQEI;
    volatile uint32_t RESERVED_24[4];
    volatile uint32_t RCGCEEPROM;
    volatile uint32_t RCGCWTIMER;
    volatile uint32_t RESERVED_25[40];
    volatile uint32_t SCGCWD;
    volatile uint32_t SCGCTIMER;
    volatile uint32_t SCGCGPIO;
    volatile uint32_t SCGCDMA;
    volatile uint32_t RESERVED_26[1];
    volatile uint32_t SCGCHIB;
    volatile uint32_t SCGCUART;
    volatile uint32_t SCGCSSI;
    volatile uint32_t SCGCI2C;
    volatile uint32_t RESERVED_27[1];
    volatile uint32_t SCGCUSB;
    volatile uint32_t RESERVED_28[2];
    volatile uint32_t SCGCCAN;
    volatile uint32_t SCGCADC;
    volatile uint32_t SCGCACMP;
    volatile uint32_t SCGCPWM;
    volatile uint32_t SCGCQEI;
    volatile uint32_t RESERVED_29[4];
    volatile uint32_t SCGCEEPROM;
    volatile uint32_t SCGCWTIMER;
    volatile uint32_t RESERVED_30[40];
    volatile uint32_t DCGCWD;
    volatile uint32_t DCGCTIMER;
    volatile uint32_t DCGCGPIO;
    volatile uint32_t DCGCDMA;
    volatile uint32_t RESERVED_31[1];
    volatile uint32_t DCGCHIB;
    volatile uint32_t DCGCUART;
    volatile uint32_t DCGCSSI;
    volatile uint32_t DCGCI2C;
    volatile uint32_t RESERVED_32[1];
    volatile uint32_t DCGCUSB;
    volatile uint32_t RESERVED_33[2];
    volatile uint32_t DCGCCAN;
    volatile uint32_t DCGCADC;
    volatile uint32_t DCGCACMP;
    volatile uint32_t DCGCPWM;
    volatile uint32_t DCGCQEI;
    volatile uint32_t RESERVED_34[4];
    volatile uint32_t DCGCEEPROM;
    volatile uint32_t DCGCWTIMER;
    volatile uint32_t RESERVED_35[104];
    volatile uint32_t PRWD;
    volatile uint32_t PRTIMER;
    volatile uint32_t PRGPIO;
    volatile uint32_t PRDMA;
    volatile uint32_t RESERVED_36[1];
    volatile uint32_t PRHIB;
    volatile uint32_t PRUART;
    volatile uint32_t PRSSI;
    volatile uint32_t PRI2C;
    volatile uint32_t RESERVED_37[1];
    volatile uint32_t PRUSB;
    volatile uint32_t RESERVED_38[2];
    volatile uint32_t PRCAN;
    volatile uint32_t PRADC;
    volatile uint32_t PRACMP;
    volatile uint32_t PRPWM;
    volatile uint32_t PRQEI;
    volatile uint32_t RESERVED_39[4];
    volatile uint32_t PREEPROM;
    volatile uint32_t PRWTIMER;
};

static struct Sysctl *sysctl = (void *)0x400FE000UL;

void sysctl_enable_run_mode(void)
{
    sysctl->RCC2 |=  (1U << 31);   // Enable RCC2
    sysctl->RCC2 |=  (1U << 11);   // set BYPASS
    sysctl->RCC  &= ~(1U << 22);   // clear USESYSDIV
    sysctl->RCC  &= ~(0x1FU << 6); // clear XTAL
    sysctl->RCC  |=  (0x15U << 6); // set XTAL 16 MHz
    sysctl->RCC2 &= ~(0x7U << 4);  // clear OSCSRC2
    sysctl->RCC2 |=  (0x0U << 4);  // set OSCSRC2 to MOSC
    sysctl->RCC2 &= ~(1U << 13);   // clear PWRDN2


    sysctl->RCC2 |=  (1U << 30);    // set DIV400
    sysctl->RCC2 &= ~(0x3FU << 23); // clear SYSDIV2
    sysctl->RCC2 |=  (0x02U << 23); // set SYSDIV2
    sysctl->RCC2 &= ~(1U << 22);    // clear SYSDIV2LSB
    sysctl->RCC  |=  (1U << 22);    // set USESYSDIV
    while (!(sysctl->RIS & (1U << 6)))
    {
        // Wait for PLL to lock
    }
    sysctl->RCC2 &= ~(1U << 11);   // clear BYPASS2
}

void sysctl_enable_ahb(Sysctl_port port)
{
    sysctl->GPIOHBCTL |= (1U << port);
}

void sysctl_set_clock_adc(Sysctl_module module, Sysctl_mode mode)
{
    volatile uint32_t *reg[] =
    {
        &sysctl->RCGCADC,
        &sysctl->SCGCADC,
        &sysctl->DCGCADC
    };
    *reg[mode] |= (1U << module);
}

void sysctl_set_clock_dma(Sysctl_mode mode)
{
    volatile uint32_t *reg[] =
    {
        &sysctl->RCGCDMA,
        &sysctl->SCGCDMA,
        &sysctl->DCGCDMA
    };
    *reg[mode] |= (1U << 0);
}

void sysctl_set_clock_gpio(Sysctl_port port, Sysctl_mode mode)
{
    volatile uint32_t *reg[] =
    {
        &sysctl->RCGCGPIO,
        &sysctl->SCGCGPIO,
        &sysctl->DCGCGPIO
    };
    *reg[mode] |= (1U << port);
}

void sysctl_set_clock_pwm(Sysctl_module module, Sysctl_mode mode)
{
    volatile uint32_t *reg[] =
    {
        &sysctl->RCGCPWM,
        &sysctl->SCGCPWM,
        &sysctl->DCGCPWM
    };
    *reg[mode] |= (1U << module);
}

void sysctl_set_clock_ssi(Sysctl_module module, Sysctl_mode mode)
{
    volatile uint32_t *reg[] =
    {
        &sysctl->RCGCSSI,
        &sysctl->SCGCSSI,
        &sysctl->DCGCSSI
    };
    *reg[mode] |= (1U << module);
}

void sysctl_set_clock_timer(Sysctl_module module, Sysctl_mode mode)
{
    volatile uint32_t *reg[] =
    {
        &sysctl->RCGCTIMER,
        &sysctl->SCGCTIMER,
        &sysctl->DCGCTIMER
    };
    *reg[mode] |= (1U << module);
}

void sysctl_set_timer(Sysctl_module module, Sysctl_mode mode)
{
    volatile uint32_t *reg[] =
    {
        &sysctl->RCGCTIMER,
        &sysctl->SCGCTIMER,
        &sysctl->DCGCTIMER
    };
    *reg[mode] |= (1 << module);
}

void sysctl_set_clock_uart(Sysctl_module module, Sysctl_mode mode)
{
    volatile uint32_t *reg[] =
    {
        &sysctl->RCGCUART,
        &sysctl->SCGCUART,
        &sysctl->DCGCUART
    };
    *reg[mode] |= (1U << module);
}
