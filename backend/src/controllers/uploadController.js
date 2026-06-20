import cloudinary from "../utils/cloudinary.js";

// ── @desc    Upload a single image to Cloudinary
// ── @route   POST /api/upload
// ── @access  Private/Admin
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Convert buffer to a base64 data URI Cloudinary can accept directly
    const base64String = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64String}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "ecommerce-products", // keeps your Cloudinary media library organized
    });

    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};