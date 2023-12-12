declare global {
	type Tuple<First, Second> = [First, Second];
	interface ObjectConstructor {
		keys<O extends object>(o: O): Array<keyof O>;
		values<O extends object>(o: O): Array<O[keyof O]>;
		entries<O extends object>(o: O): Array<Tuple<keyof O, O[keyof O]>>;
	}
	namespace NodeJS {
		interface ProcessEnv {
			INPUTFILE: string;
		}
	}
}
export {};
