import { errorKind, isError, newError } from './error.js';
import { setLogConfig } from './logger.js';

export type {
	ErrorKind,
	ErrorSym,
	FsErrorKindSym,
	FsErrorPayload,
	GenericError,
	GenericErrorKindSym,
	GenericErrorPayload,
	ModelledError,
	ModelledErrorKindSym,
	NewErrorProps,
	ParamsErrorKindSym,
	ParamsErrorPayload,
	UnexpectedErrorKindSym,
	UnexpectedErrorPayload,
	UnknownErrorPayload,
	UnknownErrorSym,
} from './error.js';

export type { LogConfig } from './logger.js';

export { errorKind, isError, newError };

export const exitus = Object.freeze({
	isError,
	newError,
	errorKind,
	setLogConfig,
});
