import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');

// Переводы подменяем на ключи: так тест не ломается от правок формулировок,
// а проверяет именно то, какое сообщение показано.
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key) => key, i18n: { language: 'ru' } }),
}));

// ymaps грузится внешним скриптом — в jsdom его нет. Подменяем загрузчик,
// остальные утилиты (isVagueAddress, bboxForCity…) остаются настоящими.
vi.mock('@/utils/yandexMaps', async (importOriginal) => {
    const actual = await importOriginal();

    return {
        ...actual,
        isYandexMapsConfigured: () => true,
        loadYandexMaps: () => Promise.resolve(globalThis.__ymaps),
    };
});

const { default: YandexAddressPicker } = await import('@/Components/Map/YandexAddressPicker');

/** Минимальный ymaps: нас интересует только, что происходит с меткой. */
function fakeYmaps() {
    const placemarks = [];

    const map = {
        geoObjects: {
            add: (placemark) => placemarks.push(placemark),
            remove: (placemark) => {
                const index = placemarks.indexOf(placemark);
                if (index !== -1) placemarks.splice(index, 1);
            },
        },
        events: { add: vi.fn() },
        container: { fitToViewport: vi.fn() },
        setCenter: vi.fn(),
        getZoom: () => 12,
        destroy: vi.fn(),
    };

    return {
        placemarks,
        ymaps: {
            Map: function () { return map; },
            Placemark: function (coords) {
                return {
                    geometry: {
                        getCoordinates: () => coords,
                        setCoordinates: (next) => { coords = next; },
                    },
                    events: { add: vi.fn() },
                };
            },
        },
    };
}

/** Обёртка с состоянием — так же, как её использует форма вакансии. */
function Harness({ initial = { adress: '', latitude: null, longitude: null }, city = 'Алматы' }) {
    const [value, setValue] = useState(initial);

    return (
        <>
            <YandexAddressPicker value={value} city={city} onChange={setValue} />
            <output data-testid="value">{JSON.stringify(value)}</output>
        </>
    );
}

const currentValue = () => JSON.parse(screen.getByTestId('value').textContent);
const addressInput = () => screen.getByPlaceholderText('enter_location');

function geocodeResponse(overrides = {}) {
    return {
        data: {
            configured: true,
            failed: false,
            result: {
                address: 'улица Абая, 150',
                full: 'Казахстан, Алматы, улица Абая, 150',
                latitude: 43.237583,
                longitude: 76.883742,
                ...overrides,
            },
        },
    };
}

beforeEach(() => {
    const { ymaps, placemarks } = fakeYmaps();
    globalThis.__ymaps = ymaps;
    globalThis.__placemarks = placemarks;
    axios.get.mockResolvedValue({ data: { configured: true, failed: false, results: [] } });
});

describe('ввод адреса', () => {
    it('просит нажать «Найти», пока координат нет', async () => {
        render(<Harness />);
        await userEvent.type(addressInput(), 'Абая 150');

        expect(await screen.findByText('press_find_for_coordinates')).toBeInTheDocument();
    });

    it('по кнопке «Найти» запрашивает координаты и ставит метку', async () => {
        axios.get.mockImplementation((url) =>
            url === '/address/geocode'
                ? Promise.resolve(geocodeResponse())
                : Promise.resolve({ data: { configured: true, failed: false, results: [] } })
        );

        render(<Harness />);
        await userEvent.type(addressInput(), 'Абая 150');
        await userEvent.click(screen.getByRole('button', { name: 'find_on_map' }));

        await waitFor(() => expect(currentValue().latitude).toBe(43.237583));

        expect(currentValue().adress).toBe('улица Абая, 150');
        expect(screen.getByText('point_selected')).toBeInTheDocument();
        expect(globalThis.__placemarks).toHaveLength(1);
    });

    it('передаёт в геокодер город и рамку поиска', async () => {
        axios.get.mockResolvedValue(geocodeResponse());

        render(<Harness city="Астана" />);
        await userEvent.type(addressInput(), 'Момышулы 15');
        await userEvent.click(screen.getByRole('button', { name: 'find_on_map' }));

        await waitFor(() => expect(currentValue().latitude).not.toBeNull());

        const call = axios.get.mock.calls.find(([url]) => url === '/address/geocode');
        expect(call[1].params.geocode).toBe('Астана, Момышулы 15');
        expect(call[1].params.bbox).toContain('~');
    });

    it('сбрасывает найденную точку, когда адрес правят руками', async () => {
        render(<Harness initial={{ adress: 'улица Абая, 150', latitude: 43.237583, longitude: 76.883742 }} />);

        await waitFor(() => expect(globalThis.__placemarks).toHaveLength(1));
        await userEvent.type(addressInput(), ' корпус 2');

        // Иначе сохранится адрес с координатами совсем другого места.
        expect(currentValue().latitude).toBeNull();
        expect(currentValue().longitude).toBeNull();
        await waitFor(() => expect(globalThis.__placemarks).toHaveLength(0));
        expect(screen.getByText('press_find_for_coordinates')).toBeInTheDocument();
    });

    it('показывает сохранённую точку при открытии на редактирование', async () => {
        render(<Harness initial={{ adress: 'улица Абая, 150', latitude: 43.237583, longitude: 76.883742 }} />);

        expect(await screen.findByText('point_selected')).toBeInTheDocument();
        await waitFor(() => expect(globalThis.__placemarks).toHaveLength(1));
    });
});

describe('подсказки', () => {
    it('подставляет координаты прямо из выбранной подсказки', async () => {
        axios.get.mockImplementation((url) =>
            url === '/address/suggest'
                ? Promise.resolve({
                      data: {
                          configured: true,
                          results: [
                              {
                                  address: 'улица Абая, 150',
                                  full: 'Казахстан, Алматы, улица Абая, 150',
                                  latitude: 43.237583,
                                  longitude: 76.883742,
                              },
                          ],
                      },
                  })
                : Promise.resolve(geocodeResponse())
        );

        render(<Harness />);
        await userEvent.type(addressInput(), 'Абая');

        const option = await screen.findByText('Казахстан, Алматы, улица Абая, 150', {}, { timeout: 2000 });
        await userEvent.click(option);

        // Координаты уже пришли в ответе — повторный геокодинг не нужен.
        await waitFor(() => expect(currentValue().latitude).toBe(43.237583));
        expect(currentValue().adress).toBe('улица Абая, 150');
    });

    it('не дёргает подсказки, пока введено меньше трёх символов', async () => {
        render(<Harness />);
        await userEvent.type(addressInput(), 'Аб');

        await new Promise((resolve) => setTimeout(resolve, 400));

        expect(axios.get.mock.calls.filter(([url]) => url === '/address/suggest')).toHaveLength(0);
    });
});

describe('случаи без карты', () => {
    it('прячет карту и блокирует поиск для охватного адреса', async () => {
        render(<Harness initial={{ adress: 'более 30 филиалов', latitude: null, longitude: null }} />);

        expect(await screen.findByText('map_skipped_for_multiple')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'find_on_map' })).toBeDisabled();
    });

    it('снимает координаты, если адрес стал охватным', async () => {
        render(<Harness initial={{ adress: 'улица Абая, 150', latitude: 43.2, longitude: 76.8 }} />);

        await userEvent.clear(addressInput());
        await userEvent.type(addressInput(), 'более 30 филиалов');

        await waitFor(() => expect(currentValue().latitude).toBeNull());
        expect(screen.getByText('map_skipped_for_multiple')).toBeInTheDocument();
    });

    it('прячет карту для дистанционного города', async () => {
        render(<Harness city="Дистанционное" initial={{ adress: '', latitude: null, longitude: null }} />);

        expect(await screen.findByText('map_skipped_for_remote')).toBeInTheDocument();
    });
});

describe('отказы сервиса', () => {
    it('отличает отказ геокодера от «адрес не найден»', async () => {
        axios.get.mockResolvedValue({ data: { configured: true, failed: true, result: null } });

        render(<Harness />);
        await userEvent.type(addressInput(), 'Абая 150');
        await userEvent.click(screen.getByRole('button', { name: 'find_on_map' }));

        expect(await screen.findByText('address_service_unavailable')).toBeInTheDocument();
        expect(screen.queryByText('address_not_found')).not.toBeInTheDocument();
    });

    it('сообщает, что адрес не найден, когда сервис ответил пустым', async () => {
        axios.get.mockResolvedValue({ data: { configured: true, failed: false, result: null } });

        render(<Harness />);
        await userEvent.type(addressInput(), 'несуществующий адрес');
        await userEvent.click(screen.getByRole('button', { name: 'find_on_map' }));

        expect(await screen.findByText('address_not_found')).toBeInTheDocument();
    });
});
