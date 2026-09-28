import { Box, Button } from '@mui/material';

import {
    useLayerStoreSelector,
} from '../../entities/layer/model/layerStore.ts';

import {
    TIME_POINTS,
} from '../../entities/layer/model/layerTypes.ts';

import { useLayerActions } from '../layer-control/model/useLayerActions.ts';

export const Timeline = () => {
    const selectedTime = useLayerStoreSelector(
        (state) => state.selectedTime,
    );

    const { changeTime } = useLayerActions();

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                mb: 3,
            }}
        >
            {TIME_POINTS.map((time) => (
                <Button
                    key={time}
                    type="button"
                    variant={
                        selectedTime === time
                            ? 'contained'
                            : 'outlined'
                    }
                    onClick={() => {
                        void changeTime(time);
                    }}
                >
                    {time}
                </Button>
            ))}
        </Box>
    );
};