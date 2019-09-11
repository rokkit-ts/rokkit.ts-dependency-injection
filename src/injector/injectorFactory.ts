import { Injector } from "./injector";
import { InjectorConstructorArgument } from "./injectorConstructorArgument";

/**
 * @static
 * @class InjectorFactory
 * @description The InjectorFactory is a static class that helps creating injectors for userObjects.
 */
export class InjectorFactory {
  private constructor() {}

  /**
   * @description Creates an injector for the provided arguments. YOu can either provide an array of
   * InjectorConstructorArguments or any as the constructor arguments.
   * @param classConstructor
   * @param classConstructorArguments
   * @return Injector<T>
   */
  public static createInjector<T extends object>(
    classConstructor: new (...args: any[]) => T,
    classConstructorArguments?: any[] | InjectorConstructorArgument[]
  ): Injector<T> {
    return new Injector<T>(
      classConstructor,
      this.createInjectorConstructorArgument(classConstructorArguments)
    );
  }

  private static createInjectorConstructorArgument(
    classConstructorArguments?: any[] | InjectorConstructorArgument[]
  ): InjectorConstructorArgument[] {
    if (classConstructorArguments) {
      if (this.isInjectorConstructorArgumentArray(classConstructorArguments)) {
        return classConstructorArguments;
      } else {
        return this.mapAnyArgumentsToInjectorConstructorArguments(
          classConstructorArguments
        );
      }
    }
    return [];
  }

  private static mapAnyArgumentsToInjectorConstructorArguments(
    constructorArguments: any[]
  ): InjectorConstructorArgument[] {
    return constructorArguments.map((argument, index) => {
      return { index, type: typeof argument, value: argument };
    });
  }

  private static isInjectorConstructorArgumentArray(
    constructorArguments: any[] | InjectorConstructorArgument[]
  ): constructorArguments is InjectorConstructorArgument[] {
    for (const argument of constructorArguments) {
      if (argument.type === undefined && argument.index === undefined) {
        return false;
      }
    }
    return true;
  }
}
