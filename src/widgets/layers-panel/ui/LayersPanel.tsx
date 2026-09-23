import {
    Box,
    Stack,
    Typography,
} from '@mui/material';

import { useLayerStoreSelector } from '../../../entities/layer/model/layerStore.ts';
import { LayerItem } from '../../../entities/layer/ui/LayerItem.tsx';

export const LayersPanel = () => {
    const { layerIds } = useLayerStoreSelector((state) => ({
        layerIds: state.layerIds,
    }));

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '720px',
                mx: 'auto',
            }}
        >
            <Box
                sx={{
                    mb: {
                        xs: 2.5,
                        sm: 3,
                    },
                }}
            >
                <Typography
                    component="h1"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: {
                            xs: '24px',
                            sm: '32px',
                            md: '38px',
                        },
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                    }}
                >
                    Управление картографическими слоями
                </Typography>

                <Typography
                    sx={{
                        mt: 1,
                        textAlign: 'center',
                        color: 'text.secondary',
                        fontSize: {
                            xs: '14px',
                            sm: '16px',
                        },
                    }}
                >
                    Настройка отображения и прозрачности слоёв
                </Typography>
            </Box>

            <Stack spacing={2}>
                {layerIds.map((id) => (
                    <LayerItem
                        key={id}
                        id={id}
                    />
                ))}
            </Stack>
        </Box>
    );
};