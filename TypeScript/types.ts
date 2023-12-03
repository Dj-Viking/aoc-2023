declare global {
    interface ObjectConstructor {
        keys<O extends object>(o: O): Array<keyof O>;
        values<O extends object>(o: O): Array<O[keyof O]>;
    }
    interface ProcessEnv {
        INPUTFILE: string;
    }
}
export {};
