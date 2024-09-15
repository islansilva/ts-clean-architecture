export type MapperFunction<I, O> = (input: I) => O;


export default class OutputMapper<I ,O> {

    private _mapperFunction: MapperFunction<I, O>;

    public set mapperFunction(value: MapperFunction<I, O>) {
        this._mapperFunction = value;
    }

    inputListToMapperOutputList(input: I[]): O[] {
        if(this._mapperFunction === undefined)
            throw new Error("The mapper function has not been defined")

        return input.map(this._mapperFunction);
    }
    
}