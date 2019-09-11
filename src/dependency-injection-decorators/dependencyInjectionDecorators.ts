import "reflect-metadata";
import dependencyInjectionAssembler from "../dependency-injection-assembler/dependencyInjectionAssembler";
import { DependencyInjectionDecoratorHelper } from "./dependencyInjectionDecoratorHelper";

/**
 * @description The Injectable decorator is used to annotate a class and mark it. The marked class is registered on
 * the dependencyInjectionAssembler singleton.
 * @param fileName
 * @param contextName
 */
export function Injectable(fileName?: string, contextName?: string): Function {
  return <T extends new (...args: any[]) => {}>(constructor: T) =>
    DependencyInjectionDecoratorHelper.registerInjectorOnAssembler(
      constructor,
      fileName,
      contextName || dependencyInjectionAssembler.DEFAULT_CONTEXT_NAME
    );
}

/**
 * @description The Inject decorator provides the given value to the specified argument. Could only be used on a
 * constructor function, otherwise a error is thrown.
 * @param injectionValue
 */
export function Inject(injectionValue: any): Function {
  return (target: object, propertyKey: string, parameterIndex: number) => {
    if (propertyKey) throw new Error("Could only be used on a constructor");
    DependencyInjectionDecoratorHelper.registerInjectableArgument(
      target as Function,
      parameterIndex,
      injectionValue
    );
  };
}
