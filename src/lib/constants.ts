export const PRIZES = [
  {
    place: 1,
    title: "Бензиновая газонокосилка",
    model: "Champion LMZ5130/1",
    imageKey: "prize1" as const,
    specs: [
      "4-х тактный двигатель, мощность 4,1 л.с.",
      "Самоходная, 4 режима работы",
      "Ширина скашивания - 508 мм, 6 ступеней высоты скашивания",
    ],
  },
  {
    place: 2,
    title: "Мойка высокого давления",
    model: "Champion HP3200",
    imageKey: "prize2" as const,
    specs: [
      "Максимальное давление - 140 Бар + пеногенератор",
      "Мощный асинхронный двигатель - 2 кВт",
      "8-м шланг с катушкой, обеспечивающий свободу движений",
    ],
  },
  {
    place: 3,
    title: "Бензиновая пила",
    model: "Champion 232-14",
    imageKey: "prize3" as const,
    specs: [
      "Мощность двигателя 1,5 кВт, подойдет для распила бревен в 20 см",
      "Вес (без шины с пустыми баками) - 3,9 кг",
      "На 50% легче в использовании",
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
