import { dirname, relative, resolve } from "path";
import { MapLike } from "typescript";
import { StreamFile } from "vinyl";
import makeReplacements from 'replace-in-file/lib/helpers/make-replacements'

export function replace(file: StreamFile, paths: MapLike<string[]>) {
  const from = Object.keys(paths).map(buildReplaceRegExp)
  const to = buildReplacePathFunction(file, paths)
  
  const [, result] = makeReplacements(file.contents.toString(), from, to, file.path, false)
  return result
}

function buildReplaceRegExp(targetPath:string) {
    return new RegExp(`(?<=(require *\\(|import *\\(|from *)['"])${targetPath}(?=['"/])`, 'g')
}

function buildReplacePathFunction(file:StreamFile, paths:MapLike<string[]>) {
  return (match: string) => {
    let replacePath = paths[match][0]
    
    replacePath = relative(
      dirname(file.path),
      resolve(file.cwd, replacePath)
    )
    const prefix = /\.|\//.test(replacePath.charAt(0)) ? '' : './'

    return `${prefix}${replacePath}`
  }
}
