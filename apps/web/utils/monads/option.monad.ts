export type Option<T> = Some<T> | None<T>;

export const some = <T>(value: T | undefined | null) =>
	value === undefined || value === null ? new None<T>() : new Some<T>(value);

export const none = <T = any>() => new None<T>();

export interface MatchOption<T, U> {
	some: (value: T) => U;
	none: () => U;
}

class Some<T> {
	constructor(private readonly _value: T) {}

	public isSome(): boolean {
		return true;
	}

	public isNone(): boolean {
		return false;
	}

	public map<U>(fn: (value: T) => U): Some<U> {
		return new Some(fn(this._value));
	}

	public andThen<U>(fn: (value: T) => Option<U>): Option<U> {
		return fn(this._value);
	}

	public or<U>(_: Option<U>): Option<T> {
		return new Some(this._value);
	}

	public and<U>(fallback: Option<U>): Option<U> {
		return fallback;
	}

	public unwrapOr(_: T): T {
		return this._value;
	}

	public unwrap(): T {
		return this._value;
	}

	public match<U>(matchFn: MatchOption<T, U>): U {
		return matchFn.some(this._value);
	}
}

class None<T> {
	constructor() {}

	public isSome(): boolean {
		return false;
	}

	public isNone(): boolean {
		return true;
	}

	public map<U>(_: (value: T) => U): None<U> {
		return new None<U>();
	}

	public andThen<U>(_: (value: T) => Option<U>): None<U> {
		return new None<U>();
	}

	public or<U>(fallback: Option<U>): Option<U> {
		return fallback;
	}

	public and<U>(_: Option<U>): None<U> {
		return new None<U>();
	}

	public unwrapOr(fallback: T): T {
		if (fallback == null) throw new Error("Cannot call unwrapOr on None without a fallback value.");

		return fallback;
	}

	public unwrap(): never {
		throw new ReferenceError("Cannot unwrap the value of None.");
	}

	public match<U>(matchFn: MatchOption<T, U>): U {
		return matchFn.none();
	}
}
