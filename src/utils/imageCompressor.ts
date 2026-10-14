/**
 * In-browser image compressor using HTML5 Canvas.
 * Prevents HTTP 413 Payload Too Large and Gateway Timeouts
 * when users upload 8MB-25MB camera photos.
 */

export async function compressImageIfNeeded(dataUrl: string, maxDimension: number = 1024, quality: number = 0.85): Promise<string> {
  // If data is already an SVG or tiny string, return as is
  if (dataUrl.startsWith('data:image/svg+xml') || dataUrl.length < 300000) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down if larger than maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Export as JPEG with optimal compression
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}
