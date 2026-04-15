import { productImageSrc } from '../utils/productImage';

export default function ProductThumb({ imageUrl, size = 40 }) {
  const src = productImageSrc(imageUrl);
  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={{
          width: size,
          height: size,
          objectFit: 'cover',
          borderRadius: 4,
          verticalAlign: 'middle',
          marginRight: 6
        }}
      />
    );
  }
  return <span style={{ marginRight: 6 }}>{imageUrl || '·'}</span>;
}
