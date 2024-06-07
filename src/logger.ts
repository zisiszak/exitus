type GenericLogFunction = (data: any) => void;

export type LogLevel = 'warn' | 'info' | 'debug' | 'trace' | 'error' | 'fatal';
export type LogConfig = {
	[K in LogLevel]: GenericLogFunction;
};

export let logger: LogConfig = {
	warn: console.warn,
	info: console.info,
	debug: console.debug,
	trace: console.trace,
	error: console.error,
	fatal: console.error,
};

export const setLogConfig = (config: LogConfig) => (logger = { ...config });
