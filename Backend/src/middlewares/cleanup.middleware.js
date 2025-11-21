import fs from "fs";

// Middleware to cleanup uploaded file after request completes
export const cleanupUpload = (req, res, next) => {
  // Store original send function
  const originalSend = res.send;
  
  // Override send function
  res.send = function(data) {
    // Delete the temp file if it exists
    if (req.file && req.file.path) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log(`✅ Cleaned up temp file: ${req.file.path}`);
        }
      } catch (error) {
        console.error(`❌ Error cleaning up file:`, error.message);
      }
    }
    
    // Call original send
    originalSend.call(this, data);
  };
  
  next();
};
