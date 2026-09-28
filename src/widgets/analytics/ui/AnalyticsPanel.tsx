import { Box, Typography } from '@mui/material';

import {
    useLayerStoreSelector,
} from '../../../entities/layer/model/layerStore.ts';

import { LayerChart } from './LayerChart.tsx';

export const AnalyticsPanel = () => {
    const selectedTime = useLayerStoreSelector(
        (state) => state.selectedTime,
    );

    const activeLayerIds = useLayerStoreSelector(
        (state) =>
            state.layerIds.filter(
                (id) => state.layersById[id]?.enabled,
            ),
    );

    if (activeLayerIds.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{
                mt: 3,
                p: 2,
                backgroundColor: '#ffffff',
                borderRadius: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <Typography
                    variant="h6"
                    component="h2"
                >
                    Аналитика
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Выбранное время: {selectedTime}
                </Typography>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                {activeLayerIds.map((layerId) => (
                    <LayerChart
                        key={layerId}
                        layerId={layerId}
                    />
                ))}
            </Box>
        </Box>
    );
};