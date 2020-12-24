import { CompilerOptions, transpileModule } from "typescript";
import { getConfig } from "./configManager";
import { Readable } from "stream";

export function transpile(code: string, compilerOptions: CompilerOptions) {
  compilerOptions = getConfig()

  const { outputText: javascript } = transpileModule(code, {
    compilerOptions,
    reportDiagnostics: true
  })

  return Readable.from(javascript)
}
