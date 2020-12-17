import { Transform } from 'stream'
import { tsParser } from './assets/tsParser'
import Vinyl, { StreamFile } from 'vinyl'
import through from 'through2'
import { loadCompilerOptions, getConfig } from './assets/configManager'

type TsParser = () => void

interface SimpleTypescriptFunction extends TsParser {
    loadTsConfig: (tsConfig?:string) => TsParser
}

function simpleTypescript():Transform {
  const config = getConfig()

  if (!config) loadCompilerOptions()

  const transformStream = new Transform({ objectMode: true })

  transformStream._transform = (file:StreamFile, _encoding: string | undefined, callback) => {
    var error = null
    if (file.extname == '.ts') {
      file = tsParser(file, getConfig())
    }

    callback(error, file)
  }

  return transformStream
}

function loadTsConfig(path?:string):SimpleTypescriptFunction {
  loadCompilerOptions(path)
  return this
}

simpleTypescript.loadTsConfig = loadTsConfig.bind(simpleTypescript)
simpleTypescript.simpleTypescript = simpleTypescript

export = simpleTypescript