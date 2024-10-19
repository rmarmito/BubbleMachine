################################################################################
# Automatically-generated file. Do not edit!
################################################################################

CG_TOOL_ROOT := /home/josef/ti/ccs1271/ccs/tools/compiler/ti-cgt-arm_20.2.7.LTS

GEN_OPTS__FLAG := 
GEN_CMDS__FLAG := 

ORDERED_OBJS += \
"./tm4c123gh6pz_startup_ccs.obj" \
"./Device_Library/source/led.obj" \
"./Device_Library/source/mempool.obj" \
"./Device_Library/source/sw.obj" \
"./Hardware_Library/source/adc.obj" \
"./Hardware_Library/source/gpio.obj" \
"./Hardware_Library/source/nvic.obj" \
"./Hardware_Library/source/ssi.obj" \
"./Hardware_Library/source/sysctl.obj" \
"./Hardware_Library/source/systick.obj" \
"./Hardware_Library/source/timer.obj" \
"./Project_Main/init.obj" \
"./Project_Main/main.obj" \
"./Project_Main/sm.obj" \
"./SD_Library/fatfs/ff.obj" \
"./SD_Library/fatfs/tm4c123g.obj" \
"./SD_Library/wave.obj" \
"../tm4c123gh6pz.cmd" \
$(GEN_CMDS__FLAG) \
-llibc.a \

-include ../makefile.init

RM := rm -rf
RMDIR := rm -rf

# All of the sources participating in the build are defined here
-include sources.mk
-include subdir_vars.mk
-include Device_Library/source/subdir_vars.mk
-include Hardware_Library/source/subdir_vars.mk
-include Project_Main/subdir_vars.mk
-include SD_Library/fatfs/subdir_vars.mk
-include SD_Library/subdir_vars.mk
-include subdir_rules.mk
-include Device_Library/source/subdir_rules.mk
-include Hardware_Library/source/subdir_rules.mk
-include Project_Main/subdir_rules.mk
-include SD_Library/fatfs/subdir_rules.mk
-include SD_Library/subdir_rules.mk
-include objects.mk

ifneq ($(MAKECMDGOALS),clean)
ifneq ($(strip $(C55_DEPS)),)
-include $(C55_DEPS)
endif
ifneq ($(strip $(C_UPPER_DEPS)),)
-include $(C_UPPER_DEPS)
endif
ifneq ($(strip $(S67_DEPS)),)
-include $(S67_DEPS)
endif
ifneq ($(strip $(S62_DEPS)),)
-include $(S62_DEPS)
endif
ifneq ($(strip $(S_DEPS)),)
-include $(S_DEPS)
endif
ifneq ($(strip $(OPT_DEPS)),)
-include $(OPT_DEPS)
endif
ifneq ($(strip $(C??_DEPS)),)
-include $(C??_DEPS)
endif
ifneq ($(strip $(ASM_UPPER_DEPS)),)
-include $(ASM_UPPER_DEPS)
endif
ifneq ($(strip $(S??_DEPS)),)
-include $(S??_DEPS)
endif
ifneq ($(strip $(C64_DEPS)),)
-include $(C64_DEPS)
endif
ifneq ($(strip $(CXX_DEPS)),)
-include $(CXX_DEPS)
endif
ifneq ($(strip $(S64_DEPS)),)
-include $(S64_DEPS)
endif
ifneq ($(strip $(INO_DEPS)),)
-include $(INO_DEPS)
endif
ifneq ($(strip $(CLA_DEPS)),)
-include $(CLA_DEPS)
endif
ifneq ($(strip $(S55_DEPS)),)
-include $(S55_DEPS)
endif
ifneq ($(strip $(SV7A_DEPS)),)
-include $(SV7A_DEPS)
endif
ifneq ($(strip $(C62_DEPS)),)
-include $(C62_DEPS)
endif
ifneq ($(strip $(C67_DEPS)),)
-include $(C67_DEPS)
endif
ifneq ($(strip $(PDE_DEPS)),)
-include $(PDE_DEPS)
endif
ifneq ($(strip $(K_DEPS)),)
-include $(K_DEPS)
endif
ifneq ($(strip $(C_DEPS)),)
-include $(C_DEPS)
endif
ifneq ($(strip $(CC_DEPS)),)
-include $(CC_DEPS)
endif
ifneq ($(strip $(C++_DEPS)),)
-include $(C++_DEPS)
endif
ifneq ($(strip $(C43_DEPS)),)
-include $(C43_DEPS)
endif
ifneq ($(strip $(S43_DEPS)),)
-include $(S43_DEPS)
endif
ifneq ($(strip $(ASM_DEPS)),)
-include $(ASM_DEPS)
endif
ifneq ($(strip $(S_UPPER_DEPS)),)
-include $(S_UPPER_DEPS)
endif
ifneq ($(strip $(CPP_DEPS)),)
-include $(CPP_DEPS)
endif
ifneq ($(strip $(SA_DEPS)),)
-include $(SA_DEPS)
endif
endif

-include ../makefile.defs

# Add inputs and outputs from these tool invocations to the build variables 
EXE_OUTPUTS += \
Recording_Device.out 

EXE_OUTPUTS__QUOTED += \
"Recording_Device.out" 


# All Target
all: $(OBJS) $(CMD_SRCS) $(GEN_CMDS)
	@$(MAKE) --no-print-directory -Onone "Recording_Device.out"

# Tool invocations
Recording_Device.out: $(OBJS) $(CMD_SRCS) $(GEN_CMDS)
	@echo 'Building target: "$@"'
	@echo 'Invoking: Arm Linker'
	"/home/josef/ti/ccs1271/ccs/tools/compiler/ti-cgt-arm_20.2.7.LTS/bin/armcl" -mv7M4 --code_state=16 --float_support=FPv4SPD16 -me --define=ccs="ccs" --define=PART_TM4C123GH6PZ -g --c99 --gcc --diag_warning=225 --diag_wrap=off --display_error_number --abi=eabi -z -m"Recording_Device.map" --heap_size=0 --stack_size=512 -i"/home/josef/ti/ccs1271/ccs/tools/compiler/ti-cgt-arm_20.2.7.LTS/lib" -i"/home/josef/ti/ccs1271/ccs/tools/compiler/ti-cgt-arm_20.2.7.LTS/include" --reread_libs --diag_wrap=off --display_error_number --warn_sections --xml_link_info="Recording_Device_linkInfo.xml" --rom_model -o "Recording_Device.out" $(ORDERED_OBJS)
	@echo 'Finished building target: "$@"'
	@echo ' '

# Other Targets
clean:
	-$(RM) $(EXE_OUTPUTS__QUOTED)
	-$(RM) "tm4c123gh6pz_startup_ccs.obj" "Device_Library/source/led.obj" "Device_Library/source/mempool.obj" "Device_Library/source/sw.obj" "Hardware_Library/source/adc.obj" "Hardware_Library/source/gpio.obj" "Hardware_Library/source/nvic.obj" "Hardware_Library/source/ssi.obj" "Hardware_Library/source/sysctl.obj" "Hardware_Library/source/systick.obj" "Hardware_Library/source/timer.obj" "Project_Main/init.obj" "Project_Main/main.obj" "Project_Main/sm.obj" "SD_Library/fatfs/ff.obj" "SD_Library/fatfs/tm4c123g.obj" "SD_Library/wave.obj" 
	-$(RM) "tm4c123gh6pz_startup_ccs.d" "Device_Library/source/led.d" "Device_Library/source/mempool.d" "Device_Library/source/sw.d" "Hardware_Library/source/adc.d" "Hardware_Library/source/gpio.d" "Hardware_Library/source/nvic.d" "Hardware_Library/source/ssi.d" "Hardware_Library/source/sysctl.d" "Hardware_Library/source/systick.d" "Hardware_Library/source/timer.d" "Project_Main/init.d" "Project_Main/main.d" "Project_Main/sm.d" "SD_Library/fatfs/ff.d" "SD_Library/fatfs/tm4c123g.d" "SD_Library/wave.d" 
	-@echo 'Finished clean'
	-@echo ' '

.PHONY: all clean dependents
.SECONDARY:

-include ../makefile.targets

