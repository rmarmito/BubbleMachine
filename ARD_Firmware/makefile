.RECIPEPREFIX = >

PROJECT = Recording_Device

SRC_DIR =\
    ./Devices/source\
    ./Hardware/source\
    ./SD/source\
    ./Startup/source

INC_DIR =\
    ./Devices/include\
    ./Hardware/include\
    ./SD/include\
    ./Startup/include

BLD_DIR = ./build

LINK  = ./Startup/linker.lds

CC = /home/josef/Documents/TivaC/Compiler/bin/arm-none-eabi-gcc-9.2.1

CFLAGS =\
    -mcpu=cortex-m4\
    -march=armv7e-m\
    -mthumb\
    -mfloat-abi=hard\
    -mfpu=fpv4-sp-d16\
    -DPART_TM4C123GH6PZ\
    $(foreach PATH, $(INC_DIR), -I$(PATH))\
    -ffunction-sections\
    -fdata-sections\
    -specs=nosys.specs\
    -ffreestanding\
    -O0\
    -Og\
    -g\
    -gdwarf-3\
    -gstrict-dwarf\
    -std=c99\
    -pedantic-errors\
    -Wall\
    -Wextra

LFLAGS =\
    -mfpu=fpv4-sp-d16\
    -DPART_TM4C123GH6PZ\
    -ffunction-sections\
    -fdata-sections\
    -specs=nosys.specs\
    -Og\
    -g\
    -gdwarf-3\
    -gstrict-dwarf\
    -Wall\
    -mcpu=cortex-m4\
    -mfloat-abi=hard\
    -Wl,-T$(LINK)

VPATH = $(SRC_DIR) $(INC_DIR)
BIN = $(BLD_DIR)/$(PROJECT)
SRC = $(foreach FILE,$(SRC_DIR),$(wildcard $(FILE)/*.c))
DEP = $(addprefix $(BLD_DIR)/,$(notdir $(SRC:c=d)))
OBJ = $(addprefix $(BLD_DIR)/,$(notdir $(SRC:c=o)))

all: $(BIN)

$(BIN): $(OBJ)
>@ $(CC) $(LFLAGS) -o $@ $^

$(BLD_DIR)/%.o: %.c
>@ $(CC) $(CFLAGS) -c -o $@ $<

clean:
>@ rm $(BIN) $(OBJ)

debug:
>@ gdb-multiarch\
    --eval-command="target extended-remote localhost:3333"\
    --eval-command="monitor reset halt"\
    --eval-command="load"\
    --eval-command="tbreak main"\
    --eval-command="c"\
    $(BIN)
