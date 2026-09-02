export type PhotoTransform = {
  zoom: number;
  x: number;
  y: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
};

export function cropGeometry(width: number, height: number, size: number, transform: PhotoTransform) {
  const sideways = transform.rotation % 180 !== 0;
  const rotatedWidth = sideways ? height : width;
  const rotatedHeight = sideways ? width : height;
  const scale = Math.max(size / rotatedWidth, size / rotatedHeight) * transform.zoom;
  return {
    scale,
    offsetX: transform.x / 100 * (rotatedWidth * scale - size) / 2,
    offsetY: transform.y / 100 * (rotatedHeight * scale - size) / 2,
  };
}

// The editor and exported file use this same draw path, so the crop is identical.
export function drawPhotoCrop(canvas: HTMLCanvasElement, source: HTMLImageElement, transform: PhotoTransform) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  const size = canvas.width;
  const { scale, offsetX, offsetY } = cropGeometry(source.naturalWidth, source.naturalHeight, size, transform);
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, size, size);
  context.translate(size / 2 + offsetX, size / 2 + offsetY);
  context.scale(transform.flipX ? -1 : 1, transform.flipY ? -1 : 1);
  context.rotate(transform.rotation * Math.PI / 180);
  context.scale(scale, scale);
  context.drawImage(source, -source.naturalWidth / 2, -source.naturalHeight / 2);
}
