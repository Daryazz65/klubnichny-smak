const galleryPhotos = [
  { file: "strawberry-seedlings", caption: "Цветущие саженцы клубники", original: [1086, 1448], crop: [195, 270, 518, 647], tone: "flowering" },
  { file: "new-leaves", caption: "Молодой побег крупным планом", original: [720, 1280], crop: [159, 415, 380, 475], tone: "leaves" },
  { file: "roots", caption: "Корни и земляной ком", original: [1166, 1514], crop: [166, 197, 704, 880], tone: "roots" },
  { file: "silver-leaves", caption: "Саженцы с серебристой листвой", original: [960, 1280], crop: [529, 75, 389, 486], tone: "leaves" },
  { file: "row-one", caption: "Побеги молодых саженцев", original: [960, 1280], crop: [318, 176, 243, 304], tone: "leaves" },
  { file: "branching", caption: "Ветвление молодых саженцев", original: [960, 1280], crop: [69, 251, 500, 625], tone: "leaves" },
  { file: "row-two", caption: "Саженцы на открытом воздухе", original: [960, 1280], crop: [390, 160, 384, 480], tone: "leaves" },
  { file: "young-shrubs", caption: "Листья и ветви саженцев", original: [1920, 2560], crop: [276, 578, 780, 975], tone: "leaves" },
  { file: "young-growth", caption: "Молодой прирост", original: [1920, 2560], crop: [552, 293, 816, 1020], tone: "leaves" },
];

const gallery = document.querySelector("#gallery-grid");
const dialog = document.querySelector(".photo-dialog");
const enlargement = document.querySelector("#photo-enlargement");
const caption = document.querySelector("#photo-caption");
let current = 0;

function photoFrame(photo) {
  const [x, y, width, height] = photo.crop;
  const [sourceWidth, sourceHeight] = photo.original;
  const frame = document.createElement("span");
  frame.className = "gallery-frame";
  frame.dataset.tone = photo.tone;
  frame.style.aspectRatio = width + " / " + height;
  frame.style.setProperty("--image-width", (sourceWidth / width * 100) + "%");
  frame.style.setProperty("--image-height", (sourceHeight / height * 100) + "%");
  frame.style.setProperty("--image-left", (-x / width * 100) + "%");
  frame.style.setProperty("--image-top", (-y / height * 100) + "%");
  const image = document.createElement("img");
  image.src = "./media/" + photo.file + ".webp";
  image.alt = photo.caption;
  image.loading = "lazy";
  image.decoding = "async";
  frame.append(image);
  return frame;
}

function showPhoto(index) {
  current = (index + galleryPhotos.length) % galleryPhotos.length;
  const photo = galleryPhotos[current];
  const frame = photoFrame(photo);
  frame.querySelector("img").loading = "eager";
  enlargement.replaceChildren(frame);
  caption.textContent = photo.caption;
}

galleryPhotos.forEach((photo, index) => {
  const figure = document.createElement("figure");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "gallery-photo";
  button.setAttribute("aria-label", "Увеличить фото. " + photo.caption);
  button.append(photoFrame(photo));
  button.addEventListener("click", () => {
    showPhoto(index);
    dialog.showModal();
  });
  const label = document.createElement("figcaption");
  label.textContent = photo.caption;
  figure.append(button, label);
  gallery.append(figure);
});

document.querySelector("#previous-photo").addEventListener("click", () => showPhoto(current - 1));
document.querySelector("#next-photo").addEventListener("click", () => showPhoto(current + 1));
dialog.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  showPhoto(current + (event.key === "ArrowLeft" ? -1 : 1));
});
