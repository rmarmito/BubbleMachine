import React from "react";
import { Box, Typography } from "@mui/material";

{
  /*To use the BubbleBox component, import as follows:
    <BubbleBox
        label="FIRST LABEL"
        labelColor="FIRST COLOR"
        title="SECOND LABEL (IF EXISTS)"
        titleColor="SECOND COLOR"
      >
         // more content of the box
    </BubbleBox>
*/
}

const BubbleBox = ({ label, labelColor, title, titleColor, children }) => {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: "black",
        borderRadius: "10px",
        backgroundColor: "grey.100",
        pb: 2,
        mx: "5%",
        my: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          p: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* label and label color */}
        {label && (
          <Typography
            sx={{ color: labelColor, mr: 1 }} // take in custom label color
            variant="h6"
            component="span"
          >
            {label}
          </Typography>
        )}

        {/* title and title color */}
        <Typography
          sx={{ color: titleColor }} // take in custom title color
          variant="h6"
          component="span"
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );
};

export default BubbleBox;
