import React, { useState, useEffect } from 'react';
import { getVideoBlobUrl } from '../utils/videoStorage';
import { Play, AlertCircle, Loader2 } from 'lucide-react';

export default function SmartVideoPlayer({
  src,
  poster,
  autoPlay = false,
  controls = true,
  className = "w-full h-full object-cover",
  title = "Video Player",
}) {
  const [resolvedSrc, setResolvedSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Parse YouTube video ID
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Parse Vimeo video ID
  const getVimeoId = (url) => {
    if (!url) return null;
    const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const ytId = getYouTubeId(src);
  const vimeoId = getVimeoId(src);

  useEffect(() => {
    setError(false);
    if (!src) {
      setResolvedSrc('');
      return;
    }

    if (src.startsWith('indexeddb://')) {
      const id = src.replace('indexeddb://', '');
      setLoading(true);
      getVideoBlobUrl(id)
        .then((blobUrl) => {
          if (blobUrl) {
            setResolvedSrc(blobUrl);
          } else {
            setError(true);
          }
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    } else {
      setResolvedSrc(src);
    }
  }, [src]);

  // If YouTube link
  if (ytId) {
    return (
      <div className="relative w-full h-full aspect-video bg-black rounded-inherit overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0"
        />
      </div>
    );
  }

  // If Vimeo link
  if (vimeoId) {
    return (
      <div className="relative w-full h-full aspect-video bg-black rounded-inherit overflow-hidden">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=${autoPlay ? 1 : 0}&title=0&byline=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0"
        />
      </div>
    );
  }

  // Loading state for IndexedDB blobs
  if (loading) {
    return (
      <div className="w-full h-full aspect-video flex flex-col items-center justify-center bg-black/90 text-white gap-2">
        <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
        <span className="text-xs font-mono text-slate-400">Loading video stream...</span>
      </div>
    );
  }

  // Error state
  if (error || (!resolvedSrc && !poster)) {
    return (
      <div className="w-full h-full aspect-video flex flex-col items-center justify-center bg-slate-900 text-slate-400 gap-2 p-4 text-center">
        <AlertCircle className="w-6 h-6 text-rose-500" />
        <span className="text-xs font-mono">Video not available or link expired</span>
      </div>
    );
  }

  // Standard Native HTML5 Video
  return (
    <video
      key={resolvedSrc}
      src={resolvedSrc}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      playsInline
      className={className}
      onError={() => setError(true)}
    >
      Your browser does not support HTML5 video streaming.
    </video>
  );
}
