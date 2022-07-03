import type { Option } from "./option.monad";
import { none, some } from "./option.monad";

export type Result<T, E = Error> = Ok<T, E> | Fail<T, E>;

export const ok = <T, E>(value: T) => new Ok<T, E>(value);
export const fail = <T, E>(err: E) => new Fail<T, E>(err);

export interface MatchResult<T, E, U> {
	ok: (value: T) => U;
	fail: (value: E) => U;
}

class Ok<T, E = never> {
	constructor(private readonly _value: T) {}

	public isOk(): this is Ok<T, E> {
		return true;
	}

	public isFail(): this is Fail<T, E> {
		return false;
	}

	/**
	 * converts result into a Option, discarding Fail value, if any.
	 */
	public ok(): Option<T> {
		return some(this._value);
	}

	/**
	 * Converts result into an Option, discarding Ok value, if any.
	 */
	public fail(): Option<E> {
		return none<E>();
	}

	/**
	 * !!unsafe
	 * Either unwraps Ok value,
	 * or throws a reference error if Result is Fail
	 * Consider using match instead.
	 */
	public unsafeUnwrap(): T {
		return this._value;
	}

	/**
	 * !!unsafe
	 * Either throws a reference error if Result is Ok
	 * or unwraps Fail value.
	 * Consider using match instead.
	 */
	public unsafeUnwrapFail(): never {
		throw new ReferenceError("Cannot unwrap error of Ok value. Use 'unwrap' instead.");
	}

	/**
	 * Either unwraps Ok value,
	 * or returns the provided fallback value
	 */
	public unwrapOr(_: T): T {
		return this._value;
	}

	/**
	 * Either unwraps Ok value,
	 * or applies a function to Fail
	 */
	public unwrapOrElse(_: (err: E) => T): T {
		return this._value;
	}

	/**
	 * Either applies a function to Ok value,
	 * or skips if Fail value
	 */
	public map<U>(fn: (value: T) => U): Ok<U, never> {
		return new Ok(fn(this._value));
	}

	/**
	 * Either applies a function to Fail value,
	 * or skips if Ok value
	 */
	public mapFail<U>(_: (err: E) => U): Ok<T, never> {
		return new Ok(this._value);
	}

	/**
	 * Similar to Result.map, but for when the applied function returns a Result.
	 */
	public andThen<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
		return fn(this._value);
	}

	public orElse<U>(_: (err: E) => Result<U, E>): Ok<T, E> {
		return new Ok(this._value);
	}

	public match<U>(matchFn: MatchResult<T, never, U>): U {
		return matchFn.ok(this._value);
	}
}

class Fail<T, E> {
	constructor(private readonly _err: E) {}

	public isOk(): this is Ok<T, E> {
		return false;
	}

	public isFail(): this is Fail<T, E> {
		return true;
	}

	public ok(): Option<T> {
		return none<T>();
	}

	public fail(): Option<E> {
		return some<E>(this._err);
	}

	public unsafeUnwrap(): never {
		throw new ReferenceError(
			"Cannot unwrap the value of an error result. Use 'unwrapError' instead.",
		);
	}

	public unsafeUnwrapFail() {
		return this._err;
	}

	public unwrapOr(fallbackValue: T): T {
		return fallbackValue;
	}

	public unwrapOrElse(fn: (err: E) => T): T {
		return fn(this._err);
	}

	public map<U>(_: (_: T) => U): Fail<never, E> {
		return new Fail<never, E>(this._err);
	}

	public mapFail<U>(fn: (err: E) => U): Fail<never, U> {
		return new Fail(fn(this._err));
	}

	public andThen<U>(_: (value: T) => Result<U, E>): Result<U, E> {
		return new Fail<never, E>(this._err);
	}

	public orElse<U>(fn: (err: E) => Result<U, E>): Result<U, E> {
		return fn(this._err);
	}

	public match<U>(matchFn: MatchResult<never, E, U>): U {
		return matchFn.fail(this._err);
	}
}
