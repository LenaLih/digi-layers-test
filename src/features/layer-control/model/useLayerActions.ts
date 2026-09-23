import { loadLayer } from '../../../entities/layer/api/mockApi.ts';
import type { LayerId, LayerStatus } from '../../../entities/layer/model/layerTypes.ts';
import {
    useLayerStoreDispatch,
    useLayerStore,
} from '../../../entities/layer/model/layerStore.ts';

const controllers = new Map<LayerId, AbortController>();

type LayerPatch = {
    enabled?: boolean;
    opacity?: number;
    status?: LayerStatus;
    requestId?: string | null;
};

export const useLayerActions = () => {
    const dispatch = useLayerStoreDispatch();
    const store = useLayerStore();

    const updateLayer = (
        id: LayerId,
        patch: LayerPatch,
    ) => {
        dispatch((state) => {
            const currentLayer = state.layersById[id];

            if (!currentLayer) {
                return {};
            }

            return {
                layersById: {
                    ...state.layersById,
                    [id]: {
                        ...currentLayer,
                        ...patch,
                    },
                },
            };
        });
    };

    const setOpacity = (
        id: LayerId,
        opacity: number,
    ) => {
        const safeOpacity = Math.min(
            1,
            Math.max(0, opacity),
        );

        updateLayer(id, {
            opacity: safeOpacity,
        });
    };

    const disableLayer = (id: LayerId) => {
        controllers.get(id)?.abort();
        controllers.delete(id);

        updateLayer(id, {
            enabled: false,
            status: 'idle',
            requestId: null,
        });
    };

    const enableLayer = async (id: LayerId) => {
        controllers.get(id)?.abort();

        const controller = new AbortController();
        controllers.set(id, controller);

        const requestId = crypto.randomUUID();

        updateLayer(id, {
            enabled: true,
            status: 'loading',
            requestId,
        });

        try {
            await loadLayer(controller.signal);

            const currentLayer =
                store.get('layersById')[id];

            if (!currentLayer) {
                return;
            }

            if (currentLayer.requestId !== requestId) {
                return;
            }

            updateLayer(id, {
                status: 'success',
            });

            controllers.delete(id);
        } catch (error) {
            if (
                error instanceof DOMException &&
                error.name === 'AbortError'
            ) {
                return;
            }

            const currentLayer =
                store.get('layersById')[id];

            if (!currentLayer) {
                return;
            }

            if (currentLayer.requestId !== requestId) {
                return;
            }

            updateLayer(id, {
                status: 'error',
            });

            controllers.delete(id);
        }
    };

    const toggleLayer = async (id: LayerId) => {
        const layer = store.get('layersById')[id];

        if (!layer) {
            return;
        }

        if (layer.enabled) {
            disableLayer(id);
            return;
        }

        await enableLayer(id);
    };

    const retryLayer = async (id: LayerId) => {
        const layer = store.get('layersById')[id];

        if (!layer) {
            return;
        }

        await enableLayer(id);
    };

    return {
        setOpacity,
        toggleLayer,
        retryLayer,
    };
};