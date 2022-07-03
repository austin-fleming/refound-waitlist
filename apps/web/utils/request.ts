import { Option, some } from "./monads/option.monad";
import type { Result } from "./monads/result.monad";
import { fail, ok } from "./monads/result.monad";

export const request = async <T>(url: string): Promise<Result<T>> =>
	fetch(url)
		.then((response) => response.json())
		.then((data) => ok<T, Error>(data as T))
		.catch((err) => fail<T, Error>(err));
