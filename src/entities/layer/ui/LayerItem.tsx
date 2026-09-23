import { memo } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Slider,
    Stack,
    Switch,
    Typography,
} from '@mui/material';

import type { LayerId } from '../model/layerTypes.ts';
import { useLayerStoreSelector } from '../model/layerStore.ts';
import { useLayerActions } from '../../../features/layer-control/model/useLayerActions.ts';

type LayerItemProps = {
    id: LayerId;
};

export const LayerItem = memo(({ id }: LayerItemProps) => {
    const { layer } = useLayerStoreSelector((state) => ({
        layer: state.layersById[id],
    }));

    const {
        toggleLayer,
        setOpacity,
        retryLayer,
    } = useLayerActions();

    if (!layer) {
        return null;
    }

    const statusColor =
        layer.status === 'success'
            ? 'success'
            : layer.status === 'error'
                ? 'error'
                : layer.status === 'loading'
                    ? 'warning'
                    : 'default';

    const statusLabel =
        layer.status === 'success'
            ? 'Загружен'
            : layer.status === 'error'
                ? 'Ошибка'
                : layer.status === 'loading'
                    ? 'Загрузка'
                    : 'Неактивен';

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                minHeight: 210,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
        >
            <CardContent
                sx={{
                    p: {
                        xs: 2,
                        sm: 3,
                    },
                    '&:last-child': {
                        pb: {
                            xs: 2,
                            sm: 3,
                        },
                    },
                }}
            >
                <Stack spacing={2.5}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                fontSize: {
                                    xs: '18px',
                                    sm: '20px',
                                },
                            }}
                        >
                            {layer.title}
                        </Typography>

                        <Switch
                            checked={layer.enabled}
                            onChange={() => void toggleLayer(id)}
                        />
                    </Box>

                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mb: 1,
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Прозрачность
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                            >
                                {Math.round(layer.opacity * 100)}%
                            </Typography>
                        </Box>

                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={layer.opacity}
                            onChange={(_, value) =>
                                setOpacity(id, value as number)
                            }
                            disabled={!layer.enabled}
                            aria-label={`Прозрачность слоя ${layer.title}`}
                        />
                    </Box>

                    <Box
                        sx={{
                            minHeight: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                        }}
                    >
                        <Chip
                            label={statusLabel}
                            color={statusColor}
                            size="small"
                            variant={
                                layer.status === 'idle'
                                    ? 'outlined'
                                    : 'filled'
                            }
                        />

                        <Box
                            sx={{
                                minWidth: {
                                    xs: 104,
                                    sm: 120,
                                },
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            {layer.status === 'error' && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => void retryLayer(id)}
                                >
                                    Повторить
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
});

LayerItem.displayName = 'LayerItem';