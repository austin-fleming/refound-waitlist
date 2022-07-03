export const isDate = (maybeDate: Date): boolean => {
	return maybeDate instanceof Date && !isNaN(maybeDate.getTime());
};
