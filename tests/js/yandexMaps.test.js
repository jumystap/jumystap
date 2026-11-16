import { describe, expect, it } from 'vitest';
import {
    KAZAKHSTAN_BBOX,
    bboxForCity,
    boundsForCity,
    centerForCity,
    hasCityCenter,
    hasCoordinates,
    isMappable,
    isRemoteCity,
    isVagueAddress,
    stripCityPrefix,
    toCoords,
} from '@/utils/yandexMaps';

// Города, которые реально предлагает форма вакансии.
const CITIES_IN_FORM = [
    'Астана', 'Алматы', 'Шымкент', 'Актау', 'Атырау', 'Жезказган', 'Караганда',
    'Косшы', 'Костанай', 'Кызылорда', 'Павлодар', 'Петропавловск', 'Рудный',
    'Семей', 'Талдыкорган', 'Тараз', 'Темиртау', 'Туркестан', 'Уральск',
    'Усть-Каменогорск', 'Щучинск', 'Экибастуз',
];

describe('охватные адреса', () => {
    it.each([
        '20 офисов по городу',
        '20 офисов',
        'более 30 филиалов',
        'свыше 50 точек',
        'порядка 40 точек',
        '15 магазинов',
        '2 филиала',
        'офисы по городу',
        'филиалов',
        'отделений',
        'несколько адресов',
        'адреса уточняются',
        'по всему городу',
        'филиалы по всей республике',
        'Қала бойынша',
        'бөлімшелер',
    ])('скрывает карту для «%s»', (text) => {
        expect(isVagueAddress(text)).toBe(true);
    });

    // Ложное срабатывание не просто прячет карту — оно стирает уже
    // выбранные координаты, поэтому обычные адреса критичнее пропусков.
    it.each([
        'ул. Абая 150',
        'ул. Абая 150 офис 3',
        'Достык 12, офис 305',
        'Магазин на Абая 5',
        'Офис на Сейфуллина 100',
        'Филиал по улице Абая 1',
        'Магазин по адресу Толе би 59',
        'Панфилова 98, около 100 метров от метро',
        'филиал №2, ул. Абая 1',
        'мкр. 30, дом 5',
        'Момышулы 15/2',
        'ТРЦ Хан Шатыр, 3 этаж',
        'улица Точная 5',
        '',
    ])('оставляет карту для «%s»', (text) => {
        expect(isVagueAddress(text)).toBe(false);
    });
});

describe('ограничение поиска', () => {
    it('у каждого города из формы есть своя рамка', () => {
        const withoutCenter = CITIES_IN_FORM.filter((city) => !hasCityCenter(city));

        // Город без координат уезжал бы на запасную рамку, и поиск в нём
        // не находил бы вообще ничего: bbox уходит вместе с rspn=1.
        expect(withoutCenter).toEqual([]);
    });

    it('для неизвестного города ограничивает поиск Казахстаном', () => {
        expect(bboxForCity('Другое')).toBe(KAZAKHSTAN_BBOX);
        expect(bboxForCity('')).toBe(KAZAKHSTAN_BBOX);
        expect(bboxForCity(undefined)).toBe(KAZAKHSTAN_BBOX);
    });

    it('отдаёт bbox в порядке «долгота,широта» — его ждёт геокодер', () => {
        const [[latMin, lngMin], [latMax, lngMax]] = boundsForCity('Алматы');
        const [first, second] = bboxForCity('Алматы').split('~');

        expect(first).toBe(`${lngMin.toFixed(6)},${latMin.toFixed(6)}`);
        expect(second).toBe(`${lngMax.toFixed(6)},${latMax.toFixed(6)}`);
    });

    it('держит центр города внутри его же рамки', () => {
        for (const city of CITIES_IN_FORM) {
            const [lat, lng] = centerForCity(city);
            const [[latMin, lngMin], [latMax, lngMax]] = boundsForCity(city);

            expect(lat).toBeGreaterThan(latMin);
            expect(lat).toBeLessThan(latMax);
            expect(lng).toBeGreaterThan(lngMin);
            expect(lng).toBeLessThan(lngMax);
        }
    });
});

describe('координаты', () => {
    it('считает 0,0 валидной точкой, а пустые строки — нет', () => {
        expect(hasCoordinates({ latitude: 0, longitude: 0 })).toBe(true);
        expect(hasCoordinates({ latitude: '43.2', longitude: '76.8' })).toBe(true);
        expect(hasCoordinates({ latitude: '', longitude: '' })).toBe(false);
        expect(hasCoordinates({ latitude: null, longitude: 1 })).toBe(false);
        expect(hasCoordinates({})).toBe(false);
        expect(hasCoordinates(null)).toBe(false);
    });

    it('отдаёт координаты как [широта, долгота] — такой порядок у ymaps', () => {
        expect(toCoords({ latitude: '43.2', longitude: '76.8' })).toEqual([43.2, 76.8]);
    });
});

describe('что показывать на карте вакансии', () => {
    it('требует и координаты, и осмысленный адрес', () => {
        expect(isMappable({ adress: 'ул. Абая 150', latitude: 43.2, longitude: 76.8 })).toBe(true);
        expect(isMappable({ adress: 'более 30 филиалов', latitude: 43.2, longitude: 76.8 })).toBe(false);
        expect(isMappable({ adress: 'ул. Абая 150', latitude: null, longitude: null })).toBe(false);
    });
});

describe('дистанционный город', () => {
    it('узнаёт значение, которое реально лежит в базе', () => {
        // В БД хранится русское «Дистанционное»; казахское «Қашықтықтан» —
        // только подпись в интерфейсе.
        expect(isRemoteCity('Дистанционное')).toBe(true);
        expect(isRemoteCity('  Дистанционное  ')).toBe(true);
        expect(isRemoteCity('Алматы')).toBe(false);
        expect(isRemoteCity('Другое')).toBe(false);
        expect(isRemoteCity(null)).toBe(false);
    });
});

describe('адрес в шапке вакансии', () => {
    it('срезает страну и город, которые выводятся отдельно', () => {
        expect(stripCityPrefix('Казахстан, Алматы, улица Абдуллы Розыбакиева, 75', 'Алматы'))
            .toBe('улица Абдуллы Розыбакиева, 75');
    });

    it('не трогает улицу, названную как город', () => {
        expect(stripCityPrefix('улица Алматы, 5', 'Алматы')).toBe('улица Алматы, 5');
        expect(stripCityPrefix('Алматы, улица Алматы, 5', 'Алматы')).toBe('улица Алматы, 5');
    });

    it('оставляет адрес как есть, если префикса нет', () => {
        expect(stripCityPrefix('Момышулы 15/2', 'Астана')).toBe('Момышулы 15/2');
        expect(stripCityPrefix('', 'Алматы')).toBe('');
    });
});
