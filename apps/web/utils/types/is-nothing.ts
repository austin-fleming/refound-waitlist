export type Nothing = null | undefined;

export const isNothing = (value: unknown): value is Nothing =>
	value === undefined || value === null;

export const isSomething = (value: unknown) => !isNothing(value);

export const isBoolean = (value: unknown): value is boolean => value === true || value === false;
