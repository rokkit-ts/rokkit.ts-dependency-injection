import "reflect-metadata";
import dependencyInjectionAssembler from "../dependency-injection-assembler/dependencyInjectionAssembler";
import { Injector, InjectorFactory } from "../injector";
import { InjectableConstructorArgument } from "./injectableConstructorArgument";

export class DependencyInjectionDecoratorHelper {
  public static readonly INJECTABLE_CONSTRUCTOR_ARGUMENTS = Symbol(
    "injection-parameters"
  );

  public static registerInjectorOnAssembler<
    T extends new (...args: any[]) => {}
  >(constructor: T, contextName?: string) {
    const classConstructorArguments: any[] = DependencyInjectionDecoratorHelper.getInjectorClassConstructorArguments(
      constructor
    );
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

  public static registerInjectableArgument(
    constructor: Function,
    parameterIndex: number,
    value: any
  ) {
    const injectableArgument: InjectableConstructorArgument = {
      index: parameterIndex,
      value
    };
    const injectionArgs: InjectableConstructorArgument[] = Reflect.getMetadata(
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

  public static getInjectorClassConstructorArguments(
    constructor: Function
  ): any[] {
    const injectableConstructorArguments: InjectableConstructorArgument[] = Reflect.getMetadata(
      DependencyInjectionDecoratorHelper.INJECTABLE_CONSTRUCTOR_ARGUMENTS,
      constructor
    );

    if (injectableConstructorArguments) {
      injectableConstructorArguments.sort((a, b) => {
        if (a.index > b.index) return 1;
        if (a.index < b.index) return -1;
        return 0;
      });

      return injectableConstructorArguments.map(argument => argument.value);
    }
    return [];
  }
}
