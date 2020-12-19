import { resolve } from 'path'
import ts, { CompilerOptions, CompilerOptionsValue, isFunctionExpression, ScriptTarget } from 'typescript'
import { Module, Target } from '../definitions/gulpSimpleTypescript'

let tsConfig:CompilerOptions

interface tsConfigFile extends Omit<CompilerOptions, 'target' | 'module'> {
    target:string,
    module:string,
    paths: ts.MapLike<string[]>
}

function parseConfig(config:tsConfigFile) {
    const parsedConfig:CompilerOptions = config as Omit<tsConfigFile, 'target' | 'module'>
    
    parsedConfig.target = Target[config.target]
    parsedConfig.module = Module[config.module]
    parsedConfig.lib = parsedConfig.lib.map(lib => `lib.${lib}.full.d.ts`)
    parsedConfig.paths = preparePaths(config.paths)

    return parsedConfig
}

function preparePaths(paths: ts.MapLike<string[]>) {
    const pathsObj:ts.MapLike<string[]> = {}

    const keys = Object.keys(paths).map(path => path.replace('/*', ''))
    const values = Object.values(paths)

    keys.forEach((key, i) => {
        pathsObj[key] = values[i].map(value => value.replace('/*', ''))
    })

    return pathsObj
}

export function getConfig() {
    return tsConfig
}

export function loadCompilerOptions(path?:string) {
    const fullPath = resolve(process.cwd(), path || 'tsconfig.json')

    tsConfig = parseConfig(require(fullPath).compilerOptions)
}
