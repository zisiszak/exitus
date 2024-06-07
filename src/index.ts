import { setLogConfig } from 'logger.js';
import { errorKind, isError, newError } from './error.js';

export type * as Exitus from './index.types.js';

export { errorKind, isError, newError };

export const exitus = Object.freeze({
	isError,
	newError,
	errorKind,
	setLogConfig,
});
