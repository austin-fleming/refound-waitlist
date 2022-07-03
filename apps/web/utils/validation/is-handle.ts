export const isHandle = (maybeHandle: string): boolean => {
	const rxIsHandle = /^[a-z0-9_-]{3,15}$/i;
	return rxIsHandle.test(maybeHandle);
};
