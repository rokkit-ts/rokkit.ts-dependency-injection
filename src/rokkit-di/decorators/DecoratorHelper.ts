import 'reflect-metadata'
import { InjectorConstructorArgument } from '../../injector'
import { RokkitDI } from '..'

/**
 * @class DependencyInjectionDecoratorHelper
 * @description Static helper class for the decorators. These methods should only be used internally.
 */
export class DecoratorHelper {
  /**
   * @description Reflection key for the constructor arguments.
   */
  public static readonly INJECTABLE_CONSTRUCTOR_ARGUMENTS = Symbol(
    'injection-parameters'
  )

  /**
   * @description Creates and registers the Injector on the dependencyInjectionAssembler
   * @param constructor
   * @param fileName
   * @param contextName
   */
  public static registerInjectorOnAssembler<
    T extends new (...args: any[]) => {}
  >(constructor: T, fileName?: string): void {
    const classConstructorArguments = DecoratorHelper.getInjectorClassConstructorArguments(
      constructor
    )
    RokkitDI.registerInjectable(constructor, classConstructorArguments)
  }

  /**
   * @description Registers any argument in the meta data of the provided constructor function.
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
    }
    const injectionArgs: InjectorConstructorArgument[] = Reflect.getMetadata(
      DecoratorHelper.INJECTABLE_CONSTRUCTOR_ARGUMENTS,
      constructor
    )
    if (injectionArgs) {
      injectionArgs.push(injectableArgument)
      Reflect.defineMetadata(
        DecoratorHelper.INJECTABLE_CONSTRUCTOR_ARGUMENTS,
        injectionArgs,
        constructor
      )
    } else {
      Reflect.defineMetadata(
        DecoratorHelper.INJECTABLE_CONSTRUCTOR_ARGUMENTS,
        [injectableArgument],
        constructor
      )
    }
  }

  /**
   * @description Gets the injector arguments of the provided constructor
   * @param constructor
   * @return InjectorConstructorArgument[]
   */
  public static getInjectorClassConstructorArguments(
    constructor: Function
  ): InjectorConstructorArgument[] {
    const injectableConstructorArguments: InjectorConstructorArgument[] = Reflect.getMetadata(
      DecoratorHelper.INJECTABLE_CONSTRUCTOR_ARGUMENTS,
      constructor
    )

    if (injectableConstructorArguments) {
      injectableConstructorArguments.sort((a, b) => {
        if (a.index > b.index) return 1
        if (a.index < b.index) return -1
        return 0
      })

      return injectableConstructorArguments
    }
    return []
  }
}
