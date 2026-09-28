import type {LayerId, Time} from "./layerTypes.ts";

export const LAYER_VALUES: Record<
    LayerId,
    Record<Time, number>
> = {
    temperature: {'10:00': 20, '11:00': 22, '12:00': 25, '13:00': 27, '14:00': 26,},
    wind: {'10:00': 3, '11:00': 4, '12:00': 6, '13:00': 7, '14:00': 5,},
    insolation: {'10:00': 300, '11:00': 450, '12:00': 600, '13:00': 720, '14:00': 650,},
};