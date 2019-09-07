import {
  ClassDeclaration,
  ClassDeclarationResolver,
  ConstructorDeclaration,
  ConstructorParameter
} from "@rokkit.ts/class-declaration-resolver";
import * as path from "path";
import dependencyInjectionAssembler from "../dependency-injection-assembler/dependencyInjectionAssembler";
import { InjectorConstructorArgument } from "../injector";

/**
 * @class AutoClassDeclaration
 * Class that resolve the classDeclaration of the project source directory.
 * The default source code directory is './src'.
 * To change the default directory, you have to set the environment variable SRC_SCAN_DIR to the project path.
 * The environment variable must be set before the start of the application!
 */
class AutoClassDeclaration {
  // TODO test multiple paths for src directory if possible!
  public readonly DEFAULT_SCAN_PATH = "./src";
  private classDeclarations: ClassDeclaration[];

  constructor() {
    const sourceScanDir: string | undefined = process.env.SRC_SCAN_DIR;
    if (sourceScanDir) {
      this.classDeclarations = ClassDeclarationResolver.createClassDeclarations(
        sourceScanDir
      );
    } else {
      this.classDeclarations = ClassDeclarationResolver.createClassDeclarations(
        this.DEFAULT_SCAN_PATH
      );
    }
  }

  /**
   * Accessor for all ClassDeclarations scanned in the source directory.
   * You should obviously use the get Methods to receive a specific ClassDeclaration instead of all.
   * @return ReadonlyArray<ClassDeclaration>
   */
  public get ClassDeclarations(): ReadonlyArray<ClassDeclaration> {
    return this.classDeclarations;
  }

  /**
   * Gets a classDeclaration by a className. Returns a ClassDeclaration or undefined if no
   * classDeclaration is found for the provided argument.
   * @param className
   * @return ClassDeclaration | undefined
   */
  public getClassDeclarationByClassName(
    className: string
  ): ClassDeclaration | undefined {
    return this.classDeclarations.find(
      classDeclaration =>
        classDeclaration.classInformation.className === className
    );
  }

  /**
   * Gets a classDeclaration by a fileName and a className. Returns a ClassDeclaration or undefined if no
   * classDeclaration is found for the provided arguments.
   * @param fileName string of the file path to the specific searched class.
   * @param className string of the className of the specific searched class.
   * @return ClassDeclaration | undefined
   */
  public getClassDeclarationByFileAndClassName(
    fileName: string,
    className: string
  ): ClassDeclaration | undefined {
    return this.classDeclarations.find(classDeclaration => {
      return (
        path.normalize(classDeclaration.filePath) ===
          path.normalize(fileName) &&
        classDeclaration.classInformation.className === className
      );
    });
  }

  /**
   * Scans a new sourceScanDirectory and updates the classDeclarations instance of this class.
   * These updated classDeclarations will be used by all all components.
   * @param sourceScanDirectory - directory path of the source code files.
   */
  public createNewClassDeclarations(sourceScanDirectory: string): void {
    this.classDeclarations = ClassDeclarationResolver.createClassDeclarations(
      sourceScanDirectory
    );
    this.updateInjectors();
  }

  /**
   * Maps classDeclaration parameters with decorated arguments and returns a unified array of InjectorConstructorArgument[]
   * @param newArgs ConstructorParameter array from a classDeclaration
   * @param oldArgs InjectorConstructorArgument from the injected object. There can be missing parameters in the
   * decorated array, these will be filled with the classDecoration parameters.
   * @return InjectorConstructorArgument[] of all unified arguments and parameters.
   */
  public mapOldToNewCtorArguments(
    newArgs: ConstructorParameter[],
    oldArgs: InjectorConstructorArgument[]
  ): InjectorConstructorArgument[] {
    return newArgs.map((parameter, index) => {
      const oldArg = oldArgs.find(arg => arg.index === index);
      return {
        index,
        type: parameter.type,
        value: oldArg ? oldArg.value : undefined
      };
    });
  }

  /**
   * Sorting function for the constructor signatures, the constructor will be sorted by the lenght of its paramters.
   * The constructor with the most parameters will come at first in the array.
   * @param current
   * @param next
   * @return number
   */
  public sortClassConstructorDeclarations(
    current: ConstructorDeclaration,
    next: ConstructorDeclaration
  ): number {
    if (current.parameters.length > next.parameters.length) return 1;
    if (current.parameters.length < next.parameters.length) return -1;
    return 0;
  }

  private updateInjectors(): void {
    this.ClassDeclarations.forEach(this.updateInjector);
  }

  private updateInjector(classDeclaration: ClassDeclaration): void {
    const className = classDeclaration.classInformation.className;
    const injector = dependencyInjectionAssembler.retrieveInjector(className);
    if (injector) {
      const currentCtorArguments = injector.ClassConstructorArguments;
      classDeclaration.classInformation.constructors.sort(
        this.sortClassConstructorDeclarations
      );
      injector.ClassConstructorArguments = this.mapOldToNewCtorArguments(
        classDeclaration.classInformation.constructors[0].parameters,
        currentCtorArguments
      );
    }
  }
}

const autoClassDeclaration: AutoClassDeclaration = new AutoClassDeclaration();

/**
 * @export Singleton instance of the class AutoClassDeclaration
 * This instance is the only API to the classDeclarations. This class should only be used by internal components and
 * not by the users.
 */
export default autoClassDeclaration;
