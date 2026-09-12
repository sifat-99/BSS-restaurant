import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@mui/system';
import TableGIF from '../assets/Icons/RoundTable.png';

const slowSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const smokeAnimation = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
    filter: blur(2px);
  }
  50% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-120px) scale(3);
    opacity: 0;
    filter: blur(8px);
  }
`;

const SmokeElement = ({ sx }) => (
  <Box
    sx={{
      position: "absolute",
      width: "80px",
      height: "80px",
      background:
        "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
      borderRadius: "50%",
      animation: `${smokeAnimation} 3s infinite ease-in-out`,
      pointerEvents: "none",
      zIndex: 10,
      ...sx,
    }}
  />
);

export const RightBanner = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Rotating Table */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${TableGIF})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          animation: `${slowSpin} 120s infinite linear`,
        }}
      />

      {/* Smoke Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <SmokeElement sx={{ top: "35%", left: "45%", animationDelay: "0s" }} />
        <SmokeElement sx={{ top: "55%", left: "65%", animationDelay: "1s" }} />
        <SmokeElement sx={{ top: "65%", left: "35%", animationDelay: "2s" }} />
        <SmokeElement
          sx={{
            top: "45%",
            left: "55%",
            animationDelay: "1.5s",
            width: "50px",
            height: "50px",
          }}
        />
        <SmokeElement sx={{ top: "75%", left: "60%", animationDelay: "3s" }} />
        <SmokeElement
          sx={{ top: "30%", left: "70%", animationDelay: "2.5s" }}
        />
      </Box>
    </Box>
  );
};
