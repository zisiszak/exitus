/* eslint-disable @typescript-eslint/ban-types */

export const exerrSym: unique symbol = Symbol('exitus-error');
export type exerrSym = typeof exerrSym;

export const genericExerrCode: unique symbol = Symbol('exitus:generic-exerr');
export type genericExerrCode = typeof genericExerrCode;

export type ExerrCode = string | number | symbol | genericExerrCode;

export interface Exerr<Code extends ExerrCode> {
	[exerrSym]: true;
	code: Code;
	message?: string;
	stack?: string;
	caughtException?: unknown;
	context?: Record<string, unknown>;
}

export type GenericExerr = Exerr<genericExerrCode>;

interface NewExerrProps<Code extends ExerrCode> {
	/**
	 * An identifiable error code
	 */
	code?: Code;

	/**
	 * ### debug: Message
	 * This is a debug message property. For most cases, use the payload property if you intend on showing error messages to users.
	 */
	message?: string;

	/**
	 * ### debug: Stack
	 * Set to `true` to generate a trace. Otherwise, a string can be provided directly. */
	stack?: boolean | string;

	/**
	 * ### debug: Caught exception
	 * The caught exception/error, if applicable. If it is a js `Error` type, it will be unwrapped and its property values will be used as fallbacks for the resultant `debug` object. */
	caughtException?: unknown;

	/**
	 * ### debug: context
	 * Context related to the error that may assist in debugging.
	 * Should not be used in handling errors. Use the `payload` property instead.
	 */
	context?: Record<string, unknown>;
}

/**
* ### Generic Errors - `GenericExerr`
*
* With no arguments provided, `exerr` will create a `GenericExerr`.
*
* @example
*
* ```ts
* const ohShucks = exerr() satisfies GenericExerr;
* ```
*
* ### Custom Error Codes
*
* @example
*
* ```ts
* const ohWhat = exerr({
*     // Can be a number, symbol or string
*     code: 'INESCAPABLE_DOOM',
* }) satisfies Exerr<"INESCAPABLE_DOOM">;
* ```
*
* ### Debugging Options
*
* Use these properties for assisting in debugging or internal logging.
*
* @example
* ```ts
* const ohBrother = exerr({
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

function _exerr<Code extends ExerrCode>(props: NewExerrProps<Code> & { code: Code }): Exerr<Code>;
function _exerr<Code extends genericExerrCode>(props?: NewExerrProps<Code>): GenericExerr;
function _exerr<Code extends ExerrCode>(
	code: Code,
	props?: Omit<NewExerrProps<never>, 'code'>,
): Exerr<Code>;
function _exerr<Code extends ExerrCode = genericExerrCode>(
	code_props: NewExerrProps<Code> | Code = genericExerrCode as Code,
	props_never?: Omit<NewExerrProps<never>, 'code'> | undefined,
	// { code, message, stack, caughtException, context }: CreateExerrProps<Code> = {},
) {
	const props =
		typeof code_props === 'object'
			? code_props
			: typeof props_never === 'object'
				? props_never
				: {};
	const { message, stack, caughtException, context } = props;
	const code: Code =
		typeof code_props === 'object'
			? typeof code_props.code !== 'undefined'
				? code_props.code
				: (genericExerrCode as Code)
			: typeof code_props !== 'undefined'
				? code_props
				: (genericExerrCode as Code);

	const exerr = {
		[exerrSym]: true,
		code: code,
		caughtException,
		message,
		context,
	} as Code extends genericExerrCode ? GenericExerr : Exerr<Code>;

	if (caughtException instanceof Error) {
		exerr.message ??= caughtException.message;
		if (caughtException.stack) exerr.stack ??= caughtException.stack;
	}

	if (stack === true && typeof exerr.stack === 'undefined')
		exerr.stack = (new Error().stack ?? '').split('\n').slice(2).join('\n').trim();

	return exerr;
}

export const exerr = _exerr;

export const isExerr = (value: unknown): value is Exerr<any> =>
	typeof value === 'object' && value !== null && (value as any)[exerrSym] === true;
