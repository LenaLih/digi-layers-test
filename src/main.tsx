import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {LayerStoreProvider} from "./entities/layer/model/layerStore.ts";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LayerStoreProvider>
            <App />
        </LayerStoreProvider>
    </StrictMode>,
);
