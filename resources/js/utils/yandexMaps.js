const SCRIPT_ID = "yandex-maps-script";
const API_VERSION = "2.1";

let mapsPromise = null;

/** Ключ «JavaScript API и HTTP Геокодер»: карта, поиск и ymaps.geocode(). */
export const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY ?? "";

export const isYandexMapsConfigured = () => Boolean(YANDEX_MAPS_API_KEY);

/**
 * Грузит JS API Яндекс.Карт один раз на всё приложение и резолвится готовым
 * объектом ymaps. Паттерн тот же, что в ShareButtons: дедупликация по id
 * скрипта плюс общий промис, чтобы параллельные вызовы не плодили <script>.
 */
export const loadYandexMaps = (lang = "ru_RU") => {
    if (!YANDEX_MAPS_API_KEY) {
        return Promise.reject(new Error("VITE_YANDEX_MAPS_API_KEY is not set"));
    }

    if (window.ymaps?.Map) {
        return Promise.resolve(window.ymaps);
    }

    if (mapsPromise) {
        return mapsPromise;
    }

    document.getElementById(SCRIPT_ID)?.remove();

    mapsPromise = new Promise((resolve, reject) => {
        const params = new URLSearchParams({ apikey: YANDEX_MAPS_API_KEY, lang });

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = `https://api-maps.yandex.ru/${API_VERSION}/?${params.toString()}`;
        script.async = true;
        script.onload = () => {
            if (!window.ymaps) {
                mapsPromise = null;
                script.remove();
                reject(new Error("Yandex Maps API is unavailable after script load"));
                return;
            }

            // ymaps.ready дожидается инициализации модулей (geocode, suggest).
            window.ymaps.ready(() => resolve(window.ymaps));
        };
        script.onerror = (error) => {
            mapsPromise = null;
            script.remove();
            reject(error);
        };
        document.body.appendChild(script);
    });

    return mapsPromise;
};

/** i18next отдаёт kk/kz/ru/en — приводим к локали, понятной Яндексу. */
export const toYandexLang = (language) => (language === "en" ? "en_RU" : "ru_RU");

export const hasCoordinates = (location) =>
    location != null &&
    location.latitude !== null &&
    location.latitude !== undefined &&
    location.latitude !== "" &&
    location.longitude !== null &&
    location.longitude !== undefined &&
    location.longitude !== "" &&
    !Number.isNaN(Number(location.latitude)) &&
    !Number.isNaN(Number(location.longitude));

export const toCoords = (location) => [Number(location.latitude), Number(location.longitude)];

/** Центр карты по умолчанию, когда у вакансии ещё нет точки. */
export const CITY_CENTERS = {
    Астана: [51.1282, 71.4307],
    Алматы: [43.2389, 76.8897],
    Шымкент: [42.3417, 69.5901],
    Актау: [43.6410, 51.1980],
    Актобе: [50.2839, 57.1670],
    Атырау: [47.0945, 51.9238],
    Жезказган: [47.7833, 67.7],
    Караганда: [49.8047, 73.1094],
    Косшы: [51.0333, 71.5333],
    Костанай: [53.2198, 63.6354],
    Рудный: [52.9667, 63.1167],
    Щучинск: [52.9333, 70.2000],
    Кызылорда: [44.8479, 65.5093],
    Павлодар: [52.2873, 76.9674],
    Петропавловск: [54.8667, 69.15],
    Семей: [50.4111, 80.2275],
    Талдыкорган: [45.0156, 78.3739],
    Тараз: [42.9, 71.3667],
    Темиртау: [50.0547, 72.9646],
    Туркестан: [43.3, 68.25],
    Уральск: [51.2333, 51.3667],
    "Усть-Каменогорск": [49.9481, 82.6279],
    Экибастуз: [51.7298, 75.3266],
};

export const DEFAULT_CENTER = CITY_CENTERS["Астана"];

export const centerForCity = (city) => CITY_CENTERS[city] ?? DEFAULT_CENTER;

/** Знаем ли реальные координаты города (а не запасную Астану). */
export const hasCityCenter = (city) => Object.prototype.hasOwnProperty.call(CITY_CENTERS, city ?? '');

/**
 * Рамка вокруг города — ею ограничиваем и геокодер, и подсказки, чтобы
 * «Абая 1» не уводило в другой регион. Формат ymaps: [[lat, lng], [lat, lng]].
 */
export const boundsForCity = (city) => {
    const [lat, lng] = centerForCity(city);
    const latSpan = 0.45;
    const lngSpan = 0.7;

    return [
        [lat - latSpan, lng - lngSpan],
        [lat + latSpan, lng + lngSpan],
    ];
};


/**
 * Работодатели часто пишут в адрес не точку, а охват: «более 30 филиалов»,
 * «адреса уточняются», «по всему городу». Ставить метку для такого нельзя —
 * карту в этом случае не показываем ни в форме, ни в вакансии.
 *
 * Множественное число намеренно: «филиал №2 на Абая» — обычный адрес,
 * а «30 филиалов» — уже охват.
 */
// Граница слова: \b в JS опирается на [A-Za-z0-9_], поэтому после кириллицы
// не срабатывает вовсе. Используем lookahead «дальше не буква».
const END = '(?![а-яёa-z])';

const VAGUE_ADDRESS_PATTERNS = [
    // «20 офисов», «15 магазинов», «2 филиала» — счёт объектов, а не адрес.
    // Требуем окончание множественного числа: иначе «Абая 150 офис 3» и
    // «филиал №2, ул. Абая 1» ложно считались бы охватом, а ложное
    // срабатывание стирает уже выбранные координаты.
    new RegExp(
        `\\d+\\s*(филиал(ов|а)|отделени(й|я)|точ(ек|ки)|магазин(ов|а)|объект(ов|а)|адрес(ов|а)|офис(ов|а)|локаци(й|и))${END}`,
        'i'
    ),
    // «более 30 филиалов», но не «около 100 метров от метро»: после числа
    // обязателен объект, иначе ловим расстояния и ориентиры.
    /(более|свыше|около|порядка)\s+\d+\s*(филиал|офис|магазин|точ|объект|адрес|отделен|локац)/i,
    // «офисы по городу». Только множественное число и только «по/во»:
    // предлог «на» даёт «офис на 3 этаже», «точка на пересечении».
    new RegExp(
        `(филиал(ы|ов)|офис(ы|ов)|магазин(ы|ов)|точк(и|ек)|отделени(я|й))\\s+(по|во)\\s`,
        'i'
    ),
    new RegExp(`филиал(ов|ы)${END}`, 'i'),
    new RegExp(`отделени(й|я)${END}`, 'i'),
    /(несколько|разны[ех]|различны[ех])\s+(адрес|филиал|точ|объект|локац|офис|магазин)/i,
    /адрес(а|ов)?\s+(уточня|по\s+запрос|при\s+собеседован)/i,
    /(по\s+всему\s+город|по\s+город(у|ам)|весь\s+город|вся\s+город)/i,
    /(по\s+всей\s+|по\s+всему\s+)(республик|стран|области|казахстан)/i,
    /(бөлімшелер|мекенжайлар|қала\s+бойынша|нүктелер)/i,
];

export const isVagueAddress = (text) => {
    const value = (text ?? "").trim();

    if (!value) {
        return false;
    }

    return VAGUE_ADDRESS_PATTERNS.some((pattern) => pattern.test(value));
};

/**
 * «Дистанционное» — не город, а признак удалёнки: в БД у вакансии лежит
 * именно это значение (казахское «Қашықтықтан» — только подпись в UI).
 * Точки на карте у такой работы быть не может.
 */
export const REMOTE_CITY = "Дистанционное";

export const isRemoteCity = (city) => (city ?? "").trim() === REMOTE_CITY;

/**
 * Границы Казахстана — запасная рамка, когда координаты города неизвестны
 * («Другое», город не из списка, пустое поле). Без неё геокодер искал бы по
 * всему миру и «Абая 1» могло уехать в соседнюю страну.
 */
export const KAZAKHSTAN_BBOX = '46.490000,40.570000~87.320000,55.450000';

/**
 * Та же рамка в формате HTTP-геокодера Яндекса: «lon1,lat1~lon2,lat2».
 * Бэкенд шлёт её вместе с rspn=1, то есть жёстко отсекает всё за пределами.
 */
export const bboxForCity = (city) => {
    if (!hasCityCenter(city)) {
        return KAZAKHSTAN_BBOX;
    }

    const [[lat1, lng1], [lat2, lng2]] = boundsForCity(city);

    return `${lng1.toFixed(6)},${lat1.toFixed(6)}~${lng2.toFixed(6)},${lat2.toFixed(6)}`;
};

/**
 * Убирает из адреса ведущие «Казахстан» и название города: на странице
 * вакансии город выводится отдельным полем, иначе выходит «Алматы,
 * Казахстан, Алматы, улица…».
 *
 * Режем только префикс — улица с названием города («улица Алматы»)
 * останется на месте.
 */
export const stripCityPrefix = (address, city) => {
    const parts = (address ?? '').split(',').map((part) => part.trim()).filter(Boolean);
    const drop = new Set(['казахстан', (city ?? '').trim().toLowerCase()].filter(Boolean));

    while (parts.length > 1 && drop.has(parts[0].toLowerCase())) {
        parts.shift();
    }

    return parts.join(', ');
};

/** Адрес годится для карты: есть координаты и это не «охватная» формулировка. */
export const isMappable = (location) =>
    hasCoordinates(location) && !isVagueAddress(location?.adress);
