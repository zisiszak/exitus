import { errorKind, isError, newError } from './error.js';
import { setLogConfig } from './logger.js';

export type {
	ErrorKind,
	FsErrorPayload,
	GenericError,
	GenericErrorPayload,
	ModelledError,
	ModelledErrorKindSym,
	NewErrorProps,
	ParamsErrorPayload,
	UnexpectedErrorPayload,
	UnknownErrorPayload,
	errorSym,
	fsErrorKindSym,
	genericErrorKindSym,
	paramsErrorKindSym,
	unexpectedErrorKindSym,
	unknownErrorKindSym,
} from './error.js';

export type { LogConfig } from './logger.js';

export { errorKind, isError, newError };

export const exitus = Object.freeze({
	isError,
	newError,
	errorKind,
	setLogConfig,
});
