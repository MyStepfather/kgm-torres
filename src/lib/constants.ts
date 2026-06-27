export const PRIZES = [
  {
    place: 1,
    title: "Газонокосилка бензиновая",
    model: "Champion LMZ5130/1",
    imageKey: "prize1" as const,
    specs: [
      "Самоходная, бензиновая",
      "Двигатель Champion 196 см³",
      "Ширина захвата 51 см",
    ],
  },
  {
    place: 2,
    title: "Мойка высокого давления",
    model: "Champion HP3200",
    imageKey: "prize2" as const,
    specs: [
      "Бензиновый, 43 куб. см",
      "Мощность 1.3 кВт",
      "Ширина обработки 20–30 см",
    ],
  },
  {
    place: 3,
    title: "Бензопила",
    model: "Champion 232-14",
    imageKey: "prize3" as const,
    specs: [
      "Бензиновый, 43 куб. см",
      "Прямой вал, леска + нож",
      "Мощность 1.25 кВт",
    ],
  },
] as const;

export const TORRES_SPECS = [
  {
    label: "л.с. · Мощность",
    value: "163",
    icon: "power" as const,
  },
  {
    label: "Нм · Крутящий момент",
    value: "280",
    icon: "torque" as const,
  },
  {
    label: "AISIN · Трансмиссия",
    value: "6AT",
    icon: "transmission" as const,
  },
  {
    label: "Полный привод",
    value: "4WD",
    icon: "drive" as const,
  },
] as const;

export const STEPS = [
  {
    step: 1,
    title: "Запишитесь и заполните форму",
    description:
      "Оставьте свои контакты и выберите удобного дилера. Занимает меньше минуты.",
    variant: "default" as const,
  },
  {
    step: 2,
    title: "Получите свой QR-код",
    description:
      "После регистрации вы сразу получите уникальный QR-код участника. Сохраните его на телефоне.",
    variant: "default" as const,
  },
  {
    step: 3,
    title: "Покажите QR-код дилеру",
    description:
      "В салоне предъявите QR-код и пройдите тест-драйв Torres. Ваше участие подтверждено!",
    variant: "wide" as const,
  },
  {
    step: 4,
    title: "Как принять участие?",
    description:
      "Всего три простых шага: зарегистрируйтесь, получите QR-код, покажите его дилеру и пройдите тест-драйв KGM Torres, чтобы стать участником розыгрыша.",
    variant: "featured" as const,
  },
] as const;
