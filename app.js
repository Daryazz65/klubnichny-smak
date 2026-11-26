const varieties = document.querySelector("#varieties");
const search = document.querySelector("#variety-search");
const empty = document.querySelector("#empty");
const traits = { frost:"Морозостойкость", yield:"Урожайность", size:"Размер ягоды", taste:"Вкус" };

function element(tag, value, className) {
  const node = document.createElement(tag);
  if (value) node.textContent = value;
  if (className) node.className = className;
  return node;
}

function externalLink(label, href) {
  const link = element("a", label, "reference");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener";
  return link;
}

const cards = cultivars.map((variety) => {
  const card = element("details", "", "variety");
  card.id = "malina/" + variety.id;
  const summary = document.createElement("summary");
  const action = element("small", "Подробнее");
  action.setAttribute("aria-hidden", "true");
  summary.append(element("strong", variety.name), action);
  const content = element("div", "", "variety-content");

  if (variety.photo) {
    const {src, alt, caption} = variety.photo;
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = src;
    image.alt = alt;
    image.loading = "lazy";
    image.width = 803;
    image.height = 858;
    figure.append(image, element("figcaption", caption));
    content.append(figure);
  }

  const specs = document.createElement("dl");
  specs.append(...Object.entries(traits).map(([key, label]) => {
    const spec = element("div", "", "spec");
    spec.append(element("dt", label), element("dd", variety[key]));
    return spec;
  }));
  content.append(element("p", variety.description), specs);
  if (variety.source) {
    const [label, href] = variety.source;
    content.append(externalLink(variety.reference || label, href));
  }
  if (variety.photoSource) {
    content.append(externalLink("Фото сорта в источнике", variety.photoSource));
  }
  card.addEventListener("toggle", () => {
    action.textContent = card.open ? "Свернуть" : "Подробнее";
  });
  card.append(summary, content);
  varieties.append(card);
  return card;
});

function normalize(value) {
  return value.trim().toLocaleLowerCase("ru").replaceAll("ё", "е");
}

function filterVarieties() {
  const query = normalize(search.value);
  cards.forEach((card, index) => {
    card.hidden = !normalize(cultivars[index].name).includes(query);
  });
  empty.hidden = cards.some((card) => !card.hidden);
}

function openHash() {
  const card = cards.find(({id}) => "#" + id === location.hash);
  if (!card) return;
  search.value = "";
  filterVarieties();
  card.open = true;
  requestAnimationFrame(() => card.scrollIntoView({block:"start"}));
}

search.addEventListener("input", filterVarieties);
window.addEventListener("hashchange", openHash);
openHash();

const plant = document.querySelector("#plant");
const lab = document.querySelector("#lab");
const controls = document.querySelector("#model-controls");
const scene = createPlantScene(plant, "raspberry");
if (scene) {
  const modes = controls.querySelectorAll("[data-scan]");
  controls.addEventListener("click", (event) => {
    const turn = event.target.closest("[data-turn]");
    if (turn) scene.turn(Number(turn.dataset.turn) * .42);
    const mode = event.target.closest("[data-scan]");
    if (mode) {
      const enabled = mode.dataset.scan === "true";
      scene.scan(enabled);
      lab.classList.toggle("scanning", enabled);
      modes.forEach((button) => button.setAttribute("aria-pressed", String(button === mode)));
    }
  });
  plant.addEventListener("keydown", (event) => {
    const direction = {ArrowLeft:-1, ArrowRight:1}[event.key];
    if (!direction) return;
    event.preventDefault();
    scene.turn(direction * .25);
  });
  let pointer = null;
  plant.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    plant.setPointerCapture(event.pointerId);
    pointer = {id:event.pointerId, x:event.clientX};
  });
  plant.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointer?.id) return;
    scene.turn((event.clientX - pointer.x) * .014);
    pointer.x = event.clientX;
  });
  plant.addEventListener("lostpointercapture", () => { pointer = null; });
} else {
  plant.hidden = true;
  controls.hidden = true;
  document.querySelector("#model-fallback").hidden = false;
}

const {phone,pickup,hours} = contacts;
if (phone || pickup || hours) {
  const info = document.querySelector("#contact-info");
  info.replaceChildren();
  if (phone) {
    const link = element("a", phone);
    link.href = "tel:" + phone.replace(/[^+\d]/g, "");
    const row = document.createElement("p");
    row.append(link);
    info.append(row);
  }
  if (pickup) info.append(element("p", pickup));
  if (hours) info.append(element("p", hours));
}
