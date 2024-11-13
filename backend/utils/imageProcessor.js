const axios = require("axios"); // To fetch image from URL
const tinify = require("tinify");
require('dotenv').config();
tinify.key = process.env.TINY_PNG_API_KEY;

// Function to optimize image from a buffer
const optimizeImageWithTinyPNG = async (imageBuffer) => {
    // Get the initial size of the image buffer
    const initialSize = imageBuffer.length;

    console.log("initial Size: ", initialSize)

    try {
        // Compress the image buffer using TinyPNG
        const resultData = await tinify.fromBuffer(imageBuffer).toBuffer();

        // Get the optimized size
        const optimizedSize = resultData.length;

        // Return the compressed buffer, initial size, and optimized size
        return { optimizedImageBuffer: resultData, initialSize, finalSize: optimizedSize };
    } catch (error) {
        console.error("Error optimizing image with TinyPNG: ", error);
        throw new Error("Image optimization failed");
    }
};

//utility function to process images
// load image either from url or base encoded string -> convert to buffer and optimize it
const processImage = async (image) => {
    let imageBuffer;
  
    if (image.startsWith("http")) {
      const response = await axios({ url: image, responseType: "arraybuffer" });
      imageBuffer = Buffer.from(response.data);
    } else {
      if (image.includes(",")) {
        base64String = image.split(",")[1];
      }
      else{
        base64String = image;
      }
      imageBuffer = Buffer.from(base64String, "base64");
    }
  
    // Optimize image
    return optimizeImageWithTinyPNG(imageBuffer);
  };




module.exports = {
    optimizeImageWithTinyPNG, processImage
};
