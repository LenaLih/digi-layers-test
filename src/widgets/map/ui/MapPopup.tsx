import { Paper, Typography } from '@mui/material';

type Props = {
    title: string;
    time: string;
    value: number;
};

export const MapPopup = ({
   title,
   time,
   value,
   }: Props) => {
    return (
        <Paper
            elevation={2}
            sx={{
                minWidth: 130,
                p: 1.5,
                borderRadius: 1,
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
            >
                {time}
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    mt: 0.5,
                    fontWeight: 500,
                }}
            >
                {title}
            </Typography>

            <Typography
                variant="body2"
                color="primary"
                sx={{mt: 0.5,}}
            >
                value: {value}
            </Typography>
        </Paper>
    );
};