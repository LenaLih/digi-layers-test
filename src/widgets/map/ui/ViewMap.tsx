import { useEffect, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import {
    Map,
    Popup,
    type GeoJSONSource,
    setWorkerUrl,
} from 'maplibre-gl';

import 'maplibre-gl/dist/maplibre-gl.css';

import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

import {
    useLayerStoreSelector,
} from '../../../entities/layer/model/layerStore.ts';

import { MAP_LAYER_CONFIG } from '../model/mapLayerConfig.ts';
import { MapPopup } from './MapPopup.tsx';

setWorkerUrl(workerUrl);

export const ViewMap = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);

    const [mapReady, setMapReady] = useState(false);

    const selectedTime = useLayerStoreSelector(
        (state) => state.selectedTime,
    );

    const layersById = useLayerStoreSelector(
        (state) => state.layersById,
    );

    const selectedTimeRef = useRef(selectedTime);
    const layersByIdRef = useRef(layersById);

    useEffect(() => {
        selectedTimeRef.current = selectedTime;
    }, [selectedTime]);

    useEffect(() => {
        layersByIdRef.current = layersById;
    }, [layersById]);

    useEffect(() => {
        if (!mapContainerRef.current) {
            return;
        }

        const map = new Map({
            container: mapContainerRef.current,
            style: 'https://demotiles.maplibre.org/style.json',
            center: [74.6, 42.87],
            zoom: 10,
        });

        mapRef.current = map;

        const popup = new Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 12,
            className: 'layer-popup',
        });

        const popupContainer = document.createElement('div');

        let popupRoot: Root | null = null;

        map.on('load', () => {
            Object.entries(MAP_LAYER_CONFIG).forEach(
                ([id, config]) => {
                    map.addSource(config.sourceId, {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [],
                        },
                    });

                    map.addLayer({
                        id: config.layerId,
                        type: 'circle',
                        source: config.sourceId,
                        layout: {
                            visibility: 'none',
                        },
                        paint: config.paint,
                    });

                    map.on('mouseenter', config.layerId, () => {
                        map.getCanvas().style.cursor = 'pointer';
                    });

                    map.on('mousemove', config.layerId, (event) => {
                        const feature = event.features?.[0];

                        if (!feature) {
                            return;
                        }

                        const value = feature.properties?.value;

                        if (typeof value !== 'number') {
                            return;
                        }

                        const currentLayer =
                            layersByIdRef.current[id];

                        if (!popupRoot) {
                            popupRoot = createRoot(popupContainer);
                        }

                        popupRoot.render(
                            <MapPopup
                                title={currentLayer?.title ?? id}
                                time={selectedTimeRef.current}
                                value={value}
                            />,
                        );

                        popup
                            .setLngLat(event.lngLat)
                            .setDOMContent(popupContainer)
                            .addTo(map);
                    });

                    map.on('mouseleave', config.layerId, () => {
                        map.getCanvas().style.cursor = '';
                        popup.remove();
                    });
                },
            );

            setMapReady(true);
        });

        return () => {
            popup.remove();
            popupRoot?.unmount();

            setMapReady(false);
            mapRef.current = null;

            map.remove();
        };
    }, []);

    useEffect(() => {
        const map = mapRef.current;

        if (!map || !mapReady) {
            return;
        }

        Object.entries(MAP_LAYER_CONFIG).forEach(
            ([id, config]) => {
                const layer = layersById[id];

                if (!layer) {
                    return;
                }

                const source = map.getSource(
                    config.sourceId,
                ) as GeoJSONSource | undefined;

                const data =
                    layer.dataByTime[selectedTime];

                if (source) {
                    source.setData(
                        data ?? {
                            type: 'FeatureCollection',
                            features: [],
                        },
                    );
                }

                if (map.getLayer(config.layerId)) {
                    map.setLayoutProperty(
                        config.layerId,
                        'visibility',
                        layer.enabled ? 'visible' : 'none',
                    );

                    map.setPaintProperty(
                        config.layerId,
                        'circle-opacity',
                        layer.opacity,
                    );
                }
            },
        );
    }, [layersById, selectedTime, mapReady]);

    return (
        <div
            ref={mapContainerRef}
            style={{
                width: '100%',
                height: '500px',
            }}
        />
    );
};