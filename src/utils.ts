/** Does not work for property names with a `.` */
export type ObjectPropertyPath<
	Name extends string | number,
	Obj extends Record<string, unknown>,
> = `${Name}.${keyof Obj extends infer Key
	? Key extends keyof Obj & (string | number)
		? Obj[Key] extends Record<string, unknown>
			? ObjectPropertyPath<Key, Obj[Key]> | Key
			: Key
		: never
	: never}`;
