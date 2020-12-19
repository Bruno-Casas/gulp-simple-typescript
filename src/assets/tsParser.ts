import { dirname, relative, resolve } from "path";
import { CompilerOptions, transpileModule } from "typescript";
import { StreamFile } from "vinyl";
import { getConfig } from "./configManager";
import makeReplacements from 'replace-in-file/lib/helpers/make-replacements'
import { Readable } from "stream";

var compilerOptions: CompilerOptions;

function replaceString(file: StreamFile) {
  return (match: string) => {
    let replacePath = compilerOptions.paths[match][0]
    
    replacePath = relative(
      dirname(file.path),
      resolve(file.cwd, replacePath)
    )
    const prefix = /\.|\//.test(replacePath.charAt(0)) ? '' : './'

    return `${prefix}${replacePath}`
  }
}

export function tsParser(file: StreamFile, tsConfig: CompilerOptions) {
  compilerOptions = getConfig()
  
  const replaceOption = {
    from: Object.keys(compilerOptions.paths).map(alias => new RegExp(`(?<=(require *\\(|import *\\(|from *)['"])${alias}(?=['"/])`, 'g')),
    to: replaceString(file)
  }
  const [, result] = makeReplacements(file.contents.toString(), replaceOption.from, replaceOption.to, file.path, false)

  const { outputText: javascript } = transpileModule(result, {
    compilerOptions: tsConfig,
    reportDiagnostics: true
  })

  file.contents = Readable.from(javascript)
  file.extname = '.js'
  return file
}
