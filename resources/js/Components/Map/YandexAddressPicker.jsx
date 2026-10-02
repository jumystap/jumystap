import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
    bboxForCity,
    boundsForCity,
    centerForCity,
    hasCityCenter,
    hasCoordinates,
    isRemoteCity,
    isVagueAddress,
    isYandexMapsConfigured,
    loadYandexMaps,
    toCoords,
    toYandexLang,
} from "@/utils/yandexMaps";

const SUGGEST_MIN_LENGTH = 3;
const SUGGEST_DEBOUNCE_MS = 300;

/**
 * Поиск адреса + перетаскиваемая метка на Яндекс.Карте.
 *
 * value — объект адреса вакансии: { adress, latitude, longitude }.
 * onChange получает такой же объект целиком, чтобы вызывающая форма просто
 * положила его в нужный индекс data.location.
 *
 * Ключ один (VITE_YANDEX_MAPS_API_KEY), но роли разделены: карту рисует JS
 * API в браузере, а геокодирование идёт через наш бэкенд (/address/geocode).
 * Так сделано потому, что ключ, подключённый в кабинете только к «API
 * Геокодера», JS API отвергает — карта рисуется, а ymaps.geocode() падает
 * со scriptError. HTTP-геокодер тот же ключ принимает.
 *
 * Подсказки при вводе даёт тот же геокодер: на неполный запрос он возвращает
 * список кандидатов. Отдельный ключ Геосаджеста поэтому не нужен (а Suggest
 * из JS API 2.1 вырезан — FeatureRemovedError).
 *
 * Карта прячется, когда точки быть не может: город «Дистанционное» или
 * охватный адрес вроде «более 30 филиалов».
 */
export default function YandexAddressPicker({ value, city, onChange, hasError = false }) {
    const { t, i18n } = useTranslation();
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const placemarkRef = useRef(null);
    const ymapsRef = useRef(null);
    // onChange меняется каждый рендер родителя — держим в ref, чтобы не
    // пересоздавать карту и не терять поставленную метку.
    const onChangeRef = useRef(onChange);

    const [status, setStatus] = useState("loading"); // loading | ready | error | unconfigured
    const [searching, setSearching] = useState(false);
    const [notFound, setNotFound] = useState(false);
    // Отказ сервиса (ключ без доступа к геокодеру) — это не «адрес не найден»,
    // и сообщение должно быть другим, иначе диагностика уходит не туда.
    const [serviceError, setServiceError] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [suggestOpen, setSuggestOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const rootRef = useRef(null);
    // Текст, выставленный выбором подсказки или геокодером: по нему список
    // не перезапрашиваем, иначе он всплывает сразу после выбора.
    const skipSuggestFor = useRef(null);
    // Ответы, пришедшие не по порядку, игнорируем.
    const suggestRequestId = useRef(0);
    // Город на прошлом прогоне эффекта — чтобы отличить смену от первого рендера.
    const previousCityRef = useRef(undefined);

    useEffect(() => {
        onChangeRef.current = onChange;
    });

    const address = value?.adress ?? "";

    const emit = useCallback(
        (patch) => {
            onChangeRef.current?.({ ...(value ?? {}), ...patch });
        },
        [value]
    );
    const emitRef = useRef(emit);
    useEffect(() => {
        emitRef.current = emit;
    });

    /** Ставит/двигает метку и запоминает координаты. */
    const setPoint = useCallback((coords, { center = true } = {}) => {
        const map = mapRef.current;
        const ymaps = ymapsRef.current;
        if (!map || !ymaps) return;

        if (placemarkRef.current) {
            placemarkRef.current.geometry.setCoordinates(coords);
        } else {
            const placemark = new ymaps.Placemark(
                coords,
                {},
                { draggable: true, preset: "islands#redDotIcon" }
            );
            placemark.events.add("dragend", () => {
                const dragged = placemark.geometry.getCoordinates();
                emitRef.current({ latitude: dragged[0], longitude: dragged[1] });
                reverseGeocode(dragged);
            });
            map.geoObjects.add(placemark);
            placemarkRef.current = placemark;
        }

        if (center) {
            map.setCenter(coords, Math.max(map.getZoom(), 16), { duration: 250 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** Координаты -> текст адреса. Подставляем в поле, чтобы оно не разъезжалось с меткой. */
    const reverseGeocode = (coords) => {
        // Геокодер — через бэкенд: JS API не принимает ключ, подключённый
        // только к «API Геокодера» (в браузере это падает со scriptError).
        axios
            .get("/address/geocode", {
                // Яндекс ждёт «долгота,широта» — порядок обратный нашему.
                params: { geocode: `${coords[1]},${coords[0]}` },
            })
            .then(({ data }) => {
                if (!data.result) return;

                skipSuggestFor.current = data.result.address;
                emitRef.current({
                    adress: data.result.address,
                    latitude: coords[0],
                    longitude: coords[1],
                });
            })
            .catch((error) => console.warn("Reverse geocode failed", error));
    };

    /** Текст -> точка. Город подмешиваем и в запрос, и в рамку поиска. */
    const searchAddress = useCallback(
        (query) => {
            const text = (query ?? "").trim();
            if (!text) return;

            setSearching(true);
            setNotFound(false);
            setServiceError(false);

            axios
                .get("/address/geocode", {
                    params: {
                        geocode: city ? `${city}, ${text}` : text,
                        // Ищем в границах города, а если его координаты
                        // неизвестны — в границах Казахстана. Иначе «Абая 1»
                        // уезжает в соседний регион или вовсе за границу.
                        bbox: bboxForCity(city),
                    },
                })
                .then(({ data }) => {
                    if (!data.configured || data.failed) {
                        setServiceError(true);
                        return;
                    }
                    if (!data.result) {
                        setNotFound(true);
                        return;
                    }

                    const { address: line, latitude, longitude } = data.result;
                    skipSuggestFor.current = line;
                    setPoint([latitude, longitude]);
                    emitRef.current({ adress: line, latitude, longitude });
                })
                .catch((error) => {
                    console.warn("Geocode failed", error);
                    setServiceError(true);
                })
                .finally(() => setSearching(false));
        },
        [city, setPoint]
    );

    // Инициализация карты — один раз на монтирование компонента.
    useEffect(() => {
        if (!isYandexMapsConfigured()) {
            setStatus("unconfigured");
            return;
        }

        let cancelled = false;

        loadYandexMaps(toYandexLang(i18n.language))
            .then((ymaps) => {
                if (cancelled || !containerRef.current) return;

                ymapsRef.current = ymaps;
                const start = hasCoordinates(value) ? toCoords(value) : centerForCity(city);

                // Встроенный поиск карты не включаем: он ходит через JS API,
                // который наш ключ не принимает. Поиск живёт в поле над картой
                // и идёт через бэкенд.
                const map = new ymaps.Map(
                    containerRef.current,
                    {
                        center: start,
                        zoom: hasCoordinates(value) ? 17 : 12,
                        controls: ["zoomControl"],
                    },
                    { suppressMapOpenBlock: true }
                );
                mapRef.current = map;

                if (hasCoordinates(value)) {
                    setPoint(start, { center: false });
                }

                // Клик по карте — тоже способ поставить точку.
                map.events.add("click", (event) => {
                    const coords = event.get("coords");
                    setPoint(coords, { center: false });
                    emitRef.current({ latitude: coords[0], longitude: coords[1] });
                    reverseGeocode(coords);
                });

                setStatus("ready");
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });

        return () => {
            cancelled = true;
            mapRef.current?.destroy();
            mapRef.current = null;
            placemarkRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** Убирает метку с карты и из данных формы. */
    const clearPoint = useCallback(() => {
        if (placemarkRef.current && mapRef.current) {
            mapRef.current.geoObjects.remove(placemarkRef.current);
        }
        placemarkRef.current = null;
        emitRef.current({ latitude: null, longitude: null });
    }, []);

    // Смена города переводит карту на новый город. Важно отличать реальную
    // смену от первого прогона: на странице редактирования точка приходит
    // сохранённой, и её нельзя терять только из-за того, что эффект отработал.
    useEffect(() => {
        if (status !== "ready" || !mapRef.current) {
            return;
        }

        const previousCity = previousCityRef.current;
        previousCityRef.current = city;

        if (previousCity === undefined || previousCity === city) {
            return;
        }

        mapRef.current.setCenter(centerForCity(city), 12, { duration: 250 });

        // Точка из прежнего города к новому не относится — снимаем её, но
        // только если она реально за пределами нового города (смена написания
        // города не должна стирать корректную метку).
        // Границы известны не для всех городов («Другое», новые города):
        // без них «точка вне города» посчиталась бы по запасной Астане и
        // корректная метка терялась бы.
        if (hasCoordinates(value) && hasCityCenter(city)) {
            const [lat, lng] = toCoords(value);
            const [[latMin, lngMin], [latMax, lngMax]] = boundsForCity(city);
            const inside = lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax;

            if (!inside) {
                clearPoint();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city, status]);

    // Метка живёт в ymaps, а не в React, поэтому её нужно приводить к value
    // явно. Без этого: (1) удаление адреса из списка переиспользует компонент
    // по индексу и на карте остаётся метка прежней строки — перетаскивание
    // тогда перезаписывало бы координаты соседнего адреса; (2) точка,
    // выбранная из подсказок до того, как догрузилась карта, не рисовалась.
    useEffect(() => {
        if (status !== "ready" || !mapRef.current) return;

        if (hasCoordinates(value)) {
            setPoint(toCoords(value), { center: false });
        } else if (placemarkRef.current) {
            mapRef.current.geoObjects.remove(placemarkRef.current);
            placemarkRef.current = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, value?.latitude, value?.longitude]);

    const vague = isVagueAddress(address);
    const remote = isRemoteCity(city);
    // Оба случая означают одно: точки на карте быть не может.
    const mapUseless = vague || remote;

    const closeSuggestions = useCallback(() => {
        setSuggestOpen(false);
        setActiveIndex(-1);
    }, []);

    // Подсказки: дебаунс + отсечение устаревших ответов. Карту не ждём —
    // список приходит с бэкенда и от загрузки ymaps не зависит.
    useEffect(() => {
        const text = address.trim();

        if (mapUseless || text.length < SUGGEST_MIN_LENGTH || skipSuggestFor.current === address) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(() => {
            const requestId = ++suggestRequestId.current;

            axios
                .get("/address/suggest", {
                    params: {
                        text: city ? `${city}, ${text}` : text,
                        bbox: bboxForCity(city),
                    },
                })
                .then(({ data }) => {
                    if (requestId !== suggestRequestId.current) return;

                    const items = data.results ?? [];
                    setSuggestions(items);
                    setActiveIndex(-1);
                    setSuggestOpen(items.length > 0);
                })
                .catch((error) => {
                    console.warn("Address suggest failed", error);
                    if (requestId === suggestRequestId.current) setSuggestions([]);
                });
        }, SUGGEST_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [address, city, mapUseless]);

    // Клик вне блока закрывает список.
    useEffect(() => {
        if (!suggestOpen) return;

        const onDocumentMouseDown = (event) => {
            if (!rootRef.current?.contains(event.target)) closeSuggestions();
        };

        document.addEventListener("mousedown", onDocumentMouseDown);

        return () => document.removeEventListener("mousedown", onDocumentMouseDown);
    }, [suggestOpen, closeSuggestions]);

    // «Более 30 филиалов» и удалёнка: точка бессмысленна — снимаем метку и
    // чистим координаты, чтобы на странице вакансии не всплыла карта.
    useEffect(() => {
        if (mapUseless && hasCoordinates(value)) {
            clearPoint();
        }
    }, [mapUseless, value, clearPoint]);

    const pointChosen = hasCoordinates(value);
    const mapHidden = mapUseless || status === "unconfigured" || status === "error";

    // Карта, скрытая через display:none, просыпается с нулевыми размерами —
    // после показа просим ymaps пересчитать вьюпорт.
    useEffect(() => {
        if (!mapHidden && status === "ready") {
            mapRef.current?.container.fitToViewport();
        }
    }, [mapHidden, status]);

    const chooseSuggestion = (item) => {
        skipSuggestFor.current = item.address;
        closeSuggestions();
        setNotFound(false);
        setServiceError(false);
        setPoint([item.latitude, item.longitude]);
        emitRef.current({
            adress: item.address,
            latitude: item.latitude,
            longitude: item.longitude,
        });
    };

    const onInputKeyDown = (event) => {
        if (!suggestOpen || suggestions.length === 0) {
            if (event.key === "Enter") {
                event.preventDefault();
                searchAddress(address);
            }
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((prev) => (prev + 1) % suggestions.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
        } else if (event.key === "Enter") {
            event.preventDefault();
            if (activeIndex >= 0) {
                chooseSuggestion(suggestions[activeIndex]);
            } else {
                closeSuggestions();
                searchAddress(address);
            }
        } else if (event.key === "Escape") {
            closeSuggestions();
        }
    };

    return (
        <div ref={rootRef}>
            <div className="flex items-start gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        className={`w-full rounded-lg border px-3 py-2 text-sm ${
                            hasError ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={t("enter_location", { ns: "createAnnouncement" })}
                        value={address}
                        autoComplete="off"
                        onChange={(event) => {
                            skipSuggestFor.current = null;
                            // Текст правили руками — прежняя точка к нему уже
                            // не относится. Сбрасываем, чтобы нельзя было
                            // сохранить адрес с координатами от другого места;
                            // метку снимет эффект синхронизации.
                            emit({
                                adress: event.target.value,
                                latitude: null,
                                longitude: null,
                            });
                        }}
                        onFocus={() => {
                            if (suggestions.length > 0) setSuggestOpen(true);
                        }}
                        onKeyDown={onInputKeyDown}
                    />

                    {suggestOpen && suggestions.length > 0 && (
                        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                            {suggestions.map((item, index) => (
                                <li key={`${item.address}-${index}`}>
                                    <button
                                        type="button"
                                        // mousedown, а не click: список успел бы
                                        // закрыться до срабатывания клика.
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            chooseSuggestion(item);
                                        }}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={`block w-full px-3 py-2 text-left text-sm ${
                                            index === activeIndex ? "bg-blue-50" : "bg-white"
                                        }`}
                                    >
                                        {item.full || item.address}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => {
                        closeSuggestions();
                        searchAddress(address);
                    }}
                    disabled={searching || mapUseless || !address.trim()}
                    className="shrink-0 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-all duration-150 hover:bg-blue-600 disabled:opacity-50"
                >
                    {t("find_on_map", { ns: "createAnnouncement" })}
                </button>
            </div>

            {remote && (
                <div className="mt-2 rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-500">
                    {t("map_skipped_for_remote", { ns: "createAnnouncement" })}
                </div>
            )}

            {!remote && vague && (
                <div className="mt-2 rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-500">
                    {t("map_skipped_for_multiple", { ns: "createAnnouncement" })}
                </div>
            )}

            {!mapUseless && (status === "unconfigured" || status === "error") && (
                <div className="mt-2 rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-500">
                    {t("map_unavailable", { ns: "createAnnouncement" })}
                </div>
            )}

            {/* Контейнер карты не размонтируем — ymaps привязан к этому узлу.
                При «охватном» адресе просто прячем блок классом. */}
            <div className={mapHidden ? "hidden" : ""}>
                <div className="mt-2 text-xs text-gray-500">
                    {t("map_hint", { ns: "createAnnouncement" })}
                </div>
                <div
                    ref={containerRef}
                    className="mt-2 h-[260px] w-full overflow-hidden rounded-lg border border-gray-200 md:h-[320px]"
                />
                <div className="mt-1 text-xs">
                    {serviceError && (
                        <span className="text-red-500">
                            {t("address_service_unavailable", { ns: "createAnnouncement" })}
                        </span>
                    )}
                    {!serviceError && notFound && (
                        <span className="text-red-500">
                            {t("address_not_found", { ns: "createAnnouncement" })}
                        </span>
                    )}
                    {!serviceError && !notFound && pointChosen && (
                        <span className="text-green-600">
                            {t("point_selected", { ns: "createAnnouncement" })}
                        </span>
                    )}
                    {!serviceError && !notFound && !pointChosen && (
                        <span className={address.trim() ? "text-orange-600" : "text-gray-500"}>
                            {address.trim()
                                ? t("press_find_for_coordinates", { ns: "createAnnouncement" })
                                : t("point_not_selected", { ns: "createAnnouncement" })}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
