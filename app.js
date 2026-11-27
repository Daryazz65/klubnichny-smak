const varieties = document.querySelector("#varieties");
const search = document.querySelector("#variety-search");
const empty = document.querySelector("#empty");
const section = document.querySelector(".crop-section");
const title = document.querySelector("#crop-title");
const subtitle = document.querySelector("#crop-subtitle");
const orders = document.querySelector("#crop-orders");
const cropGroup = document.querySelector("#crop-group");
const traits = {
  frost: "Морозостойкость",
  yield: "Урожайность",
  size: "Размер ягоды",
  taste: "Вкус",
  ripening: "Срок созревания",
  role: "Назначение",
};
let activeCrop;
let cards = [];

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

const plural = new Intl.PluralRules("ru");
const countLabels = { one: "сорт", few: "сорта", many: "сортов", other: "сортов" };
const cropLinks = crops.map((crop) => {
  const link = element("a", "", "crop-link");
  const count = crop.varieties.length;
  link.href = "#" + crop.id;
  link.append(element("strong", crop.name), element("span", count + " " + countLabels[plural.select(count)]));
  link.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== link.hash) history.pushState(null, "", link.hash);
    openHash();
    title.focus({preventScroll: true});
  });
  const row = document.createElement("li");
  row.append(link);
  const list = document.getElementById(crop.group || "shrub-list");
  list.insertBefore(row, list.querySelector(".pending"));
  return link;
});

function buildCard(crop, variety) {
  const card = element("details", "", "variety");
  card.id = crop.id + "/" + variety.id;
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
  specs.append(...Object.entries(traits).filter(([key]) => variety[key]).map(([key, label]) => {
    const spec = element("div", "", "spec");
    const traitName = key === "size" && crop.sizeLabel ? crop.sizeLabel : label;
    spec.append(element("dt", traitName), element("dd", variety[key]));
    return spec;
  }));
  if (variety.description) content.append(element("p", variety.description));
  if (specs.childElementCount) content.append(specs);
  else if (!variety.description) content.append(element("p", "Характеристики сорта готовятся."));
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
  return card;
}

function normalize(value) {
  return value.trim().toLocaleLowerCase("ru").replaceAll("ё", "е");
}

function filterVarieties() {
  const query = normalize(search.value);
  cards.forEach((card, index) => {
    card.hidden = !normalize(activeCrop.varieties[index].name).includes(query);
  });
  empty.hidden = cards.some((card) => !card.hidden);
}

function openHash() {
  const [cropId, varietyId] = location.hash.slice(1).split("/");
  const linkedCrop = crops.find(({id}) => id === cropId);
  const crop = linkedCrop || activeCrop || crops[0];
  if (crop !== activeCrop) {
    activeCrop = crop;
    section.id = crop.id;
    title.textContent = crop.name;
    const currentList = document.getElementById(crop.group || "shrub-list");
    cropGroup.textContent = currentList.previousElementSibling.textContent;
    subtitle.textContent = crop.subtitle || "";
    subtitle.hidden = !crop.subtitle;
    orders.textContent = crop.orders || "Принимаем заказы на саженцы.";
    search.value = "";
    cards = crop.varieties.map((variety) => buildCard(crop, variety));
    varieties.replaceChildren(...cards);
    cropLinks.forEach((link) => {
      if (link.hash === "#" + crop.id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    filterVarieties();
  }
  if (!linkedCrop) return;
  const card = cards.find(({id}) => id === cropId + "/" + varietyId);
  if (card) {
    search.value = "";
    filterVarieties();
    card.open = true;
  }
  (card || section).scrollIntoView({block: "start", behavior: "instant"});
}

search.addEventListener("input", filterVarieties);
window.addEventListener("hashchange", openHash);
openHash();

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
