// IndexedDB storage utility for large local video files
const DB_NAME = 'PortfolioMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save video File/Blob to IndexedDB
export async function saveVideoBlob(id, file) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const record = {
      id,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified || Date.now(),
      blob: file,
    };

    const request = store.put(record);
    request.onsuccess = () => resolve(`indexeddb://${id}`);
    request.onerror = () => reject(request.error);
  });
}

// Retrieve video Blob from IndexedDB and return an Object URL
const activeObjectUrls = new Map();

export async function getVideoBlobUrl(id) {
  if (activeObjectUrls.has(id)) {
    return activeObjectUrls.get(id);
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      if (request.result && request.result.blob) {
        const url = URL.createObjectURL(request.result.blob);
        activeObjectUrls.set(id, url);
        resolve(url);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

// Delete video from IndexedDB
export async function deleteVideoBlob(id) {
  if (activeObjectUrls.has(id)) {
    URL.revokeObjectURL(activeObjectUrls.get(id));
    activeObjectUrls.delete(id);
  }

  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

// Automatically generate a video frame thumbnail (JPEG Data URL) from a video File
export function generateThumbnailFromVideo(file, seekTimeSeconds = 1) {
  return new Promise((resolve, reject) => {
    const tempUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = tempUrl;

    video.onloadedmetadata = () => {
      // Seek to either seekTimeSeconds or 25% into video
      const targetTime = Math.min(seekTimeSeconds, video.duration ? video.duration / 4 : 1);
      video.currentTime = targetTime;
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        URL.revokeObjectURL(tempUrl);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(tempUrl);
        reject(err);
      }
    };

    video.onerror = (err) => {
      URL.revokeObjectURL(tempUrl);
      reject(err);
    };
  });
}

// Helper to parse video duration from video file
export function getVideoDuration(file) {
  return new Promise((resolve) => {
    const tempUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = tempUrl;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(tempUrl);
      const totalSeconds = Math.round(video.duration || 0);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      resolve(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    };

    video.onerror = () => {
      URL.revokeObjectURL(tempUrl);
      resolve('0:30');
    };
  });
}
