import { Injector } from "./injector";

export class InjectorFactory {
  public static createInjector<T extends object>(
    classConstructor: new (...args: any[]) => T,
    classConstructorArguments?: any[]
  ): Injector<T> {
    return new Injector<T>(classConstructor, classConstructorArguments || []);
  }
}
