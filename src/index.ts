import { Transform } from 'stream'
import { tsParser } from './assets/parser'
import { StreamFile } from 'vinyl'
import through from 'through2'
import { loadCompilerOptions, getConfig } from './assets/configManager'

type TsParser = () => void

interface SimpleTypescriptFunction extends TsParser {
    loadTsConfig: (tsConfig?:string) => TsParser
}

function simpleTypescript():Transform {
  const config = getConfig()

  if (!config) loadCompilerOptions()

  return through.obj((file:StreamFile, _encoding: string | undefined, callback) => {
    const err = null
    if (file.extname == '.ts') {
      file = tsParser(file)
    }
    callback(err, file)
  })
}

function loadTsConfig(path?:string):SimpleTypescriptFunction {
  loadCompilerOptions(path)
  return this
}

simpleTypescript.loadTsConfig = loadTsConfig.bind(simpleTypescript)
simpleTypescript.simpleTypescript = simpleTypescript

export = simpleTypescript