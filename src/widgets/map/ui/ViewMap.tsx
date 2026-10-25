import {Box, Button, Stack, useMediaQuery} from '@mui/material';
import type {SearchPlace} from "../lib/searchPlaces.ts";
import {setupBuildingLayers} from "../lib/setupBuildingLayers.ts";
import { MapControls } from './MapControls.tsx';
import { useEffect, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MapSearch } from './MapSearch.tsx';

import {
    Map,
    Marker,
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
    const searchMarkerRef = useRef<Marker | null>(null);
    const isMobile = useMediaQuery('(max-width:600px)');

    const [mapReady, setMapReady] = useState(false);
    const [is3D, setIs3D] = useState(true);
    const [pitch, setPitch] = useState(60);
    const [bearing, setBearing] = useState(-20);
    const [activePanel, setActivePanel] = useState<
        'none' | 'search' | 'settings'
    >('none');

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
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [74.6122, 42.8746],
            zoom: 16,
            pitch: 60,
            bearing: -20,
            canvasContextAttributes: {
                antialias: true,
            },
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
        let cleanupBuildings: (() => void) | undefined;

        map.on('load', () => {
            map.getStyle().layers.forEach((layer) => {
                if (
                    layer.type !== 'symbol' ||
                    !layer.layout?.['text-field']
                ) {
                    return;
                }

                map.setLayoutProperty(
                    layer.id,
                    'text-field',
                    [
                        'coalesce',
                        ['get', 'name:ru'],
                        ['get', 'name'],
                        '',
                    ],
                );
            });
            cleanupBuildings = setupBuildingLayers(map);
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
            searchMarkerRef.current?.remove();
            searchMarkerRef.current = null;
            cleanupBuildings?.();
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
    const handleModeChange = (enabled: boolean) => {
        const map = mapRef.current;

        if (!map || !mapReady) return;

        setIs3D(enabled);

        if (map.getLayer('3d-buildings')) {
            map.setLayoutProperty(
                '3d-buildings',
                'visibility',
                enabled ? 'visible' : 'none',
            );
        }
        if (map.getLayer('selected-building')) {
            map.setLayoutProperty(
                'selected-building',
                'visibility',
                enabled ? 'visible' : 'none',
            );
        }
        const nextPitch = enabled ? 60 : 0;
        setBearing(enabled ? -20 : 0);

        setPitch(nextPitch);

        map.easeTo({
            pitch: nextPitch,
            bearing: enabled ? -20 : 0,
            duration: 800,
        });
    };

    const handlePitchChange = (value: number) => {
        const map = mapRef.current;

        if (!map || !mapReady || !is3D) return;

        setPitch(value);
        map.setPitch(value);
    };
    const handleBearingChange = (value: number) => {
        const map = mapRef.current;

        if (!map || !mapReady || !is3D) return;

        setBearing(value);
        map.setBearing(value);
    };

    const handleResetView = () => {
        const map = mapRef.current;

        if (!map || !mapReady) return;

        const nextPitch = is3D ? 60 : 0;
        const nextBearing = is3D ? -20 : 0;

        setPitch(nextPitch);
        setBearing(nextBearing);

        map.easeTo({
            center: [74.6122, 42.8746],
            zoom: 16,
            pitch: nextPitch,
            bearing: nextBearing,
            duration: 1000,
        });
    };
    const handlePlaceSelect = (place: SearchPlace) => {
        const map = mapRef.current;

        if (!map || !mapReady) return;

        searchMarkerRef.current?.remove();

        const marker = new Marker({
            color: '#2563eb',
        })
            .setLngLat(place.coordinates)
            .setPopup(
                new Popup({ offset: 25 }).setText(
                    [place.name, place.address]
                        .filter(Boolean)
                        .join(' — '),
                ),
            )
            .addTo(map);

        searchMarkerRef.current = marker;

        map.flyTo({
            center: place.coordinates,
            zoom: 17,
            pitch: is3D ? 60 : 0,
            bearing: map.getBearing(),
            duration: 1800,
        });

        marker.togglePopup();
    };
    return (
        <Box sx={{ position: 'relative', width: '100%', height: 500 }}>
            <Box
                ref={mapContainerRef}
                sx={{ width: '100%', height: '100%' }}
            />

            {mapReady && (
                <>
                    {isMobile && (
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                zIndex: 5,
                            }}
                        >
                            <Button
                                size="small"
                                variant={
                                    activePanel === 'search'
                                        ? 'contained'
                                        : 'outlined'
                                }
                                sx={{ bgcolor: activePanel === 'search' ? undefined : 'white' }}
                                onClick={() =>
                                    setActivePanel(
                                        activePanel === 'search' ? 'none' : 'search'
                                    )
                                }
                            >
                                Поиск
                            </Button>

                            <Button
                                size="small"
                                variant={
                                    activePanel === 'settings'
                                        ? 'contained'
                                        : 'outlined'
                                }
                                sx={{ bgcolor: activePanel === 'settings' ? undefined : 'white' }}
                                onClick={() =>
                                    setActivePanel(
                                        activePanel === 'settings' ? 'none' : 'settings'
                                    )
                                }
                            >
                                Настройки
                            </Button>
                        </Stack>
                    )}

                    {(!isMobile || activePanel === 'search') && (
                        <MapSearch
                            onSelect={(place) => {
                                handlePlaceSelect(place);

                                if (isMobile) {
                                    setActivePanel('none');
                                }
                            }}
                        />
                    )}

                    {(!isMobile || activePanel === 'settings') && (
                        <MapControls
                            is3D={is3D}
                            pitch={pitch}
                            bearing={bearing}
                            onModeChange={handleModeChange}
                            onPitchChange={handlePitchChange}
                            onBearingChange={handleBearingChange}
                            onResetView={handleResetView}
                        />
                    )}
                </>
            )}
        </Box>
    );
};