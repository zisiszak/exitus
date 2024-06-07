/* eslint-disable @typescript-eslint/ban-types */
import { type Dirent, type PathLike } from 'fs';

export const errorSym: unique symbol = Symbol('exitus-error');
export type ErrorSym = typeof errorSym;

// ERROR MODELS

// Unexpected Error
export const unexpectedErrorKindSym: unique symbol = Symbol('exitus-error:unexpected');
export type UnexpectedErrorKindSym = typeof unexpectedErrorKindSym;

// Unknown Error
export const unknownErrorKindSym: unique symbol = Symbol('exitus-error:unknown');
export type UnknownErrorSym = typeof unknownErrorKindSym;

// Generic Error
export const genericErrorKindSym: unique symbol = Symbol('exitus-error:generic');
export type GenericErrorKindSym = typeof genericErrorKindSym;

// FileSystem Error
export const fsErrorKindSym: unique symbol = Symbol('exitus-error:fs');
export type FsErrorKindSym = typeof fsErrorKindSym;

// Parameters Error
export const paramsErrorKindSym: unique symbol = Symbol('exitus-error:params');
export type ParamsErrorKindSym = typeof paramsErrorKindSym;

export const errorKind = {
	fs: fsErrorKindSym,
	generic: genericErrorKindSym,
	unknown: unknownErrorKindSym,
	unexpected: unexpectedErrorKindSym,
	params: paramsErrorKindSym,
} as const;

export type ModelledErrorKindSym =
	| UnexpectedErrorKindSym
	| GenericErrorKindSym
	| FsErrorKindSym
	| ParamsErrorKindSym;

export type ErrorKind = ModelledErrorKindSym | string | number | symbol;

export type ErrorBase<Kind extends ErrorKind, Payload> = {
	[errorSym]: true;

	kind: Kind;

	payload: Payload;

	debug?: {
		message?: string;

		stack?: string;

		caughtException?: unknown;

		context?: Record<string, unknown>;
	};
};

export interface GenericErrorPayload {}
export interface UnknownErrorPayload {}
export interface UnexpectedErrorPayload {}
export interface FsErrorPayload {
	file?: Dirent | PathLike;
	files?: Dirent[] | PathLike[];
}
export interface ParamsErrorPayload<ParamRef extends string = string> {
	invalidParam?: ParamRef;
	invalidParams?: ParamRef[];
}

type MappedPayload<Kind extends ModelledErrorKindSym> = {
	[genericErrorKindSym]: GenericErrorPayload;
	[unknownErrorKindSym]: UnknownErrorPayload;
	[unexpectedErrorKindSym]: UnexpectedErrorPayload;
	[fsErrorKindSym]: FsErrorPayload;
	[paramsErrorKindSym]: ParamsErrorPayload;
}[Kind];

export type ModelledError<
	Kind extends ModelledErrorKindSym,
	Payload extends MappedPayload<Kind>,
> = ErrorBase<Kind, Payload>;

export type GenericError<CustomPayload = {}> = ModelledError<
	GenericErrorKindSym,
	CustomPayload & GenericErrorPayload
>;

export interface NewErrorProps<Kind extends ErrorKind, Payload> {
	kind?: Kind;

	payload?: Payload;

	// Debug properties. If any are defined, the debug property on the ExitusError will not be null.

	/**
	 * ### debug: message
	 * This is a debug message property. For most cases, use the payload property if you intend on showing error messages to users.
	 */
	message?: string;

	/**
	 * ### debug: stack
	 * Set to `true` to generate a trace. Otherwise, a string can be provided directly. */
	stack?: boolean | string;

	/**
	 * ### debug: caughtException
	 * The caught exception/error, if applicable. If it is a js `Error` type, it will be unwrapped and its property values will be used as fallbacks for the resultant `debug` object. */
	caughtException?: unknown;

	/**
	 * ### debug: context
	 * Context related to the error that may assist in debugging.
	 * Should not be used in handling errors. Use the `payload` property instead.
	 */
	context?: Record<string, unknown>;
}

export type NewError = {
	<Kind extends ErrorKind = GenericErrorKindSym, CustomPayload = {}>({
		kind,
		payload,
		message,
		stack,
		caughtException,
		context,
	}: NewErrorProps<
		Kind,
		(Kind extends ModelledErrorKindSym ? MappedPayload<Kind> : {}) & CustomPayload
	>): Kind extends ModelledErrorKindSym
		? ModelledError<Kind, MappedPayload<Kind> & CustomPayload>
		: ErrorBase<Kind, CustomPayload>;
};

export const newError: NewError = <
	Kind extends ErrorKind = GenericErrorKindSym,
	CustomPayload = {},
>({
	kind,
	payload,
	message,
	stack,
	caughtException,
	context,
}: NewErrorProps<
	Kind,
	(Kind extends ModelledErrorKindSym ? MappedPayload<Kind> : {}) & CustomPayload
>): Kind extends ModelledErrorKindSym
	? ModelledError<Kind, MappedPayload<Kind> & CustomPayload>
	: ErrorBase<Kind, CustomPayload> => {
	const newError = {
		[errorSym]: true,
		kind: kind,
		payload: payload,
	} as Kind extends ModelledErrorKindSym
		? ModelledError<Kind, MappedPayload<Kind> & CustomPayload>
		: ErrorBase<Kind, CustomPayload>;

	if (
		caughtException ||
		typeof message === 'string' ||
		stack === true ||
		typeof stack === 'string' ||
		context
	) {
		if (caughtException && caughtException instanceof Error) {
			message ??= caughtException.message;
			stack ??= caughtException.stack;
		}

		if (stack === true) {
			stack = (new Error().stack ?? '').split('\n').slice(2).join('\n').trim();
		} else if (stack === false) {
			stack = undefined;
		}

		newError.debug = {
			caughtException,
			context,
			message,
			stack,
		};
	}

	return newError;
};

export const isError = (value: unknown): value is ErrorBase<any, any> =>
	typeof value === 'object' && value !== null && (value as any)[errorSym] === true;
