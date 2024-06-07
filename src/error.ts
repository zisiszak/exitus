/* eslint-disable @typescript-eslint/ban-types */
import { type Dirent, type PathLike } from 'fs';
import { logger, type LogLevel } from './logger.js';

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
		logged?: boolean;

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

export type GenericError<CustomPayload = Record<string, never>> = ModelledError<
	GenericErrorKindSym,
	CustomPayload & GenericErrorPayload
>;

export interface NewErrorProps<Kind extends ErrorKind, Payload> {
	readonly kind?: Kind;

	readonly payload?: Payload;

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

	log?: boolean | LogLevel;
}

export type NewError = <Kind extends ErrorKind = GenericErrorKindSym, CustomPayload = {}>(
	props?: NewErrorProps<
		Kind,
		(Kind extends ModelledErrorKindSym ? MappedPayload<Kind> : {}) & CustomPayload
	>,
) => Kind extends ModelledErrorKindSym
	? ModelledError<Kind, MappedPayload<Kind> & CustomPayload>
	: ErrorBase<Kind, CustomPayload>;

/**
* ### Generic Errors
*
* With no arguments provided, `newError` will create a `GenericError`.
* You can also call `newError` using the property defined on the `exitus` export.
*
* @example
*
* ```ts
* const ohShucks = newError() satisfies Exitus.GenericError;
* ```
*
* ### Custom Payloads
*
* An example of a `GenericError` with a custom payload:
*
* @example
*
* ```ts
* const ohSnap = exitus.newError({
*     payload: {
*         whyItFailed: 'skill issue',
*     },
* }) satisfies Exitus.GenericError<{
*     whyItFailed: string;
* }>;
* ```
*
* ### Pre-Modelled Error Kinds
*
* A few pre-modelled error kinds are included, and come with their own specific payload properties (optional).
*
* To specify a pre-modelled error type, assign the `kind` property to one of the symbols in `exitus.errorKind`.
*
* @example
*
* ```ts
* const ohNo = exitus.newError({
*     kind: exitus.errorKind.fs,
*     payload: {
*         file: "some/path/to/a/file",
*         files: ["some/path/elsewhere", "another/path/elsewhere"]
*         // Custom properties can still be included.
*         howItFailed: "I dunno",
*     }
* }) satisfies Exitus.ModelledError<typeof fsErrorKindSym, FsErrorPayload & {
*     howItFailed: string;
* }>;
* ```
*
* ### Custom Error Kinds
*
* @example
*
* ```ts
* const ohWhat = exitus.newError({
*     // Can be a number, symbol or string
*     kind: 'INESCAPABLE_DOOM',
*     payload: {
*         theEndIsNear: true,
*     },
* }) satisfies Exitus.ModelledError<"INESCAPABLE_DOOM", {
*     theEndIsNear: boolean;
* }>;
* ```
*
* ### Debugging Options
*
* Use these properties for assisting in debugging or internal logging.
*
* @example
* ```ts
* const ohBrother = exitus.newError({
*    message: "'... I bet <insert framework of choice> doesn't have these issues.'",
*    caughtException: new Error(),
*    context: {
*        someInput: 4124309184571,
*        someOutput: "pi == 4",
*    },
*    stack: true,
* });
```
 */
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
	log = false,
}: NewErrorProps<
	Kind,
	(Kind extends ModelledErrorKindSym ? MappedPayload<Kind> : {}) & CustomPayload
> = {}): Kind extends ModelledErrorKindSym
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
		!!context
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

	if (log) {
		(newError.debug ??= {}).logged = false;
		if (log === true) {
			if ('error' in logger) {
				logger.error(newError);
				newError.debug.logged = true;
			} else {
				console.warn(
					`exitus: A function for the default error logger (key: 'error') is not defined.`,
				);
			}
		} else if (typeof log === 'string') {
			if (log in logger) {
				logger[log](newError);
				newError.debug.logged = true;
			} else {
				console.warn(
					`exitus: The 'log' level provided does not have a matching logging function defined.`,
				);
			}
		} else {
			console.warn(
				`exitus: The NewError 'log' property value must be a string, boolean, or undefined.`,
			);
		}
	}

	return newError;
};

export const isError = (value: unknown): value is ErrorBase<any, any> =>
	typeof value === 'object' && value !== null && (value as any)[errorSym] === true;
