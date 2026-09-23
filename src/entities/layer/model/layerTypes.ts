export type LayerId = string;

export type LayerStatus =
    | 'idle'
    | 'loading'
    | 'success'
    | 'error';

export type Layer = {
    id: LayerId;
    title: string;
    enabled: boolean;
    opacity: number;
    status: LayerStatus;
    requestId: string | null;
};

export type LayerConfig = {
    id: LayerId;
    title: string;
};

export type LayerStore = {
    layerIds: LayerId[];
    layersById: Record<LayerId, Layer>;
};