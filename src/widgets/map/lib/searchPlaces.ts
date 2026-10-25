
export type SearchPlace = {
    id: string;
    name: string;
    address: string;
    coordinates: [number, number];
};

type PhotonFeature = {
    geometry: {
        coordinates: [number, number];
    };
    properties: {
        osm_id?: number;
        name?: string;
        street?: string;
        housenumber?: string;
        city?: string;
        district?: string;
        country?: string;
    };
};

type PhotonResponse = {
    features: PhotonFeature[];
};

export const searchPlaces = async (
    query: string,
    signal?: AbortSignal,
): Promise<SearchPlace[]> => {
    const params = new URLSearchParams({
        q: query,
        lat: '42.8746',
        lon: '74.6122',
        limit: '5',
    });

    const response = await fetch(
        `https://photon.komoot.io/api/?${params}`,
        { signal },
    );

    if (!response.ok) {
        throw new Error('Ошибка поиска адресов');
    }

    const data: PhotonResponse = await response.json();

    return data.features.map((feature, index) => {
        const props = feature.properties;

        const street = [
            props.street,
            props.housenumber,
        ].filter(Boolean).join(', ');

        return {
            id: `${props.osm_id ?? 'place'}-${index}`,
            name: props.name || street || 'Без названия',
            address: [
                street,
                props.city || props.district,
                props.country,
            ].filter(Boolean).join(', '),
            coordinates: feature.geometry.coordinates,
        };
    });
};
