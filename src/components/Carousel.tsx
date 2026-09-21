import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";

interface CarouselProps {
    items: React.ReactNode[];
    autoPlay?: boolean;
    interval?: number;
}

const ComponentCarousel = ({
    items = [],
    autoPlay = true,
    interval = 5000,
}: CarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let timer: any;
        if (autoPlay && items.length > 1) {
            timer = setInterval(() => {
                handleNext();
            }, interval);
        }
        return () => clearInterval(timer);
    }, [currentIndex, autoPlay, interval, items.length]);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
            handlePrevious();
        } else if (event.key === "ArrowRight") {
            handleNext();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown as any);
        return () => window.removeEventListener("keydown", handleKeyDown as any);
    }, []);

    if (!items || items.length === 0) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                No items available
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
            }}
        >
            {/* Items Container */}
            <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                {items.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            opacity: index === currentIndex ? 1 : 0,
                            transition: "opacity 0.5s ease-in-out",
                            zIndex: index === currentIndex ? 1 : 0,
                        }}
                    >
                        {item}
                    </Box>
                ))}
            </Box>

            {/* Navigation Controls */}
            {items.length > 1 && (
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 30,
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        zIndex: 10,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        padding: "8px 16px",
                        borderRadius: "24px",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <IconButton
                        onClick={handlePrevious}
                        size="small"
                        sx={{ color: "primary.main" }}
                    >
                        <ArrowLeft />
                    </IconButton>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        {items.map((_, index) => (
                            <Box
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                sx={{
                                    width: index === currentIndex ? 24 : 12,
                                    height: 4,
                                    backgroundColor:
                                        index === currentIndex ? "primary.main" : "grey.400",
                                    borderRadius: 2,
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                }}
                            />
                        ))}
                    </Box>

                    <IconButton
                        onClick={handleNext}
                        size="small"
                        sx={{ color: "primary.main" }}
                    >
                        <ArrowRight />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default ComponentCarousel;
