const Figure = ({ containerClass, imgSrc, imgAlt, figcaptionText, id }) => {
  const $container = document.createElement("div");
  const $figure = document.createElement("figure");
  const $image = document.createElement("img");
  const $figCaption = document.createElement("figcaption");

  $container.classList.add(containerClass);
  $container.dataset.imgId = id;

  $image.src = imgSrc;
  $image.alt = imgAlt;

  $figCaption.textContent = figcaptionText;

  $figure.append($image, $figCaption);
  $container.appendChild($figure);

  return $container;
};

export default Figure;
