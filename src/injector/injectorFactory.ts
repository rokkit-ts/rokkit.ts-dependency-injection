import { Injector } from "./injector";

export class InjectorFactory {
  public static createInjector<T extends object>(
    className: string,
    classConstructor: new (...args: any[]) => T,
    classConstructorArguments?: any[]
  ): Injector<T> {
    return new Injector<T>(
      className,
      classConstructor,
      classConstructorArguments || []
    );
  }
}
