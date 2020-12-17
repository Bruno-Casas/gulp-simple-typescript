import { ModuleKind, ScriptTarget } from "typescript";

export enum Target {
    es3 = ScriptTarget.ES3,
    es5 = ScriptTarget.ES5,
    es2015 = ScriptTarget.ES2015,
    es2016 = ScriptTarget.ES2016,
    es2017 = ScriptTarget.ES2017,
    es2018 = ScriptTarget.ES2018,
    es2019 = ScriptTarget.ES2019,
    es2020 = ScriptTarget.ES2020,
    esnext = ScriptTarget.ESNext,
    json = ScriptTarget.JSON,
    latest = ScriptTarget.Latest
}

export enum Module {
    none = ModuleKind.None,
    commonjs = ModuleKind.CommonJS,
    amd = ModuleKind.AMD,
    umd = ModuleKind.UMD,
    system = ModuleKind.System,
    es2015 = ModuleKind.ES2015,
    es2020 = ModuleKind.ES2020,
    esNext = ModuleKind.ESNext
}