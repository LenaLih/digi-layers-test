import { createVedro } from 'vedro';
import {layerConfigs} from "./layerConfig.ts";
import type {Layer, LayerConfig, LayerId, LayerStore} from "./layerTypes.ts";

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
});

const createInitialState = (
    configs: LayerConfig[],
): LayerStore => {
    const layersById: Record<LayerId, Layer> = {};

    for (const config of configs) {
        layersById[config.id] = createLayer(config);
    }

    return {
        layerIds: configs.map(({ id }) => id),
        layersById,
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