
import { useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from '@mui/material';

import {
    searchPlaces,
    type SearchPlace,
} from '../lib/searchPlaces.ts';

type MapSearchProps = {
    onSelect: (place: SearchPlace) => void;
};

export const MapSearch = ({ onSelect }: MapSearchProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchPlace[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const controllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => controllerRef.current?.abort();
    }, []);

    const handleSearch = async () => {
        if (query.trim().length < 3) return;

        controllerRef.current?.abort();

        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        setError('');
        setResults([]);

        try {
            const places = await searchPlaces(
                query.trim(),
                controller.signal,
            );

            if (!controller.signal.aborted) {
                setResults(places);
            }
        } catch {
            if (!controller.signal.aborted) {
                setError('Не удалось выполнить поиск');
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    };

    return (
        <Paper
            elevation={4}
            sx={{
                position: 'absolute',
                top: { xs: 60, sm: 16 },
                left: 16,
                zIndex: 3,
                width: 'min(320px, calc(100% - 32px))',
                p: 2,
                borderRadius: 2,
            }}
        >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Поиск на карте
            </Typography>

            <Box
                component="form"
                onSubmit={(event) => {
                    event.preventDefault();
                    void handleSearch();
                }}
                sx={{ display: 'flex', gap: 1 }}
            >
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Улица, адрес, объект"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || query.trim().length < 3}
                >
                    Найти
                </Button>
            </Box>

            {loading && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            )}

            {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}

            {!loading && !error && results.length === 0 &&
                query.trim().length >= 3 && (
                    <Typography variant="caption" color="text.secondary">
                        Введите адрес и нажмите «Найти»
                    </Typography>
                )}

            {results.length > 0 && (
                <List dense sx={{ maxHeight: 240, overflowY: 'auto' }}>
                    {results.map((place) => (
                        <ListItemButton
                            key={place.id}
                            onClick={() => {
                                onSelect(place);
                                setQuery(place.name);
                                setResults([]);
                            }}
                        >
                            <ListItemText
                                primary={place.name}
                                secondary={place.address}
                            />
                        </ListItemButton>
                    ))}
                </List>
            )}
        </Paper>
    );
};
