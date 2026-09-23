import { Box } from '@mui/material';
import { LayersPanel } from './widgets/layers-panel/ui/LayersPanel.tsx';

function App() {
    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f7f8fa',
                px: {
                    xs: 2,
                    sm: 3,
                },
                py: {
                    xs: 3,
                    sm: 4,
                },
                boxSizing: 'border-box',
            }}
        >
            <LayersPanel />
        </Box>
    );
}

export default App;