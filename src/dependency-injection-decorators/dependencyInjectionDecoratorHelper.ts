import { ClassDeclaration } from "@rokkit.ts/class-declaration-resolver";
import * as path from "path";
import "reflect-metadata";
import autoClassDeclaration from "../automatic-class-declaration/autoClassDeclaration";
import dependencyInjectionAssembler from "../dependency-injection-assembler/dependencyInjectionAssembler";
import {
  Injector,
  InjectorConstructorArgument,
  InjectorFactory
} from "../injector";

/**
 * @class DependencyInjectionDecoratorHelper
 * Static helper class for the decorators. These methods should only be used internally.
 */
export class DependencyInjectionDecoratorHelper {
  /**
   * Reflection key for the constructor arguments.
   */
  public static readonly INJECTABLE_CONSTRUCTOR_ARGUMENTS = Symbol(
    "injection-parameters"
  );

  /**
   * Creates and registers the Injector on the dependencyInjectionAssembler
   * @param constructor
   * @param fileName
   * @param contextName
   */
  public static registerInjectorOnAssembler<
    T extends new (...args: any[]) => {}
  >(constructor: T, fileName?: string, contextName?: string): void {
    const classDeclaration:
      | ClassDeclaration
      | undefined = this.retrieveClassDeclaration(constructor.name, fileName);

    let classConstructorArguments: InjectorConstructorArgument[] = DependencyInjectionDecoratorHelper.getInjectorClassConstructorArguments(
      constructor
    );

    if (classDeclaration) {
      classConstructorArguments = this.mapClassDeclarationAndDecoratedArguments(
        classDeclaration,
        classConstructorArguments
      );
    }

    const injector: Injector<{}> = InjectorFactory.createInjector(
      constructor,
      classConstructorArguments
    );

    if (
      contextName &&
      !dependencyInjectionAssembler.doesContextExist(contextName)
    ) {
      dependencyInjectionAssembler.createContext(contextName);
    }
    dependencyInjectionAssembler.registerInjector(injector, contextName);
  }

  /**
   * Registers any argument in the meta data of the provided constructor function.
   * @param constructor
   * @param parameterIndex
   * @param value
   */
  public static registerInjectableArgument(
    constructor: Function,
    parameterIndex: number,
    value: any
  ): void {
    const injectableArgument: InjectorConstructorArgument = {
      index: parameterIndex,
      type: typeof value,
      value
    };
    const injectionArgs: InjectorConstructorArgument[] = Reflect.getMetadata(
      DependencyInjectionDecoratorHelper.INJECTABLE_CONSTRUCTOR_ARGUMENTS,
      constructor
    );
    if (injectionArgs) {
      injectionArgs.push(injectableArgument);
      Reflect.defineMetadata(
        DependencyInjectionDecoratorHelper.INJECTABLE_CONSTRUCTOR_ARGUMENTS,
        injectionArgs,
        constructor
      );
    } else {
      Reflect.defineMetadata(
        DependencyInjectionDecoratorHelper.INJECTABLE_CONSTRUCTOR_ARGUMENTS,
        [injectableArgument],
        constructor
      );
    }
  }

  /**
   * Gets the injector arguments of the provided constructor
   * @param constructor
   * @return InjectorConstructorArgument[]
   */
  public static getInjectorClassConstructorArguments(
    constructor: Function
  ): InjectorConstructorArgument[] {
    const injectableConstructorArguments: InjectorConstructorArgument[] = Reflect.getMetadata(
      DependencyInjectionDecoratorHelper.INJECTABLE_CONSTRUCTOR_ARGUMENTS,
      constructor
    );

    if (injectableConstructorArguments) {
      injectableConstructorArguments.sort((a, b) => {
        if (a.index > b.index) return 1;
        if (a.index < b.index) return -1;
        return 0;
      });

      return injectableConstructorArguments;
    }
    return [];
  }

  private static retrieveClassDeclaration(
    className: string,
    fileName?: string
  ): ClassDeclaration | undefined {
    if (fileName) {
      return autoClassDeclaration.getClassDeclarationByFileAndClassName(
        path.resolve(fileName),
        className
      );
    } else {
      return autoClassDeclaration.getClassDeclarationByClassName(className);
    }
  }

  private static mapClassDeclarationAndDecoratedArguments(
    classDeclaration: ClassDeclaration,
    decoratedArguments: InjectorConstructorArgument[]
  ): InjectorConstructorArgument[] {
    const constructors = classDeclaration.classInformation.constructors;
    constructors.sort(autoClassDeclaration.sortClassConstructorDeclarations);
    return autoClassDeclaration.mapOldToNewCtorArguments(
      constructors[0].parameters,
      decoratedArguments
    );
  }
}
