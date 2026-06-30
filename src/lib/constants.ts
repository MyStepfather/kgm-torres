export const PRIZES = [
  {
    place: 1,
    title: "Газонокосилка бензиновая",
    model: "Champion LMZ5130/1",
    imageKey: "prize1" as const,
    specs: [
      "Самоходная, бензиновая",
      "Мощность двигателя — 3/4,1 (кВт/л.с.)",
      "Ширина скашивания — 508 (мм)",
    ],
  },
  {
    place: 2,
    title: "Мойка высокого давления",
    model: "Champion HP3200",
    imageKey: "prize2" as const,
    specs: [
      "Вес — 15,3 (кг)",
      "Длина шланга — 8 (м)",
      "Мощность двигателя — 2,0(кВт)",
    ],
  },
  {
    place: 3,
    title: "Бензопила",
    model: "Champion 232-14",
    imageKey: "prize3" as const,
    specs: [
      "Бензиновый — 0,25 (л)",
      "Мощность двигателя — 1,5/2 (кВт/л.с.)",
      "Объем двигателя — 31,8 (см3)",
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
    label: "Полный / Передний привод",
    value: "4WD/FWD",
    icon: "drive" as const,
  },
] as const;

export const STEPS = [
  {
    step: 1,
    title: "Заполните форму",
    description:
      "Оставьте свои контакты и выберите удобного\nдилера. Занимает меньше минуты.",
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
      "В дилерском центре KGM предъявите QR-код и пройдите тест-драйв Torres. Ваше участие подтверждено!",
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
