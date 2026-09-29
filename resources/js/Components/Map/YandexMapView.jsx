import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    isMappable,
    isYandexMapsConfigured,
    loadYandexMaps,
    toCoords,
    toYandexLang,
} from "@/utils/yandexMaps";

/**
 * Карта «Место работы» на странице вакансии: только просмотр, метка на каждый
 * адрес с координатами. Рендерить имеет смысл лишь когда такие адреса есть —
 * вызывающая сторона это проверяет, здесь просто подстраховка.
 */
export default function YandexMapView({ locations = [] }) {
    const { t, i18n } = useTranslation();
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const [failed, setFailed] = useState(false);

    const points = locations.filter(isMappable);
    // Строка-ключ: пересобираем карту только когда реально поменялись точки.
    const pointsKey = points
        .map((point) => `${point.latitude},${point.longitude},${point.adress ?? ""}`)
        .join("|");

    useEffect(() => {
        if (!points.length || !isYandexMapsConfigured()) {
            setFailed(!isYandexMapsConfigured());
            return;
        }

        let cancelled = false;

        loadYandexMaps(toYandexLang(i18n.language))
            .then((ymaps) => {
                if (cancelled || !containerRef.current) return;

                const coordsList = points.map(toCoords);
                const map = new ymaps.Map(
                    containerRef.current,
                    { center: coordsList[0], zoom: 16, controls: ["zoomControl"] },
                    { suppressMapOpenBlock: true }
                );
                mapRef.current = map;

                // Скролл страницы не должен «залипать» на карте.
                map.behaviors.disable("scrollZoom");

                points.forEach((point, index) => {
                    map.geoObjects.add(
                        new ymaps.Placemark(
                            coordsList[index],
                            { balloonContent: point.adress ?? "", hintContent: point.adress ?? "" },
                            { preset: "islands#redDotIcon" }
                        )
                    );
                });

                // Несколько адресов — показываем все сразу.
                if (coordsList.length > 1) {
                    map.setBounds(map.geoObjects.getBounds(), {
                        checkZoomRange: true,
                        zoomMargin: 40,
                    });
                }
            })
            .catch(() => {
                if (!cancelled) setFailed(true);
            });

        return () => {
            cancelled = true;
            mapRef.current?.destroy();
            mapRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pointsKey, i18n.language]);

    if (!points.length) {
        return null;
    }

    return (
        <div>
            {points.map((point, index) => (
                <div key={index} className="mb-2 text-sm text-gray-600">
                    {point.adress}
                </div>
            ))}
            {failed ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-500">
                    {t("map_unavailable", { ns: "createAnnouncement" })}
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className="h-[260px] w-full overflow-hidden rounded-lg border border-gray-200 md:h-[360px]"
                />
            )}
        </div>
    );
}
