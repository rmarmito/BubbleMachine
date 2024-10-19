#ifndef ADC_H_
#define ADC_H_

#include <stdbool.h>
#include <stdint.h>

typedef struct Adc Adc;

typedef enum
{
    ADC_MOD0,
    ADC_MOD1

}   Adc_module;

typedef enum
{
    ADC_SAMPLER0,
    ADC_SAMPLER1,
    ADC_SAMPLER2,
    ADC_SAMPLER3

}   Adc_sampler;

typedef enum
{
    ADC_AIN0,
    ADC_AIN1,
    ADC_AIN2,
    ADC_AIN3,
    ADC_AIN4,
    ADC_AIN5,
    ADC_AIN6,
    ADC_AIN7,
    ADC_AIN8,
    ADC_AIN9,
    ADC_AIN10,
    ADC_AIN11,
    ADC_CHANNEL_MAX

}   Adc_channel;

typedef enum
{
    ADC_0X,
    ADC_2X,
    ADC_4X,
    ADC_8X,
    ADC_16X,
    ADC_32X,
    ADC_64X

}   Adc_oversample;

Adc *adc_address(Adc_module module);

void adc_set_order(Adc *adc, Adc_sampler sampler, uint8_t num, Adc_channel channel);

void adc_set_end(Adc *adc, Adc_sampler sampler, uint8_t num);

void adc_set_trigger(Adc *adc, Adc_sampler sampler, uint8_t num);

void adc_set_averaging(Adc *adc, Adc_oversample oversample);

void adc_enable_interrupt(Adc *adc, Adc_sampler sampler);

void adc_enable_sampler(Adc *adc, Adc_sampler sampler);

void adc_disable_sampler(Adc *adc, Adc_sampler sampler);

void adc_sample(Adc *adc, Adc_sampler sampler);

bool adc_busy(Adc *adc);

uint32_t adc_result(Adc *adc, Adc_sampler sampler);

#endif /* ADC_H_ */
