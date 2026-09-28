import type {FeatureCollection, Point} from "geojson";

export type LayerId = string;

export type LayerStatus =
    | 'idle'
    | 'loading'
    | 'success'
    | 'error';

export const TIME_POINTS = ['10:00', '11:00', '12:00', '13:00', '14:00'];
export type  Time = typeof TIME_POINTS[number];
export type LayerProperties = {value: number};

export type LayerGeoJson = FeatureCollection<
    Point,
    LayerProperties
>;

export type Layer = {
    id: LayerId;
    title: string;
    enabled: boolean;
    opacity: number;
    status: LayerStatus;
    requestId: string | null;
    dataByTime: Partial<Record<Time, LayerGeoJson>>;
};

export type LayerConfig = {
    id: LayerId;
    title: string;
};

export type LayerSeriesPoint = {
    time: Time;
    value: number;
};

export type LayerStore = {
    layerIds: LayerId[];
    layersById: Record<LayerId, Layer>;
    selectedTime: Time;
    seriesById: Record<LayerId, LayerSeriesPoint[]>;
};