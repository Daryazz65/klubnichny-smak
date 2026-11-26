const card = document.querySelector("#showcase");
const image = document.querySelector("#fruit-image");
const caption = document.querySelector("#image-caption");
const title = document.querySelector("#variety-title");
const description = document.querySelector("#variety-description");
const details = document.querySelector("#variety-details");
const specs = document.querySelector("#specs");
const source = document.querySelector("#source");
const counter = document.querySelector("#counter");
const list = document.querySelector("#variety-list");
const traits = { frost:"Морозостойкость", yield:"Урожайность", size:"Размер ягоды", taste:"Вкус" };
let current = 0;

function element(tag, value, className) {
  const node = document.createElement(tag);
  if (value) node.textContent = value;
  if (className) node.className = className;
  return node;
}

function directLink(id) {
  return "#malina/" + id;
}

const links = cultivars.map(({ id, name }) => {
  const link = element("a", name);
  link.href = directLink(id);
  list.append(link);
  return link;
});

function render(index, reveal = false) {
  current = index;
  const variety = cultivars[index];
  card.dataset.tone = variety.tone || "red";
  const photo = variety.photo || (variety.tone ? {
    src:"./gold.webp", alt:"Жёлтые ягоды малины на кусте", caption:"Жёлтоплодная малина Fall Gold · фото для иллюстрации",
  } : {
    src:"./red.webp", alt:"Красные ягоды малины на ветке", caption:"Красная малина · фото для иллюстрации",
  });
  if (image.getAttribute("src") !== photo.src) image.src = photo.src;
  image.alt = photo.alt;
  caption.textContent = photo.caption;
  title.textContent = variety.name;
  description.textContent = variety.description;
  counter.textContent = String(index + 1).padStart(2,"0") + " / " + cultivars.length;
  specs.replaceChildren(...Object.entries(traits).map(([key, label]) => {
    const spec = element("div", "", "spec");
    spec.append(element("dt", label), element("dd", variety[key]));
    return spec;
  }));
  source.hidden = !variety.source;
  if (variety.source) {
    source.textContent = variety.reference || variety.source[0];
    source.href = variety.source[1];
    source.target = "_blank";
    source.rel = "noopener";
  }
  links.forEach((link, position) => {
    if (position === index) link.setAttribute("aria-current","true");
    else link.removeAttribute("aria-current");
  });
  if (reveal) {
    details.classList.remove("reveal");
    void details.offsetWidth;
    details.classList.add("reveal");
  }
}

function route(scroll) {
  const index = cultivars.findIndex(({ id }) => directLink(id) === location.hash);
  if (index < 0) return;
  render(index, scroll);
  if (scroll) card.scrollIntoView({block:"start"});
}

for (const [id, direction] of [["prev", -1],["next", 1]]) {
  document.querySelector("#" + id).addEventListener("click", () => {
    const index = (current + direction + cultivars.length) % cultivars.length;
    history.replaceState(null, "", directLink(cultivars[index].id));
    render(index, true);
  });
}

for (const link of links) {
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hash !== location.hash) return;
    event.preventDefault();
    card.scrollIntoView({block:"start"});
  });
}
window.addEventListener("hashchange", () => route(true));
render(0);
route(true);

const plant = document.querySelector("#plant");
const turns = document.querySelector("#turn-buttons");
const scene = createPlantScene(plant,"raspberry");
if (scene) {
  turns.addEventListener("click",(event) => {
    const button = event.target.closest("[data-turn]");
    if (button) scene.turn(Number(button.dataset.turn) * .42);
  });
  plant.addEventListener("keydown", (event) => {
    const direction = {ArrowLeft:-1, ArrowRight:1}[event.key];
    if (!direction) return;
    event.preventDefault();
    scene.turn(direction * .25);
  });
  let pointer = null;
  plant.addEventListener("pointerdown",(event) => {
    if (!event.isPrimary || event.button !== 0) return;
    plant.setPointerCapture(event.pointerId);
    pointer = {id:event.pointerId, x:event.clientX};
  });
  plant.addEventListener("pointermove",(event) => {
    if (event.pointerId !== pointer?.id) return;
    scene.turn((event.clientX - pointer.x) * .014);
    pointer.x = event.clientX;
  });
  plant.addEventListener("lostpointercapture",() => { pointer = null; });
} else {
  plant.hidden = true;
  turns.hidden = true;
  document.querySelector("#model-fallback").hidden = false;
}

const {phone,pickup,hours} = contacts;
if (phone || pickup || hours) {
  const contactInfo = document.querySelector("#contact-info");
  contactInfo.replaceChildren();
  if (phone) {
    const link = element("a",phone);
    link.href = "tel:" + phone.replace(/[^+\d]/g,"");
    const row = document.createElement("p");
    row.append(link);
    contactInfo.append(row);
  }
  if (pickup) contactInfo.append(element("p",pickup));
  if (hours) contactInfo.append(element("p",hours));
}
