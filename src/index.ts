import { errorKind, isError, newError } from 'error.js';

export type * as Exitus from './index.types.js';

export const exitus = Object.freeze({
	isError,
	newError,
	errorKind,
});

export { errorKind, isError, newError };
