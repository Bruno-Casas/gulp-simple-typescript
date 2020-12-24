import { CompilerOptions } from "typescript";
import { StreamFile } from "vinyl";
import { getConfig } from "./configManager";
import { replace } from "./replace";
import { transpile } from "./transpiler";

var compilerOptions: CompilerOptions;

export function tsParser(file: StreamFile) {
  compilerOptions = getConfig()

  file.contents = transpile(replace(file, compilerOptions.paths), compilerOptions)
  file.extname = '.js'
  return file
}
