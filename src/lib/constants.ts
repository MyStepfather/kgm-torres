export const GIVEAWAY_DATE = "30 сентября 2026";

export const PRIZES = [
  {
    place: 1,
    title: "Газонокосилка бензиновая",
    model: "Champion LMZ5130/1",
    specs: ["163 см³", "Самоходная", "Травосборник 60 л"],
  },
  {
    place: 2,
    title: "Мойка высокого давления",
    model: "Champion HP3200",
    specs: ["3200 Вт", "180 бар", "Насадки в комплекте"],
  },
  {
    place: 3,
    title: "Бензопила",
    model: "Champion 232-14",
    specs: ["40 см³", "Шина 40 см", "Лёгкий запуск"],
  },
] as const;

export const TORRES_SPECS = [
  { label: "Мощность", value: "163", unit: "л.с." },
  { label: "Крутящий момент", value: "280", unit: "Нм" },
  { label: "Коробка", value: "6AT", unit: "AISIN" },
  { label: "Привод", value: "Полный", unit: "4WD" },
] as const;

export const STEPS = [
  {
    step: 1,
    title: "Запишитесь на тест-драйв",
    description: "Заполните форму регистрации и выберите дилерский центр",
  },
  {
    step: 2,
    title: "Получите QR-код",
    description: "После отправки формы вы получите уникальный QR-код участника",
  },
  {
    step: 3,
    title: "Пройдите тест-драйв",
    description:
      "Покажите QR-код дилеру — он отсканирует его камерой телефона и подтвердит визит",
  },
] as const;
