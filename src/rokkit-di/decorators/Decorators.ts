import 'reflect-metadata'
import { DecoratorHelper } from './DecoratorHelper'

/**
 * @description The Injectable decorator is used to annotate a class and mark it. The marked class is registered on
 * the dependencyInjectionAssembler singleton.
 * @param fileName
 * @param contextName
 */
export function Injectable(fileName?: string): Function {
  return <T extends new (...args: any[]) => {}>(constructor: T) =>
    DecoratorHelper.registerInjectorOnAssembler(constructor, fileName)
}

/**
 * @description The Inject decorator provides the given value to the specified argument. Could only be used on a
 * constructor function, otherwise a error is thrown.
 * @param injectionValue
 */
export function Inject(injectionValue: any): Function {
  return (target: object, propertyKey: string, parameterIndex: number) => {
    if (propertyKey) {
      throw new Error('@Inject can only be used on a constructor')
    }
    DecoratorHelper.registerInjectableArgument(
      target as Function,
      parameterIndex,
      injectionValue
    )
  }
}
