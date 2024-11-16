#include <stdint.h>
#include "diskio.h"
#include "ssi.h"
#include "gpio.h"

enum Mmc_command
{
    CMD0  = 0x40+0,  // GO_IDLE_STATE
    CMD1  = 0x40+1,  // SEND_OP_COND
    CMD8  = 0x40+8,  // SEND_IF_COND
    CMD9  = 0x40+9,  // SEND_CSD
    CMD10 = 0x40+10, // SEND_CID
    CMD12 = 0x40+12, // STOP_TRANSMISSION
    CMD16 = 0x40+16, // SET_BLOCKLEN
    CMD17 = 0x40+17, // READ_SINGLE_BLOCK
    CMD18 = 0x40+18, // READ_MULTIPLE_BLOCK
    CMD23 = 0x40+23, // SET_BLOCK_COUNT
    CMD24 = 0x40+24, // WRITE_BLOCK
    CMD25 = 0x40+25, // WRITE_MULTIPLE_BLOCK
    CMD41 = 0x40+41, // SEND_OP_COND (ACMD)
    CMD55 = 0x40+55, // APP_CMD
    CMD58 = 0x40+58, // READ_OCR
};

struct Disk
{
    volatile DSTATUS status; // Disk status
    volatile BYTE timer1;    // 100Hz decrement timer
    volatile BYTE timer2;    // 100Hz decrement timer
    BYTE card_type;          // b0:MMC, b1:SDC, b2:Block addressing
    BYTE power_flag;         // indicates if "power" is on
};

static struct Disk disk =
{
    .status = STA_NOINIT,
    .timer1 = 0,
    .timer2 = 0,
    .card_type = 0,
    .power_flag = 0,
};

static Gpio *portd;
static Ssi  *ssi1;

static void init(void)
{
    portd = gpio_address(GPIO_PORTD);
    ssi1  = ssi_address(SSI_MOD1);
}

/*
    If change in port or ssi update the following functions:

    SELECT
    DESELECT
    xmit_spi
    rcvr_spi
    send_initial_clock_train
*/

static void SELECT(void)
{
    gpio_write_low(portd, GPIO_BIT1);
}

static void DESELECT(void)
{
    gpio_write_high(portd, GPIO_BIT1);
}

static void xmit_spi(BYTE dat)
{
    uint32_t dummy = ssi_write(ssi1, dat);
}

static BYTE rcvr_spi(void)
{
    return (BYTE)ssi_write(ssi1, 0xFF);
}

static void rcvr_spi_m(BYTE *dst)
{
    *dst = rcvr_spi();
}

static BYTE wait_ready(void)
{
    BYTE res;
    /*
        Wait for ready in timeout of 500ms
    */
    disk.timer2 = 50;
    rcvr_spi();
    do
    {
        res = rcvr_spi();
    }
    while ((res != 0xFF) && disk.timer2);
    return res;
}

static void send_initial_clock_train(void)
{
    DESELECT();
    /*
        Switch the SSI TX line to a GPIO and drive it high too.
    */
    gpio_enable_digital(portd, GPIO_BIT3);
    gpio_set_direction (portd, GPIO_BIT3, GPIO_OUTPUT);
    gpio_write_high    (portd, GPIO_BIT3);
    /*
        Send 10 bytes over the SSI. This causes the
        clock to wiggle the required number of times.
    */
    for(uint32_t i = 0 ; i < 10 ; i++)
    {
        uint32_t dummy = ssi_write(ssi1, 0xFF);
    }
    /*
        Revert to hardware control of the SSI TX line.
    */
    gpio_set_operation (portd, GPIO_BIT3, GPIO_ALTERNATE);
    gpio_enable_digital(portd, GPIO_BIT3);
    gpio_set_function  (portd, GPIO_BIT3, GPIO_PD3_SSI1TX);
}

static void power_on (void)
{
    /*
        Set DI and CS high and apply more than
        74 pulses to SCLK for the card to be able to
        accept a native command.
    */
    init();
    send_initial_clock_train();
    disk.power_flag = 1;
}

static void set_max_speed(void)
{

}

static void power_off (void)
{
    disk.power_flag = 0;
}

static int chk_power(void)
{
    /*
        Socket power state: 0=off, 1=on
    */
    return disk.power_flag;
}

static BOOL rcvr_datablock(BYTE *buff, UINT btr)
{
    /*
        BYTE *buff : Data buffer to store received data
        UINT btr   : Byte count (must be even number)
    */
    BYTE token;
    disk.timer1 = 100;
    do // Wait for data packet in timeout of 100ms
    {
        token = rcvr_spi();
    }
    while ((token == 0xFF) && disk.timer1);
    if(token != 0xFE)
    {
        return FALSE; // If not valid data token, retutn with error
    }
    do // Receive the data block into buffer
    {
        rcvr_spi_m(buff++);
        rcvr_spi_m(buff++);
    }
    while (btr -= 2);
    rcvr_spi(); // Discard CRC
    rcvr_spi();
    return TRUE; // Return with success
}

#if _READONLY == 0
static BOOL xmit_datablock(const BYTE *buff, BYTE token)
{
    /*
        const BYTE *buff : 512 byte data block to be transmitted
        BYTE token       : Data/Stop token
    */
    BYTE resp;
    BYTE wc;
    if (wait_ready() != 0xFF)
    {
        return FALSE;
    }
    xmit_spi(token); // Xmit data token
    if (token != 0xFD) // Is data token
    {
        wc = 0;
        do // Xmit the 512 byte data block to MMC
        {
            xmit_spi(*buff++);
            xmit_spi(*buff++);
        }
        while (--wc);
        xmit_spi(0xFF); // CRC (Dummy)
        xmit_spi(0xFF);
        resp = rcvr_spi(); // Receive data response
        if ((resp & 0x1F) != 0x05) // If not accepted, return with error
        {
            return FALSE;
        }
    }
    return TRUE;
}
#endif /* _READONLY */

static BYTE send_cmd(BYTE cmd, DWORD arg)
{
    /*
        BYTE cmd  : Command byte
        DWORD arg : Argument
    */
    BYTE n;
    BYTE res;
    if (wait_ready() != 0xFF)
    {
        return 0xFF;
    }
    // Send command packet
    xmit_spi(cmd);                      // Command
    xmit_spi((BYTE)(arg >> 24));        // Argument[31..24]
    xmit_spi((BYTE)(arg >> 16));        // Argument[23..16]
    xmit_spi((BYTE)(arg >> 8));         // Argument[15..8]
    xmit_spi((BYTE)arg);                // Argument[7..0]
    n = 0xff;
    if (cmd == CMD0)
    {
        n = 0x95; // CRC for CMD0(0)
    }
    if (cmd == CMD8)
    {
        n = 0x87; // CRC for CMD8(0x1AA)
    }
    xmit_spi(n);
    // Receive command response
    if (cmd == CMD12)
    {
        rcvr_spi(); // Skip a stuff byte when stop reading
    }
    n = 10; // Wait for a valid response in timeout of 10 attempts
    do
    {
        res = rcvr_spi();
    }
    while ((res & 0x80) && --n);
    return res; // Return with the response value
}

static BYTE send_cmd12(void)
{
    /*
        Send the special command used to terminate a multi-sector read.
        This is the only command which can be sent while the SDCard is sending
        data. The SDCard spec indicates that the data transfer will stop 2 bytes
        after the 6 byte CMD12 command is sent and that the card will then send
        0xFF for between 2 and 6 more bytes before the R1 response byte.  This
        response will be followed by another 0xFF byte.  In testing, however, it
        seems that some cards don't send the 2 to 6 0xFF bytes between the end of
        data transmission and the response code.  This function, therefore, merely
        reads 10 bytes and, if the last one read is 0xFF, returns the value of the
        latest non-0xFF byte as the response code.
    */
    BYTE n;
    BYTE res;
    BYTE val;
    /*
        For CMD12, we don't wait for the card to be idle before we send
        the new command.
    */
    xmit_spi(CMD12);
    xmit_spi(0);
    xmit_spi(0);
    xmit_spi(0);
    xmit_spi(0);
    xmit_spi(0);
    /*
        Read up to 10 bytes from the card remembering
        the value read if it's not 0xFF
    */
    for(n = 0; n < 10; n++)
    {
        val = rcvr_spi();
        if(val != 0xFF)
        {
            res = val;
        }
    }
    return res; // Return with the response value
}

DSTATUS disk_initialize(BYTE drv)
{
    BYTE n;
    BYTE ty;
    BYTE ocr[4];
    if (drv) // Supports only single drive
    {
        return STA_NOINIT;
    }
    if (disk.status & STA_NODISK) // No card in the socket
    {
        return disk.status;
    }
    power_on(); // Force socket power on
    send_initial_clock_train(); // Ensure the card is in SPI mode
    SELECT();
    ty = 0;
    if (send_cmd(CMD0, 0) == 1) // Enter Idle state
    {
        disk.timer1 = 100; // Initialization timeout of 1000 msec
        if (send_cmd(CMD8, 0x1AA) == 1) // SDC Ver2+
        {
            for (n = 0; n < 4; n++)
            {
                ocr[n] = rcvr_spi();
            }
            if (ocr[2] == 0x01 && ocr[3] == 0xAA) // The card can work at vdd range of 2.7-3.6V
            {
                do
                {
                    if (send_cmd(CMD55, 0) <= 1 && send_cmd(CMD41, 1UL << 30) == 0)
                    {
                        break; // ACMD41 with HCS bit
                    }
                }
                while (disk.timer1);
                if (disk.timer1 && send_cmd(CMD58, 0) == 0) // Check CCS bit
                {
                    for (n = 0; n < 4; n++)
                    {
                        ocr[n] = rcvr_spi();
                    }
                    ty = (ocr[0] & 0x40) ? 6 : 2;
                }
            }
        }
        else // SDC Ver1 or MMC
        {
            ty = (send_cmd(CMD55, 0) <= 1 && send_cmd(CMD41, 0) <= 1) ? 2 : 1; // SDC: MMC
            do
            {
                if (ty == 2)
                {
                    if (send_cmd(CMD55, 0) <= 1 && send_cmd(CMD41, 0) == 0)
                    {
                        break; // ACMD41
                    }
                }
                else
                {
                    if (send_cmd(CMD1, 0) == 0)
                    {
                        break; // CMD1
                    }
                }
            }
            while (disk.timer1);
            if (!disk.timer1 || send_cmd(CMD16, 512) != 0) // Select R/W block length
            {
                ty = 0;
            }
        }
    }
    disk.card_type = ty;
    DESELECT();
    rcvr_spi(); // Idle (Release DO)
    if (ty) // Initialization success
    {
        disk.status &= ~STA_NOINIT; // Clear STA_NOINIT
        set_max_speed();
    }
    else // Initialization failed
    {
        power_off();
    }
    return disk.status;
}

DSTATUS disk_status(BYTE drv)
{
    /*
        Supports only single drive
    */
    if (drv) return STA_NOINIT;
    return disk.status;
}

DRESULT disk_read(BYTE drv, BYTE *buff, DWORD sector, BYTE count)
{
    /*
        BYTE drv     : Physical drive number (0)
        BYTE *buff   : Pointer to the data buffer to store read data
        DWORD sector : Start sector number (LBA)
        BYTE count   : Sector count (1..255)
    */
    if (drv || !count)
    {
        return RES_PARERR;
    }
    if (disk.status & STA_NOINIT)
    {
        return RES_NOTRDY;
    }
    if (!(disk.card_type & 4))
    {
        sector *= 512; // Convert to byte address if needed
    }
    SELECT();
    if (count == 1) // Single block read
    {
        if ((send_cmd(CMD17, sector) == 0) && rcvr_datablock(buff, 512)) // READ_SINGLE_BLOCK
        {
            count = 0;
        }
    }
    else // Multiple block read
    {
        if (send_cmd(CMD18, sector) == 0) // READ_MULTIPLE_BLOCK
        {
            do
            {
                if (!rcvr_datablock(buff, 512))
                {
                    break;
                }
                buff += 512;
            }
            while (--count);
            send_cmd12(); // STOP_TRANSMISSION
        }
    }
    DESELECT(); // CS = H
    rcvr_spi(); // Idle (Release DO)
    return count ? RES_ERROR : RES_OK;
}

#if _READONLY == 0
DRESULT disk_write(BYTE drv, const BYTE *buff, DWORD sector, BYTE count)
{
    /*
        BYTE drv         : Physical drive nmuber (0)
        const BYTE *buff : Pointer to the data to be written
        DWORD sector     : Start sector number (LBA)
        BYTE count       : Sector count (1..255)
    */
    if (drv || !count)
    {
        return RES_PARERR;
    }
    if (disk.status & STA_NOINIT)
    {
        return RES_NOTRDY;
    }
    if (disk.status & STA_PROTECT)
    {
        return RES_WRPRT;
    }
    if (!(disk.card_type & 4))
    {
        sector *= 512; // Convert to byte address if needed
    }
    SELECT();
    if (count == 1) // Single block write
    {
        if ((send_cmd(CMD24, sector) == 0) && xmit_datablock(buff, 0xFE)) // WRITE_BLOCK
        {
            count = 0;
        }
    }
    else // Multiple block write
    {
        if (disk.card_type & 2)
        {
            send_cmd(CMD55, 0); send_cmd(CMD23, count); // ACMD23
        }
        if (send_cmd(CMD25, sector) == 0) // WRITE_MULTIPLE_BLOCK
        {
            do
            {
                if (!xmit_datablock(buff, 0xFC))
                {
                    break;
                }
                buff += 512;
            }
            while (--count);
            if (!xmit_datablock(0, 0xFD)) // STOP_TRAN token
            {
                count = 1;
            }
        }
    }
    DESELECT(); // CS = H
    rcvr_spi(); // Idle (Release DO)
    return count ? RES_ERROR : RES_OK;
}
#endif /* _READONLY */

DRESULT disk_ioctl(BYTE drv, BYTE ctrl, void *buff)
{
    /*
        BYTE drv   : Physical drive number (0)
        BYTE ctrl  : Control code
        void *buff : Buffer to send/receive control data
    */
    DRESULT res;
    BYTE n;
    BYTE csd[16];
    BYTE *ptr = buff;
    WORD csize;
    if (drv)
    {
        return RES_PARERR;
    }
    res = RES_ERROR;
    if (ctrl == CTRL_POWER)
    {
        switch (*ptr)
        {
        case 0: // Sub control code == 0 (POWER_OFF)
            if (chk_power())
            {
                power_off();
            }
            res = RES_OK;
            break;
        case 1: // Sub control code == 1 (POWER_ON)
            power_on();
            res = RES_OK;
            break;
        case 2: // Sub control code == 2 (POWER_GET)
            *(ptr+1) = (BYTE)chk_power();
            res = RES_OK;
            break;
        default:
            res = RES_PARERR;
        }
    }
    else
    {
        if (disk.status & STA_NOINIT)
        {
            return RES_NOTRDY;
        }
        SELECT();
        switch (ctrl)
        {
        case GET_SECTOR_COUNT: // Get number of sectors on the disk (DWORD)
            if ((send_cmd(CMD9, 0) == 0) && rcvr_datablock(csd, 16))
            {
                if ((csd[0] >> 6) == 1) // SDC ver 2.00
                {
                    csize = csd[9] + ((WORD)csd[8] << 8) + 1;
                    *(DWORD*)buff = (DWORD)csize << 10;
                }
                else // MMC or SDC ver 1.XX
                {
                    n = (csd[5] & 15) + ((csd[10] & 128) >> 7) + ((csd[9] & 3) << 1) + 2;
                    csize = (csd[8] >> 6) + ((WORD)csd[7] << 2) + ((WORD)(csd[6] & 3) << 10) + 1;
                    *(DWORD*)buff = (DWORD)csize << (n - 9);
                }
                res = RES_OK;
            }
            break;
        case GET_SECTOR_SIZE: // Get sectors on the disk (WORD)
            *(WORD*)buff = 512;
            res = RES_OK;
            break;
        case CTRL_SYNC: // Make sure that data has been written
            if (wait_ready() == 0xFF)
            {
                res = RES_OK;
            }
            break;
        case MMC_GET_CSD: // Receive CSD as a data block (16 bytes)
            if (send_cmd(CMD9, 0) == 0 && rcvr_datablock(ptr, 16)) // READ_CSD
            {
                res = RES_OK;
            }
            break;
        case MMC_GET_CID: // Receive CID as a data block (16 bytes)
            if (send_cmd(CMD10, 0) == 0 && rcvr_datablock(ptr, 16)) // READ_CID
            {
                res = RES_OK;
            }
            break;
        case MMC_GET_OCR: // Receive OCR as an R3 resp (4 bytes)
            if (send_cmd(CMD58, 0) == 0)  // READ_OCR
            {
                for (n = 0; n < 4; n++)
                {
                    *ptr++ = rcvr_spi();
                }
                res = RES_OK;
            }
            break; // ADDED BY ME!
        default:
            res = RES_PARERR;
        }
        DESELECT(); // CS = H
        rcvr_spi(); // Idle (Release DO)
    }
    return res;
}

void disk_timerproc(void)
{
    /*
        This function must be called in period of 10ms
    */
    BYTE n;
    n = disk.timer1;
    if (n)
    {
        disk.timer1 = --n;
    }
    n = disk.timer2;
    if (n)
    {
        disk.timer2 = --n;
    }
}

DWORD get_fattime(void)
{
    /*
        This is a real time clock service to be called from
        FatFs module. Any valid time must be returned even if
        the system does not support a real time clock.
    */
    return    ((2007UL-1980) << 25)  // Year = 2007
            | (6UL << 21)            // Month = June
            | (5UL << 16)            // Day = 5
            | (11U << 11)            // Hour = 11
            | (38U << 5)             // Min = 38
            | (0U >> 1);             // Sec = 0
}
