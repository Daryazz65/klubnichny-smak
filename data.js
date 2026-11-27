const cultivars = [
  {id:"moskovskiy-gigant", name:"Московский Гигант", frost:"Высокая", yield:"Очень высокая", size:"Особо крупные", taste:"Сладкий, ароматный", description:"В подборке хозяйства этот сорт выделяется особенно крупными ягодами. Их выраженный аромат дополняет сладкий вкус."},
  {id:"polana", name:"Полана", frost:"Высокая", yield:"Обильная", size:"Средние", taste:"Сладкий", description:"Ремонтантный сорт с округлыми красными ягодами. В испытаниях Университета Миннесоты Полана относится к ранним сортам среди тех, что плодоносят на побегах текущего года.", source:["Университет Миннесоты","https://extension.umn.edu/agriculture/specialty-crops/commercial-fruit-production/raspberry-farming/raspberry-types-and-varieties"], photo:{src:"./polana.webp", alt:"Спелая ягода сорта Полана на ветке", caption:"Полана · фото из исследования"}},
  {id:"amira", name:"Амира", frost:"Средняя", yield:"Высокая", size:"Крупные", taste:"Сладкий, насыщенный", description:"Итальянский ремонтантный сорт компании Berryplant. Ягоды созревают на верхней части молодых побегов. При сохранении побегов их нижние почки могут дать урожай на следующий год.", source:["Meiosis · описание BP 1","https://www.meiosis.co.uk/fruit_types/amira/"], reference:"Описание и фотографии сорта у Meiosis"},
  {id:"shani", name:"Шани", frost:"Средняя", yield:"Стабильная", size:"Крупные", taste:"Преимущественно сладкий", description:"Шани образует крупные конические ягоды светлого красно-малинового оттенка. Согласно описанию в патенте, куст прямостоячий, с хорошим ветвлением, а урожай формируется на побегах текущего года.", source:["Патент USPP31552P2","https://patents.google.com/patent/USPP31552P2/en"], photoSource:"https://www.noursefarms.com/blogs/advanced-berry-breeding/shani%E2%84%A2"},
  {id:"sapphire", name:"Сапфир", frost:"Высокая", yield:"Высокая", size:"Крупные", taste:"Гармоничный, сладкий", description:"Летняя малина с крупными плотными ягодами. Основной урожай созревает на побегах прошлого года. В канадском сортоиспытании плоды были длиннее и шире, чем у контрольного сорта Туламин.", source:["Канадское агентство по инспекции пищевых продуктов","https://active.inspection.gc.ca/english/plaveg/pbrpov/cropreport/ra/app00010202e.shtml?wbdisable=true"], reference:"На странице испытания есть фотографии сорта"},
  {id:"bryanskoe-divo", name:"Брянское Диво", frost:"Средняя", yield:"Высокая", size:"Крупные", taste:"Сладкий", description:"Крупноплодный ремонтантный сорт брянской селекции. Создавался для выращивания с урожаем на побегах, которые выросли за текущий сезон.", source:["ВНИИСПК · публикация селекционеров","https://vniispk.ru/pages/activities/science-activities/conference-2008/publ-2008-13"], photoSource:"https://official.satbayev.university/download/document/25838/2022_%D0%91%D0%90%D0%9A_%D0%91%D0%B0%D0%BB%D0%B0%D0%B1%D0%B0%D0%B5%D0%B2%D0%B0%20%D0%90%D0%B9%D0%B4%D0%B0%D0%BD%D0%B0.pdf#page=18"},
  {id:"poklon-kazakovu", name:"Поклон Казакову", frost:"Высокая", yield:"Обильная", size:"Крупные", taste:"Очень сладкий", description:"Ремонтантный сорт российской селекции. В сравнительном исследовании ягод он выделился высоким отношением сахаров к кислотам, которое влияет на восприятие сладости.", source:["Исследование состава ягод","https://xn----7sbab4cbipghgw0a.xn--p1ai/wp-content/uploads/2025/06/СБОРНИК_№2_2025.pdf"], photoSource:"https://vstisp.org/vstisp/index.php/2013-07-24-07-03-02/manufacture/11-icetheme/sample-news/1453-poklon-kazakovu"},
  {id:"fenomen", name:"Феномен", frost:"Средняя", yield:"Высокая", size:"Крупные", taste:"Сладкий с лёгкой фруктовой ноткой", description:"Сорт летнего плодоношения, распространённый в украинских посадках. В подборке хозяйства его отличают крупные ягоды со сладким вкусом и лёгкой фруктовой ноткой.", source:["Львовский национальный университет природопользования","https://visnyk.lnup.edu.ua/index.php/agronomy/article/download/472/444/549"], photoSource:"https://obr.nbgnsc.ru/wp-content/uploads/2021/10/%D0%94%D0%B8%D1%81%D1%81%D0%B5%D1%80%D1%82%D0%B0%D1%86%D0%B8%D1%8F-%D0%90%D1%80%D0%B8%D1%84%D0%BE%D0%B2%D0%BE%D0%B9-%D0%97.%D0%98..pdf#page=199"},
  {id:"gordost-rossii", name:"Гордость России", frost:"Высокая", yield:"Очень высокая", size:"Особо крупные", taste:"Десертный, сладкий", description:"Один из крупноплодных сортов селекции ВСТИСП. В исследовании садов Предбайкалья его отнесли к популярным сортам для любительского выращивания.", source:["Иркутский государственный аграрный университет","https://agronauka-irsau.ru/files/v25.pdf"]},
  {id:"oranzhevoe-chudo", name:"Оранжевое Чудо", frost:"Средняя", yield:"Стабильная", size:"Крупные", taste:"Сладкий, нежный", tone:"orange", description:"Ремонтантная малина с оранжевыми ягодами. В сравнении шести сортов на опытном участке Оранжевое чудо вошло в число наиболее крупноплодных.", source:["Сравнительное исследование шести сортов","https://xn----7sbab4cbipghgw0a.xn--p1ai/wp-content/uploads/2025/06/СБОРНИК_№2_2025.pdf"], photoSource:"https://vstisp.org/vstisp/index.php/11-icetheme/sample-news/1457-oranzhevoe-chudo"},
  {id:"zheltyy-gigant", name:"Жёлтый Гигант", frost:"Высокая", yield:"Высокая", size:"Крупные", taste:"Очень сладкий, медовый", tone:"gold", description:"Желтоплодный сорт из группы крупноплодной малины ВСТИСП. В описании хозяйства его отличает очень сладкий вкус с медовой ноткой.", source:["Иркутский государственный аграрный университет","https://agronauka-irsau.ru/files/v25.pdf"]},
];

const crops = [
  { id: "malina", name: "Малина", varieties: cultivars },
  {
    id: "ezhevika", name: "Ежевика",
    varieties: [
      { id:"lohtey", name:"Лохтей", frost:"Средняя", yield:"Очень высокая", size:"Крупные", taste:"Сладкий, насыщенный" },
      { id:"bzhezina", name:"Бжезина", frost:"Высокая", yield:"Обильная", size:"Крупные", taste:"Сладкий, десертный" },
      { id:"viktoriya", name:"Виктория", frost:"Средняя", yield:"Высокая", size:"Очень крупные", taste:"Преимущественно сладкий" },
      { id:"gigant", name:"Гигант", frost:"Высокая", yield:"Очень высокая", size:"Особо крупные", taste:"Очень сладкий" },
    ],
  },
  {
    id: "chernaya-smorodina", name: "Чёрная смородина",
    orders: "Принимаем заказы на осень на саженцы с открытым корнем.",
    varieties: [
      { id:"ben-houp", name:"Бен Хоуп", frost:"Очень высокая", yield:"Высокая", size:"Крупные", taste:"Насыщенный, классический смородиновый" },
      { id:"slastena", name:"Сластена", frost:"Высокая", yield:"Обильная", size:"Средние и крупные", taste:"Очень сладкий, десертный" },
      { id:"selechenskaya-2", name:"Селеченская 2", frost:"Очень высокая", yield:"Стабильная, высокая", size:"Крупные, одни из самых больших среди сортов смородины", taste:"Гармоничный, сладкий" },
      { id:"titaniya", name:"Титания", frost:"Высокая", yield:"Очень высокая, стабильная", size:"Средние, плотные", taste:"Сбалансированный, с характерным смородиновым ароматом" },
      { id:"ben-tiben", name:"Бен Тибен", frost:"Очень высокая", yield:"Высокая", size:"Средние и крупные, выровненные", taste:"Приятный, умеренно сладкий" },
      { id:"belorusskaya-sladkaya", name:"Белорусская Сладкая", frost:"Очень высокая", yield:"Стабильная", size:"Средние", taste:"Преимущественно сладкий, нежный. Подходит для употребления в свежем виде." },
    ],
  },
  {
    id: "irga", name: "Ирга",
    varieties: [
      { id:"nortlayn", name:"Нортлайн", frost:"Очень высокая", yield:"Высокая", size:"Крупные", taste:"Очень сладкий, без горечи" },
      { id:"smouki", name:"Смоуки", frost:"Очень высокая", yield:"Высокая", size:"Крупные", taste:"Классический, сладкий" },
      { id:"honeywood", name:"Хонейвуд", frost:"Очень высокая", yield:"Обильная", size:"Крупные", taste:"Медовый, насыщенный" },
      { id:"martin", name:"Мартин", frost:"Очень высокая", yield:"Высокая", size:"Средние", taste:"Сладкий" },
      { id:"lamarka", name:"Ламарка", frost:"Очень высокая", yield:"Стабильная", size:"Крупные", taste:"Десертный" },
      { id:"krasnoyarskaya", name:"Красноярская", frost:"Очень высокая, адаптирована к суровым зимам", yield:"Высокая", size:"Крупные", taste:"Насыщенный, сбалансированный" },
      { id:"zvezdnaya-noch", name:"Звёздная Ночь", frost:"Очень высокая", yield:"Обильная", size:"Крупные", taste:"Глубокий, десертный, с тонкими фруктовыми нотками" },
      { id:"druzhnaya", name:"Дружная", frost:"Очень высокая", yield:"Высокая", size:"Средние", taste:"Сладкий, с лёгкой терпкостью" },
      { id:"zvezdnaya", name:"Звёздная", frost:"Очень высокая", yield:"Стабильная", size:"Крупные", taste:"Десертный, сладко-кислый" },
      { id:"mandan", name:"Мандан", frost:"Исключительная", yield:"Хорошая", size:"Крупные", taste:"Сладкий, насыщенный" },
      { id:"slastyona", name:"Сластёна", frost:"Высокая", yield:"Обильная", size:"Крупные", taste:"Преимущественно сладкий" },
      { id:"sleyt", name:"Слейт", frost:"Очень высокая", yield:"Стабильная", size:"Средние", taste:"Сбалансированный, сладко-кислый" },
      { id:"stardzhion", name:"Старджион", frost:"Очень высокая", yield:"Высокая", size:"Крупные", taste:"Сладкий, с лёгкой кислинкой" },
      { id:"syurpriz", name:"Сюрприз", frost:"Очень высокая", yield:"Стабильная", size:"Средние", taste:"Десертный, сбалансированный" },
      { id:"tissen", name:"Тиссен", frost:"Исключительная", yield:"Обильная", size:"Крупные", taste:"Насыщенный, медово-сладкий" },
    ],
  },
  {
    id: "aroniya", name: "Арония", subtitle: "Черноплодная рябина",
    varieties: [
      { id:"viking", name:"Викинг", frost:"Высокая", yield:"Высокая", size:"Крупные" },
      { id:"zhemchuzhina", name:"Жемчужина", frost:"Очень высокая", yield:"Стабильная", size:"Средние" },
      { id:"nero", name:"Неро", frost:"Очень высокая", yield:"Высокая", size:"Крупные" },
    ],
  },
  {
    id: "oblepiha", name: "Облепиха",
    varieties: [
      { id:"adam", name:"Адам (муж.)", frost:"Высокая", role:"Мужское растение-опылитель" },
      { id:"azhurnaya", name:"Ажурная", frost:"Высокая", yield:"Высокая", size:"Крупные", ripening:"Поздний" },
      { id:"aley", name:"Алей (муж.)", frost:"Высокая", role:"Мужское растение-опылитель" },
      { id:"altayskaya", name:"Алтайская", frost:"Очень высокая", yield:"Высокая", size:"Средние", ripening:"Средний" },
      { id:"velikan", name:"Великан", frost:"Высокая", yield:"Высокая", size:"Крупные", ripening:"Поздний" },
      { id:"galerit", name:"Галерит", frost:"Высокая", yield:"Хорошая", size:"Средние", ripening:"Средний" },
      { id:"dzhemovaya", name:"Джемовая", frost:"Высокая", yield:"Высокая", size:"Крупные", ripening:"Средний" },
      { id:"dyuymovochka", name:"Дюймовочка", frost:"Высокая", yield:"Умеренная", size:"Мелкие", ripening:"Ранний" },
      { id:"zhemchuzhnitsa", name:"Жемчужница", frost:"Высокая", yield:"Высокая", size:"Крупные", ripening:"Средний" },
      { id:"kapriz", name:"Каприз", frost:"Высокая", yield:"Хорошая", size:"Средние", ripening:"Поздний" },
      { id:"lisichka", name:"Лисичка", frost:"Высокая", yield:"Стабильная", size:"Средние", ripening:"Средний" },
      { id:"lyubimaya", name:"Любимая", frost:"Высокая", yield:"Высокая", size:"Крупные", ripening:"Средний" },
      { id:"chuyskaya", name:"Чуйская", frost:"Очень высокая", yield:"Высокая", size:"Средние", ripening:"Ранний" },
      { id:"essel", name:"Эссель", frost:"Высокая", yield:"Высокая", size:"Крупные", ripening:"Средний" },
      { id:"ayula", name:"Аюла", frost:"Очень высокая", yield:"Стабильная", size:"Средние", ripening:"Ранний" },
      { id:"gnom", name:"Гном (муж.)", frost:"Высокая", role:"Мужское растение-опылитель" },
      { id:"avgustina", name:"Августина", frost:"Очень высокая", yield:"Высокая", size:"Крупные", ripening:"Средний" },
      { id:"chechek", name:"Чечек", frost:"Высокая, до −30 °C", yield:"Стабильная", size:"Средние", ripening:"Поздний" },
      { id:"elizaveta", name:"Елизавета", frost:"Очень высокая", yield:"Очень высокая", size:"Крупные", ripening:"Средний" },
    ],
  },
  {
    id: "zhimolost", name: "Жимолость",
    varieties: [
      { id:"avrora", name:"Аврора", frost:"Высокая", yield:"Высокая", size:"Крупные", ripening:"Поздний" },
      { id:"blyu-trizhe", name:"Блю Триже", frost:"Высокая", yield:"Высокая", size:"Крупные", ripening:"Средний" },
      { id:"boreal-best", name:"Бореал Бест", frost:"Очень высокая", yield:"Высокая", size:"Крупные", ripening:"Поздний" },
      { id:"boreal-blizzard", name:"Бореал Близзард", frost:"Очень высокая", yield:"Стабильная", size:"Крупные", ripening:"Средний" },
      { id:"boreal-beauty", name:"Бореал Бьюти", frost:"Очень высокая", yield:"Высокая", size:"Крупные", ripening:"Ранний" },
      { id:"goluboy-banan", name:"Голубой Банан", frost:"Высокая", yield:"Высокая", size:"Крупные", ripening:"Поздний" },
      { id:"indigo-dzhem", name:"Индиго Джем", frost:"Высокая", yield:"Высокая", size:"Крупные", ripening:"Средний" },
      { id:"honei-blyu", name:"Хоней Блю", frost:"Высокая", yield:"Высокая", size:"Крупные", ripening:"Поздний" },
      { id:"sindishen", name:"Синдишен", frost:"Высокая", yield:"Хорошая", size:"Крупные", ripening:"Средний" },
      { id:"berri-blyu", name:"Берри Блю", frost:"Очень высокая", yield:"Высокая", size:"Крупные", ripening:"Средний" },
      { id:"blyu-velvet", name:"Блю Вельвет", frost:"Высокая", yield:"Стабильная", size:"Крупные", ripening:"Поздний" },
      { id:"voytek", name:"Войтек", frost:"Очень высокая", yield:"Обильная", size:"Крупные", ripening:"Ранний" },
      { id:"klubnichnaya-sensatsiya", name:"Клубничная Сенсация", frost:"Высокая", yield:"Высокая", size:"Крупные", ripening:"Средний" },
      { id:"maniya-vkusa", name:"Мания Вкуса", frost:"Очень высокая", yield:"Стабильная", size:"Крупные", ripening:"Поздний" },
      { id:"iolanta", name:"Иоланта", frost:"Очень высокая", yield:"Высокая", size:"Крупные", ripening:"Ранний" },
    ],
  },
  {
    id: "kryzhovnik", name: "Крыжовник", sizeLabel: "Размер плода",
    varieties: [
      { id:"uralskiy-izumrud", name:"Уральский Изумруд", frost:"Очень высокая, до −30 °C", yield:"Высокая", size:"Крупные", taste:"Сладкий, с небольшой кислинкой" },
    ],
  },
  {
    id: "boyaryshnik", name: "Боярышник", sizeLabel: "Размер плода",
    varieties: [
      { id:"arnold", name:"Арнольд", frost:"Очень высокая", yield:"Высокая", size:"Крупные, до 2 см в диаметре", taste:"Сладковато-терпкий, с лёгкой кислинкой" },
      { id:"krupnoplodnaya", name:"Крупноплодная", frost:"Высокая", yield:"Стабильная", size:"Крупные", taste:"Сладкий, с лёгкой терпкостью" },
    ],
  },
  {
    id: "krasnaya-smorodina", name: "Красная смородина",
    varieties: [
      { id:"red-pul", name:"Ред Пул", frost:"Очень высокая, до −34 °C", yield:"Высокая", size:"Средние, 0,7–1,0 г", taste:"Кисло-сладкий, сбалансированный" },
      { id:"rovada", name:"Ровада", frost:"Высокая, до −30 °C", yield:"Очень высокая", size:"Крупные, до 1,5 г, диаметр 8–10 мм", taste:"Насыщенно-кислый, с выраженными десертными нотами" },
      { id:"viksne", name:"Виксне", frost:"Исключительная, до −40 °C", yield:"Стабильная", size:"Средние и крупные, 0,8–1,2 г", taste:"Сладковато-кислый, гармоничный, с лёгкой терпкостью" },
      { id:"natali", name:"Натали", frost:"Очень высокая, до −35 °C", yield:"Высокая", size:"Крупные, около 1 г", taste:"Преимущественно сладкий, с умеренной кислинкой, десертный" },
      { id:"dana", name:"Дана", frost:"Высокая, до −28 °C", yield:"Стабильная, регулярная", size:"Средние и крупные, 1,0–1,3 г", taste:"Кисло-сладкий, освежающий, сбалансированный" },
    ],
  },
  {
    id: "yablonya", name: "Яблоня", group: "tree-list", sizeLabel: "Размер плода",
    varieties: [
      { id:"belfer-kitayka", name:"Бельфер Китайка", frost:"Очень высокая", yield:"Высокая", size:"Средние", taste:"Сладкий, с лёгкой терпкостью" },
      { id:"zolotoy-ranet", name:"Золотой Ранет", frost:"Очень высокая", yield:"Стабильная", size:"Крупные", taste:"Десертный, сладко-кислый" },
      { id:"belyy-naliv", name:"Белый Налив", frost:"Исключительная", yield:"Хорошая", size:"Крупные", taste:"Сладкий, насыщенный" },
    ],
  },
  {
    id: "vishnya", name: "Вишня", group: "tree-list",
    varieties: [
      { id:"shokoladnitsa", name:"Шоколадница", frost:"Высокая", yield:"До 12 кг с дерева", size:"Около 3,5 г", taste:"Кисло-сладкий" },
      { id:"shpanka-bryanskaya", name:"Шпанка Брянская", frost:"Умеренная", yield:"До 30–40 кг с дерева", size:"Около 4 г", taste:"Кисло-сладкий" },
    ],
  },
  {
    id: "grusha", name: "Груша", group: "tree-list", sizeLabel: "Размер плода",
    varieties: [
      { id:"yakovlevskaya", name:"Яковлевская", frost:"Высокая", yield:"Высокая", size:"Крупные, около 130–150 г", taste:"Сладковато-кислый, с приятным ароматом" },
      { id:"rozi-red-bartlet", name:"Рози Ред Бартлет", frost:"Повышенная", yield:"Высокая", size:"Крупные, около 200–250 г", taste:"Приятный сладковатый, с лёгким оттенком кислоты, мускатным привкусом и ароматом" },
      { id:"red-bartlet", name:"Ред Бартлет", frost:"Хорошая", yield:"Высокая, регулярное ежегодное плодоношение", size:"Крупные, около 180–220 г, правильной грушевидной формы", taste:"Сочный, с мускатно-медовым послевкусием и насыщенным ароматом, мякоть бело-кремовая" },
    ],
  },
  {
    id: "dyuk", name: "Дюк", group: "tree-list", subtitle: "Вишня × черешня",
    varieties: [
      { id:"belochka", name:"Белочка", frost:"Очень высокая", yield:"Высокая", size:"Средние", taste:"Сладкий, с лёгкой терпкостью" },
      { id:"dobrynya", name:"Добрыня", frost:"Очень высокая", yield:"Стабильная", size:"Крупные", taste:"Десертный, сладко-кислый" },
      { id:"kormilitsa", name:"Кормилица", frost:"Исключительная", yield:"Хорошая", size:"Крупные", taste:"Сладкий, насыщенный" },
      { id:"krasa-severa", name:"Краса Севера", frost:"Очень высокая", yield:"Высокая", size:"Крупные", taste:"Очень сладкий, без горечи" },
      { id:"nochka", name:"Ночка", frost:"Очень высокая", yield:"Высокая", size:"Средние", taste:"Сладкий, с лёгкой терпкостью" },
      { id:"nadezhda", name:"Надежда", frost:"Очень высокая", yield:"Стабильная", size:"Крупные", taste:"Десертный, сладко-кислый" },
      { id:"slavyanka", name:"Славянка", frost:"Исключительная", yield:"Хорошая", size:"Крупные", taste:"Сладкий, насыщенный" },
    ],
  },
  {
    id: "chereshnya", name: "Черешня", group: "tree-list",
    varieties: [
      { id:"iput", name:"Ипуть", frost:"Очень высокая", yield:"Высокая", size:"Крупные", taste:"Сладкий, насыщенный" },
      { id:"revna", name:"Ревна", frost:"Очень высокая", yield:"Стабильная", size:"Крупные", taste:"Десертный, сладко-кислый" },
    ],
  },
  {
    id: "alycha", name: "Алыча", group: "tree-list", sizeLabel: "Размер плода",
    varieties: [{ id:"blek-gold", name:"Блэк Голд", frost:"Очень высокая", yield:"Высокая", size:"Крупные", taste:"Сладкий, насыщенный" }],
  },
  {
    id: "abrikos", name: "Абрикос", group: "tree-list", sizeLabel: "Размер плода",
    varieties: [
      { id:"lel", name:"Лель", frost:"Очень высокая", yield:"Высокая", size:"Средние", taste:"Сладкий, с лёгкой терпкостью" },
      { id:"severnyy-triumf", name:"Северный Триумф", frost:"Очень высокая", yield:"Стабильная", size:"Крупные", taste:"Десертный, сладко-кислый" },
    ],
  },
  {
    id: "sharafuga", name: "Шарафуга", group: "tree-list", sizeLabel: "Размер плода",
    varieties: [
      { id:"bella-gold", name:"Белла Голд", frost:"Высокая", yield:"Высокая", size:"Крупные", taste:"Сладкий, с лёгкой кислинкой" },
      { id:"velvet-sanrayz", name:"Вельвет Санрайз", frost:"Хорошая, до −25 °C", yield:"Стабильная", size:"Крупные", taste:"Десертный, сладко-кислый" },
      { id:"bella-royal", name:"Белла Рояль", frost:"Высокая, до −28 °C", yield:"Очень высокая", size:"Крупные", taste:"Насыщенно-сладкий, с лёгким миндальным оттенком" },
    ],
  },
  {
    id: "sliva", name: "Слива", group: "tree-list", sizeLabel: "Размер плода",
    varieties: [
      { id:"to-che-san", name:"То Че Сан", frost:"Высокая, до −25 °C", yield:"Высокая", size:"Крупные", taste:"Сладкий, с лёгкой кислинкой и медовым оттенком" },
      { id:"uralskiy-chernosliv", name:"Уральский Чернослив", frost:"Очень высокая, до −35 °C", yield:"Стабильная", size:"Средние", taste:"Сладкий, насыщенный, с лёгкой терпкостью" },
      { id:"blek-amber", name:"Блэк Амбер", frost:"Хорошая, до −20 °C", yield:"Очень высокая", size:"Крупные", taste:"Десертный, сладко-кислый, с пряными нотками" },
      { id:"vashington-zheltaya", name:"Вашингтон Жёлтая", frost:"Высокая, до −28 °C", yield:"Хорошая", size:"Крупные", taste:"Очень сладкий, с лёгкой освежающей кислинкой" },
      { id:"top-gigant", name:"Топ Гигант", frost:"Высокая, до −27 °C", yield:"Высокая", size:"Очень крупные, до 60–70 г", taste:"Насыщенно-сладкий, сбалансированный" },
    ],
  },
  {
    id: "ryabina", name: "Рябина", group: "tree-list", sizeLabel: "Размер плода",
    varieties: [{ id:"granatnaya", name:"Гранатная", frost:"Высокая, до −30 °C", yield:"Высокая", size:"Крупные, до 1,5 г", taste:"Кисло-сладкий, без горечи" }],
  },
  {
    id: "klubnika", name: "Клубника", group: "berry-list",
    orders: "Сорта клубники в каталоге.",
    varieties: [
      { id:"burbon", name:"Бурбон" },
      { id:"albion", name:"Альбион" },
      { id:"murano", name:"Мурано" },
      { id:"kabrillo", name:"Кабрилло" },
      { id:"krapo-10", name:"Крапо-10" },
      { id:"aziya", name:"Азия" },
      { id:"koroleva-elizaveta-2", name:"Королева Елизавета-2" },
    ],
  },
];

const contacts = { phone:"", pickup:"", hours:"" };
