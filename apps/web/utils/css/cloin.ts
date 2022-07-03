/**
 * Small utility for combining class names, removing anything falsy
 */
export const cloin = (...classes: Array<string | null | undefined | false>): string =>
	classes.filter((maybeClass) => !!maybeClass).join(" ");
