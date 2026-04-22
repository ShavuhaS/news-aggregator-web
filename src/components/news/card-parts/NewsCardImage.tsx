const DEFAULT_IMAGE = `${import.meta.env.VITE_API_URL}/static/default-news.jpg`;

interface NewsCardImageProps {
  src: string | null;
  title: string;
  link: string;
}

export function NewsCardImage({ src, title, link }: NewsCardImageProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="aspect-video w-full overflow-hidden bg-muted block relative"
    >
      <img
        src={src || DEFAULT_IMAGE}
        alt={title}
        onError={handleImageError}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
    </a>
  );
}
