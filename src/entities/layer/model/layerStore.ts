import { createVedro } from 'vedro';

import { layerConfigs } from './layerConfig.ts';
import { LAYER_VALUES } from './mockData.ts';

import {
    type Layer,
    type LayerConfig,
    type LayerId,
    type LayerSeriesPoint,
    type LayerStore,
    TIME_POINTS,
} from './layerTypes.ts';

const createLayer = ({
                         id,
                         title,
                     }: LayerConfig): Layer => ({
    id,
    title,
    enabled: false,
    opacity: 1,
    status: 'idle',
    requestId: null,
    dataByTime: {},
});

const createSeries = (
    id: LayerId,
): LayerSeriesPoint[] =>
    TIME_POINTS.map((time) => ({
        time,
        value: LAYER_VALUES[id][time],
    }));

const createInitialState = (
    configs: LayerConfig[],
): LayerStore => {
    const layersById: Record<LayerId, Layer> = {};
    const seriesById: Record<
        LayerId,
        LayerSeriesPoint[]
    > = {};

    for (const config of configs) {
        layersById[config.id] = createLayer(config);

        seriesById[config.id] = createSeries(
            config.id,
        );
    }

    return {
        layerIds: configs.map(({ id }) => id),
        layersById,
        selectedTime: TIME_POINTS[0],
        seriesById,
    };
};

export const initialLayerState: LayerStore =
    createInitialState(layerConfigs);

export const {
    Provider: LayerStoreProvider,
    useSelector: useLayerStoreSelector,
    useDispatch: useLayerStoreDispatch,
    useStore: useLayerStore,
} = createVedro(initialLayerState);