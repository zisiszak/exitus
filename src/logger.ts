export type GenericLogFunction = (data: any) => void;

export interface LogConfig {
	// [key: string]: GenericLogFunction;
}

export let logger: LogConfig = {};

export const setLogConfig = (
	config: LogConfig & {
		[key: string]: GenericLogFunction;
	},
) => (logger = { ...config });
