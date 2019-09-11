import dependencyInjectionAssembler from "../dependency-injection-assembler/dependencyInjectionAssembler";
import { InjectorConstructorArgument } from "./injectorConstructorArgument";

/**
 * @description The Injector class is used to store type information about a specific userObject. These information
 * could be used to construct an instance of the defined userObject.
 * @class Injector
 * @param T extends objects
 */
export class Injector<T extends object> {
  private readonly className: string;
  private readonly classType: new (...args: any[]) => T;
  private classConstructorArguments: InjectorConstructorArgument[];

  public constructor(
    classConstructor: new (...args: any[]) => T,
    classConstructorArguments: InjectorConstructorArgument[]
  ) {
    this.className = classConstructor.name;
    this.classType = classConstructor;
    this.classConstructorArguments = classConstructorArguments;
  }

  /**
   * @description Accessor for the ClassName of the userObject
   * @return string
   */
  public get ClassName(): string {
    return this.className;
  }

  /**
   * @description Accessor for the ClassConstructorArguments of the userObject
   * @return InjectorConstructorArgument[]
   */
  public get ClassConstructorArguments() {
    return this.classConstructorArguments;
  }

  /**
   * @description Accessor for the ClassConstructorArguments of the userObject
   * @param classConstructorArguments
   */
  public set ClassConstructorArguments(
    classConstructorArguments: InjectorConstructorArgument[]
  ) {
    this.classConstructorArguments = classConstructorArguments;
  }

  private static isUserObject(argument: InjectorConstructorArgument): boolean {
    return !(
      argument.type === "string" ||
      argument.type === "bigint" ||
      argument.type === "object" ||
      argument.type === "number" ||
      argument.type === "undefined" ||
      argument.type === "boolean" ||
      argument.type === "symbol" ||
      argument.type === "function"
    );
  }

  private static retrieveConstructorArgumentInstance(type: string): any {
    const injector:
      | Injector<any>
      | undefined = dependencyInjectionAssembler.retrieveInjector(type);
    if (injector) {
      return injector.createInstance();
    } else {
      throw new Error(
        `It is not possible to find an injector of type: ${type}.`
      );
    }
  }

  private static convertInjectorArgumentToInstanceArgument(
    argument: InjectorConstructorArgument
  ): any {
    if (argument.value) {
      return argument.value;
    }
    if (Injector.isUserObject(argument)) {
      return Injector.retrieveConstructorArgumentInstance(argument.type);
    } else {
      throw new Error(
        "Could not instantiate native values without the @Inject annotation."
      );
    }
  }

  /**
   * @description Creates an instance of the userObject. Therefore checks the constructorArguments for injected
   * values or special user objects. Every user object argument that has no explicit provided value will be query by
   * the dependencyInjectionAssembler.
   * @return T
   */
  public createInstance(): T {
    const args: any[] = this.createInstanceConstructorArguments();
    return new this.classType(...args);
  }

  private createInstanceConstructorArguments(): any[] {
    this.sortInjectorConstructorArguments();

    return this.classConstructorArguments.map(
      Injector.convertInjectorArgumentToInstanceArgument
    );
  }

  private sortInjectorConstructorArguments(): void {
    this.classConstructorArguments.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (a.index < b.index) return -1;
      return 0;
    });
  }
}
