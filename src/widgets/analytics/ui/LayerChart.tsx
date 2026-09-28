import { Box, Typography } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
} from 'recharts';
import {
    useLayerStoreSelector,
} from '../../../entities/layer/model/layerStore.ts';
import {
    type LayerId,
    type Time,
    TIME_POINTS,
} from '../../../entities/layer/model/layerTypes.ts';
import { useLayerActions } from '../../../features/layer-control/model/useLayerActions.ts';

type Props = {
    layerId: LayerId;
};

export const LayerChart = ({
                               layerId,
                           }: Props) => {
    const selectedTime = useLayerStoreSelector(
        (state) => state.selectedTime,
    );

    const chartData = useLayerStoreSelector(
        (state) => state.seriesById[layerId],
    );

    const layerTitle = useLayerStoreSelector(
        (state) => state.layersById[layerId]?.title,
    );

    const { changeTime } = useLayerActions();

    return (
        <Box
            sx={{
                width: '100%',
                height: 300,
            }}
        >
            <Typography
                variant="subtitle1"
                sx={{
                    mb: 1.5,
                    fontWeight: 600,
                }}
            >
                {layerTitle}
            </Typography>

            <ResponsiveContainer
                width="100%"
                height="90%"
            >
                <LineChart
                    data={chartData}
                    onClick={(state) => {
                        const time = state?.activeLabel;

                        if (
                            typeof time === 'string' &&
                            TIME_POINTS.some(
                                (item) => item === time,
                            )
                        ) {
                            void changeTime(time as Time);
                        }
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="time" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="value"
                        strokeWidth={2}
                    />

                    <ReferenceLine
                        x={selectedTime}
                        strokeDasharray="4 4"
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};