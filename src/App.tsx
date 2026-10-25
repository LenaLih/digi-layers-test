import { Box } from '@mui/material';

import { Timeline } from './features/ui/Timeline.tsx';
import { AnalyticsPanel } from './widgets/analytics/ui/AnalyticsPanel.tsx';
import { LayersPanel } from './widgets/layers-panel/ui/LayersPanel.tsx';
import { ViewMap } from './widgets/map/ui/ViewMap.tsx';

import './App.css';

function App() {
    return (
        <Box
            component="main"
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f7f8fa',
                px: {xs: 2, sm: 3,},
                py: {xs: 3, sm: 4,},
                boxSizing: 'border-box',
            }}
        >
            <Timeline />
            <ViewMap />
            <AnalyticsPanel />
            <LayersPanel />
        </Box>
    );
}

export default App;