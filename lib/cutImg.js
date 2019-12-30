module.exports = async (url, {
  w,
  h
}) => {
  const {
    createCanvas,
    loadImage
  } = require("canvas");

  // Draw cat with lime helmet
  const image = await loadImage(url);
  const {
    width,
    height
  } = image;


  h = h ? h : Math.ceil((height / width) * w)

  const canvas = createCanvas(Number(w), Number(h));

  const ctx = canvas.getContext("2d");

  const dx = (w - width) / 2
  const dy = (h - height) / 2

  ctx.drawImage(image, dx, dy, width, height);

  return canvas.toBuffer("image/png", {
    quality: 0.5
  });
};