export const loadLayer = async (
    signal?: AbortSignal,
): Promise<void> => {
    await new Promise<void>((resolve, reject) => {
        const timeoutId = window.setTimeout(
            resolve,
            1000,
        );

        signal?.addEventListener(
            'abort',
            () => {
                window.clearTimeout(timeoutId);

                reject(
                    new DOMException(
                        'Request aborted',
                        'AbortError',
                    ),
                );
            },
            { once: true },
        );
    });

    if (Math.random() < 0.25) {
        throw new Error('Layer loading failed');
    }
};