import type { CircleLayerSpecification } from 'maplibre-gl';

type MapLayerConfig = {
    sourceId: string;
    layerId: string;
    paint: CircleLayerSpecification['paint'];
};

export const MAP_LAYER_CONFIG: Record<string, MapLayerConfig> = {
    temperature: {
        sourceId: 'temperature-source',
        layerId: 'temperature-layer',
        paint: {
            'circle-radius': 16,
            'circle-color': [
                'interpolate',
                ['linear'],
                ['get', 'value'],
                15,
                '#60a5fa',
                22,
                '#facc15',
                30,
                '#ef4444',
            ],
            'circle-opacity': 1,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
        },
    },

    wind: {
        sourceId: 'wind-source',
        layerId: 'wind-layer',
        paint: {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'value'],
                0,
                8,
                10,
                24,
            ],
            'circle-color': '#3b82f6',
            'circle-opacity': 1,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
        },
    },

    insolation: {
        sourceId: 'insolation-source',
        layerId: 'insolation-layer',
        paint: {
            'circle-radius': 18,
            'circle-color': [
                'interpolate',
                ['linear'],
                ['get', 'value'],
                200,
                '#fde68a',
                500,
                '#f59e0b',
                800,
                '#ea580c',
            ],
            'circle-opacity': 1,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
        },
    },
};