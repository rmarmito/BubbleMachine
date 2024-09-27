import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Select, MenuItem, InputLabel } from "@mui/material";

const NewBubble = () => {
    const { control, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" justifyContent="center">
                <Box display="flex" flexDirection="row" alignItems="center" sx={{ gap: '10px' }}>
                    <Controller
                        control={control}
                        name="id"
                        render={({ field }) => (
                            <div>
                                <InputLabel id="id">Bubble</InputLabel>
                                <TextField {...field} labelId="id" size="small" />
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="color"
                        render={({ field }) => (
                            <div>
                                <InputLabel id="color">Color</InputLabel>
                                <Select {...field} labelId="color" label="Color" size="small">
                                    <MenuItem value="Red">Red</MenuItem>
                                    <MenuItem value="Blue">Blue</MenuItem>
                                    <MenuItem value="Green">Green</MenuItem>
                                    <MenuItem value="Yellow">Yellow</MenuItem>
                                    {/* Add more color options as needed */}
                                </Select>
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="title"
                        render={({ field }) => (
                            <div>
                                <InputLabel id="title">Title</InputLabel>
                                <TextField {...field} labelId="title" size="small" />
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="startTime"
                        render={({ field }) => (
                            <div>
                                <InputLabel id="startTime">Start Time</InputLabel>
                                <TextField {...field} labelId="startTime" size="small" />
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="stopTime"
                        render={({ field }) => (
                            <div>
                                <InputLabel id="stopTime">Stop Time</InputLabel>
                                <TextField {...field} labelId="stopTime" size="small" />
                            </div>
                        )}
                    />
                </Box>
                <Button type="submit" variant="contained" color="primary" size="small" style={{ marginLeft: '10px' }}>
                    Submit
                </Button>
            </Box>
        </form>
    );
};

export default NewBubble;