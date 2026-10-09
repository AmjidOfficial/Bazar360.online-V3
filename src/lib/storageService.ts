import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Resizes and compresses an image file using browser Canvas API to optimize performance and bandwidth usage.
 * @param file The original image file from input
 * @param maxWidth The target maximum width in pixels
 * @param maxHeight The target maximum height in pixels
 * @param quality Compression quality from 0.0 to 1.0 (defaults to 0.8)
 * @returns A Promise resolving to a high-speed web-ready Blob
 */
export async function compressAndResizeImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio calculations
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to fetch Canvas 2D rendering context'));
          return;
        }

        // Draw image resized onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // AUTOMATIC WATERMARK STAMP FOR BAZAR360.ONLINE
        try {
          ctx.save();
          const fontSize = Math.max(12, Math.round(width * 0.024));
          ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", "Inter", sans-serif`;
          const text = "Bazar360.online";
          const textMetrics = ctx.measureText(text);
          const textWidth = textMetrics.width;
          
          const paddingX = fontSize * 1.2;
          const paddingY = fontSize * 0.6;
          const pillWidth = textWidth + paddingX * 2;
          const pillHeight = fontSize + paddingY * 2;
          
          const marginRight = Math.max(12, Math.round(width * 0.03));
          const marginBottom = Math.max(12, Math.round(height * 0.03));
          
          const pillX = width - pillWidth - marginRight;
          const pillY = height - pillHeight - marginBottom;
          
          const radius = pillHeight / 2;
          ctx.beginPath();
          ctx.moveTo(pillX + radius, pillY);
          ctx.lineTo(pillX + pillWidth - radius, pillY);
          ctx.quadraticCurveTo(pillX + pillWidth, pillY, pillX + pillWidth, pillY + radius);
          ctx.lineTo(pillX + pillWidth, pillY + pillHeight - radius);
          ctx.quadraticCurveTo(pillX + pillWidth, pillY + pillHeight, pillX + pillWidth - radius, pillY + pillHeight);
          ctx.lineTo(pillX + radius, pillY + pillHeight);
          ctx.quadraticCurveTo(pillX, pillY + pillHeight, pillX, pillY + pillHeight - radius);
          ctx.lineTo(pillX, pillY + radius);
          ctx.quadraticCurveTo(pillX, pillY, pillX + radius, pillY);
          ctx.closePath();
          
          ctx.fillStyle = "rgba(11, 15, 25, 0.72)";
          ctx.fill();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
          ctx.lineWidth = 1;
          ctx.stroke();
          
          const dotRadius = fontSize * 0.22;
          const dotX = pillX + paddingX + dotRadius;
          const dotY = pillY + paddingY + fontSize / 2 + 1;
          
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI);
          ctx.fillStyle = "#F97316"; // Brand Orange
          ctx.fill();
          
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.textBaseline = "middle";
          ctx.fillText(text, dotX + dotRadius * 2 + 6, dotY);
          ctx.restore();
        } catch (watermarkErr) {
          console.warn('[Watermark Pipeline] Failed to draw watermark:', watermarkErr);
        }

        // Convert canvas output to high-speed web-ready Blob representation
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas image conversion to Blob failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

interface UploadProgressCallback {
  (progressPercent: number): void;
}

/**
 * Uploads a vehicle listing image to Firebase Storage with automatic compression and real-time upload progress tracking.
 * @param file Raw file uploaded by user
 * @param vehicleId Associated Vehicle/Listing ID to organize storage directories
 * @param onProgress Callback receiving current upload progress percentage
 * @returns Ref download URL of uploaded optimized file
 */
export async function uploadListingImage(
  file: File,
  vehicleId: string,
  onProgress?: UploadProgressCallback
): Promise<string> {
  // 1. Process image compression and optimization before transmission
  let uploadBlob: Blob = file;
  if (file.type.startsWith('image/')) {
    try {
      uploadBlob = await compressAndResizeImage(file);
      console.log(`[Media Pipeline] Image optimized successfully. Pre-upload size reduction complete.`);
    } catch (err) {
      console.warn('[Media Pipeline] Image optimization failed, uploading original fallback:', err);
    }
  }

  // 2. Generate a secure, structured path: /vehicles/{vehicleId}/images/{timestamp}-{fileName}
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `vehicles/${vehicleId}/images/${Date.now()}-${cleanFileName}`;
  const storageRef = ref(storage, storagePath);

  // 3. Initiate resumable upload task
  const uploadTask = uploadBytesResumable(storageRef, uploadBlob, {
    contentType: file.type.startsWith('image/') ? 'image/jpeg' : file.type,
    customMetadata: {
      vehicleId,
      uploadedAt: new Date().toISOString(),
      originalSize: file.size.toString(),
      optimizedSize: uploadBlob.size.toString()
    }
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        console.error('[Storage Pipeline] File upload task failed:', error);
        reject(error);
      },
      async () => {
        // Complete, fetch download URL reference
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}
