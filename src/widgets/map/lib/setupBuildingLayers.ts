import {
    Popup,
    type Map,
    type MapLayerMouseEvent,
} from 'maplibre-gl';

const BUILDINGS_LAYER = '3d-buildings';
const SELECTED_LAYER = 'selected-building';

export const setupBuildingLayers = (map: Map) => {
    const labelLayerId = map
        .getStyle()
        .layers
        .find(
            (layer) =>
                layer.type === 'symbol' &&
                layer.layout?.['text-field'],
        )?.id;

    map.addLayer(
        {
            id: BUILDINGS_LAYER,
            source: 'openmaptiles',
            'source-layer': 'building',
            type: 'fill-extrusion',
            minzoom: 15,
            filter: ['!=', ['get', 'hide_3d'], true],
            paint: {
                'fill-extrusion-color': '#b7c7d9',
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    16,
                    ['coalesce', ['get', 'render_height'], 8],
                ],
                'fill-extrusion-base': [
                    'coalesce',
                    ['get', 'render_min_height'],
                    0,
                ],
                'fill-extrusion-opacity': 0.85,
            },
        },
        labelLayerId,
    );

    map.addLayer({
        id: SELECTED_LAYER,
        type: 'fill-extrusion',
        source: 'openmaptiles',
        'source-layer': 'building',
        minzoom: 15,
        filter: ['==', ['id'], -1],
        paint: {
            'fill-extrusion-color': '#2563eb',
            'fill-extrusion-height': [
                'coalesce',
                ['get', 'render_height'],
                8,
            ],
            'fill-extrusion-base': [
                'coalesce',
                ['get', 'render_min_height'],
                0,
            ],
            'fill-extrusion-opacity': 0.9,
        },
    });

    let buildingPopup: Popup | null = null;

    const clearSelection = () => {
        if (map.getLayer(SELECTED_LAYER)) {
            map.setFilter(SELECTED_LAYER, [
                '==',
                ['id'],
                -1,
            ]);
        }
    };

    const handleClick = (event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];

        if (!feature || feature.id == null) {
            return;
        }

        const rawHeight = feature.properties?.render_height;

        const parsedHeight =
            rawHeight == null || rawHeight === ''
                ? NaN
                : Number(rawHeight);

        const height = Number.isFinite(parsedHeight)
            ? `${parsedHeight} м`
            : 'Нет данных';

        if (buildingPopup) {
            buildingPopup.remove();
            buildingPopup = null;
        }

        map.setFilter(SELECTED_LAYER, [
            '==',
            ['id'],
            feature.id,
        ]);

        const content = document.createElement('div');

        content.style.padding = '8px';
        content.style.minWidth = '180px';

        const title = document.createElement('h3');
        title.textContent = 'Информация о здании';
        title.style.margin = '0 0 12px';

        const idText = document.createElement('p');
        idText.textContent = `ID: ${feature.id}`;
        idText.style.margin = '0 0 8px';

        const heightText = document.createElement('p');
        heightText.textContent = `Высота: ${height}`;
        heightText.style.margin = '0';

        content.append(title, idText, heightText);

        const popup = new Popup({
            closeButton: true,
            closeOnClick: false,
            offset: 15,
        });

        buildingPopup = popup;

        popup.on('close', () => {
            if (buildingPopup === popup) {
                buildingPopup = null;
                clearSelection();
            }
        });

        popup
            .setLngLat(event.lngLat)
            .setDOMContent(content)
            .addTo(map);
    };

    const handleMouseEnter = () => {
        map.getCanvas().style.cursor = 'pointer';
    };

    const handleMouseLeave = () => {
        map.getCanvas().style.cursor = '';
    };

    map.on('click', BUILDINGS_LAYER, handleClick);
    map.on('click', SELECTED_LAYER, handleClick);

    map.on('mouseenter', BUILDINGS_LAYER, handleMouseEnter);
    map.on('mouseleave', BUILDINGS_LAYER, handleMouseLeave);

    return () => {
        map.off('click', BUILDINGS_LAYER, handleClick);
        map.off('click', SELECTED_LAYER, handleClick);

        map.off('mouseenter', BUILDINGS_LAYER, handleMouseEnter);
        map.off('mouseleave', BUILDINGS_LAYER, handleMouseLeave);

        const popup = buildingPopup;
        buildingPopup = null;
        popup?.remove();

        map.getCanvas().style.cursor = '';
    };
};
