import type {LayerGeoJson, LayerId, Time} from "../model/layerTypes.ts";
import {LAYER_VALUES} from "../model/mockData.ts";

const coordinates: Record<LayerId, [number, number]> = {
    temperature: [74.60, 42.87],
    wind: [74.70, 42.92],
    insolation: [74.50, 42.82],
};

export const loadLayer = async (
    id: LayerId,
    time: Time,
    signal?: AbortSignal,
): Promise<LayerGeoJson> => {
    await new Promise<void>((resolve, reject) => {
        const timeoutId = window.setTimeout(
            resolve,
            1000,
        );

        signal?.addEventListener(
            'abort',
            () => {
                window.clearTimeout(timeoutId);

                reject(
                    new DOMException(
                        'Request aborted',
                        'AbortError',
                    ),
                );
            },
            { once: true },
        );
    });

    if (Math.random() < 0.25) {
        throw new Error('Layer loading failed');
    }

    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: coordinates[id],
                },
                properties: {
                    value: LAYER_VALUES[id][time],
                },
            },
        ],
    };
};