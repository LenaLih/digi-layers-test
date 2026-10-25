import { Box, Button, Paper, Slider, Typography } from '@mui/material';

type MapControlsProps = {
    is3D: boolean;
    pitch: number;
    onModeChange: (enabled: boolean) => void;
    onPitchChange: (value: number) => void;
    bearing: number;
    onBearingChange: (value: number) => void;
    onResetView: () => void;
};

export const MapControls = ({
    is3D,
    pitch,
    onModeChange,
    onPitchChange,
    bearing,
    onBearingChange,
    onResetView,
    }: MapControlsProps) => {
    return (
        <Paper
            elevation={4}
            sx={{
                position: 'absolute',
                top: { xs: 60, sm: 16 },
                right: 16,
                zIndex: 2,
                width: 200,
                p: 2,
                borderRadius: 2,
            }}
        >
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Управление картой
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                    variant={!is3D ? 'contained' : 'outlined'}
                    onClick={() => onModeChange(false)}
                    size="small"
                >
                    2D
                </Button>

                <Button
                    variant={is3D ? 'contained' : 'outlined'}
                    onClick={() => onModeChange(true)}
                    size="small"
                >
                    3D
                </Button>
            </Box>

            <Typography variant="body2">
                Наклон: {pitch}°
            </Typography>

            <Slider
                value={pitch}
                min={0}
                max={60}
                step={5}
                disabled={!is3D}
                onChange={(_, value) => onPitchChange(value as number)}
                valueLabelDisplay="auto"
                size="small"
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
                Поворот: {Math.round(bearing)}°
            </Typography>

            <Slider
                value={bearing}
                min={-180}
                max={180}
                step={5}
                disabled={!is3D}
                onChange={(_, value) => onBearingChange(value as number)}
                valueLabelDisplay="auto"
                size="small"
            />

            <Button
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                onClick={onResetView}
            >
                Сбросить вид
            </Button>
        </Paper>
    );
};