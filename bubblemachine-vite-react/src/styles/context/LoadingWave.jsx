import { Box } from "@mui/material";

const LoadingWave = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "3px",
      }}
    >
      {[...Array(5)].map((_, index) => (
        <Box
          key={index}
          sx={{
            width: "3px",
            height: "15px",
            backgroundColor: "#4E9EE7",
            borderRadius: "3px",
            animation: "loadingWave 1s ease-in-out infinite",
            animationDelay: `${index * 0.1}s`,
            "@keyframes loadingWave": {
              "0%, 100%": {
                transform: "scaleY(0.5)",
              },
              "50%": {
                transform: "scaleY(1)",
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

export default LoadingWave;
