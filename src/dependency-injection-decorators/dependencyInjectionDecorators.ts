import "reflect-metadata";
import dependencyInjectionAssembler from "../dependency-injection-assembler/dependencyInjectionAssembler";
import { DependencyInjectionDecoratorHelper } from "./dependencyInjectionDecoratorHelper";

export function Injectable(contextName?: string): Function {
  return <T extends new (...args: any[]) => {}>(constructor: T) =>
    DependencyInjectionDecoratorHelper.registerInjectorOnAssembler(
      constructor,
      contextName || dependencyInjectionAssembler.DEFAULT_CONTEXT_NAME
    );
}

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
