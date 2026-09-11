import React, { useState } from "react";
import { ImageDropzone } from "../utils/ImageConverter";

const Dashboard = () => {
  const [imageBase64, setImageBase64] = useState("");
  const handleImageSelect = (base64, file) => {
    console.log("Original File:", file);
    console.log("Base64 Image:", base64);
    setImageBase64(base64);
  };

  return (
    <>
      <ImageDropzone onImageSelect={handleImageSelect} />
      {imageBase64 && (
        <img
          src={imageBase64}
          alt="Selected"
          style={{ maxWidth: "100%", marginTop: "20px" }}
        />
      )}
    </>
  );
};

export default Dashboard;
