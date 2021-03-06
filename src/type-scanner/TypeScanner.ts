import {
  ClassDeclaration,
  ClassDeclarationResolver,
  ConstructorParameter
} from '@rokkit.ts/class-declaration-resolver'
import { join } from 'path'

/**
 * @class TypeScanner
 * A class that uses the ClassDeclaration module of rokkit.ts and
 * provides the abilities to get relevant data from these declarations.
 */
class TypeScanner {
  public readonly DEFAULT_SOURCE_DIR = 'src'
  public readonly DEFAULT_OUT_DIR = 'build'
  public readonly DEFAULT_CONFIG_DIR = 'rokkit-declaration'
  public readonly DEFAULT_CONFIG_NAME = 'class-declarations.json'
  public readonly isProd: boolean = true
  private classDeclarations: ClassDeclaration[]

  constructor() {
    const sourceScanDir: string =
      process.env.SOURCE_DIR ?? this.DEFAULT_SOURCE_DIR
    const outDir = process.env.OUT_DIR ?? this.DEFAULT_OUT_DIR
    const configDir = process.env.CONFIG_DIR ?? this.DEFAULT_CONFIG_DIR

    const projectRootDir = '.'
    const environment: string | undefined = process.env.NODE_ENV

    if (environment !== 'production') {
      this.isProd = false
      ClassDeclarationResolver.createClassDeclarationFile(
        projectRootDir,
        sourceScanDir,
        configDir,
        this.DEFAULT_CONFIG_NAME,
        outDir
      )
    }

    this.classDeclarations = ClassDeclarationResolver.importClassDeclarationFromFile(
      join(projectRootDir, configDir, this.DEFAULT_CONFIG_NAME)
    )
  }

  /**
   * @function pathsOfUserComponents
   * Returns the import paths of the userComponents.
   * Dependening the env is returns the compiled paths or the source paths.
   * THIS FUNCTION WON'T STAY IN THIS PACKAGE! IT WILL BE REMOVED WITHIN THE NEXT VERSIONS.
   * @returns string[]
   */
  public pathsOfUserComponents(): string[] {
    return this.classDeclarations
      .map(classDeclaration =>
        this.isProd
          ? classDeclaration.compiledFilePath
          : classDeclaration.sourceFilePath
      )
      .filter(c => c !== undefined) as string[]
  }

  public injectorArgumentsFor(injectorname: string): ConstructorParameter[] {
    const classDeclaration = this.classDeclarations.find(
      declaration => declaration.classInformation.className === injectorname
    )

    if (!classDeclaration) {
      throw new Error(
        `Could not find any classDeclaration for the name ${injectorname}`
      )
    }

    classDeclaration.classInformation.constructors.sort((a, b) => {
      if (a.parameters.length > b.parameters.length) return 1
      if (a.parameters.length < b.parameters.length) return -1
      return 0
    })

    return classDeclaration.classInformation.constructors[0].parameters
  }
}

export const TypeScannerSingleton = new TypeScanner()
