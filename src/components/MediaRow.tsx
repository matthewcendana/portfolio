import { useState } from 'react';
import './MediaRow.css';

export interface MediaRowItem {
  slug: string;
  title: string;
  /** Shown as a second caption line below the title — albums only. */
  artist?: string;
}

interface Props {
  items: MediaRowItem[];
  /** CSS aspect-ratio value, e.g. "2 / 3" for movie posters, "1 / 1" for
   * album covers. One component, two ratios — no separate MovieRow/AlbumRow. */
  aspectRatio: string;
  /** Intrinsic <img> width/height (reserves layout space pre-load) — should
   * be in the same proportion as aspectRatio. */
  imageWidth: number;
  imageHeight: number;
  /** Where the images live: /public/media/movies or /public/media/albums. */
  basePath: string;
  altSuffix: string;
}

type TileProps = { item: MediaRowItem } & Omit<Props, 'items'>;

function MediaTile({ item, aspectRatio, imageWidth, imageHeight, basePath, altSuffix }: TileProps) {
  const [broken, setBroken] = useState(false);
  const alt = item.artist ? `${item.title} ${altSuffix} by ${item.artist}` : `${item.title} ${altSuffix}`;

  return (
    <div className="media-row__tile">
      <div className="media-row__image" style={{ aspectRatio }}>
        {!broken && (
          <img
            className="media-row__img"
            src={`${basePath}/${item.slug}.jpg`}
            width={imageWidth}
            height={imageHeight}
            loading="lazy"
            alt={alt}
            onError={() => setBroken(true)}
          />
        )}
        {broken && (
          <span className="media-row__fallback" aria-hidden="true">
            {item.title}
          </span>
        )}
      </div>
      <p className="media-row__title">{item.title}</p>
      {item.artist && <p className="media-row__artist">{item.artist}</p>}
    </div>
  );
}

export default function MediaRow({ items, aspectRatio, imageWidth, imageHeight, basePath, altSuffix }: Props) {
  return (
    <div className="media-row">
      {items.map((item) => (
        <MediaTile
          key={item.slug}
          item={item}
          aspectRatio={aspectRatio}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          basePath={basePath}
          altSuffix={altSuffix}
        />
      ))}
    </div>
  );
}
