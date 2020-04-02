import { InjectorConstructorArgument } from './injectorConstructorArgument'

/**
 * @description The Injector class is used to store type information about a specific userObject. These information
 * could be used to construct an instance of the defined userObject.
 * @class Injector
 * @param T extends objects
 */
export class Injector<T extends object> {
  private readonly className: string
  private readonly classType: new (...args: any[]) => T
  private classConstructorArguments: InjectorConstructorArgument[]

  public constructor(
    classConstructor: new (...args: any[]) => T,
    classConstructorArguments: InjectorConstructorArgument[]
  ) {
    this.className = classConstructor.name
    this.classType = classConstructor
    this.classConstructorArguments = classConstructorArguments
  }

  /**
   * @description Accessor for the ClassName of the userObject
   * @return string
   */
  public get ClassName(): string {
    return this.className
  }

  /**
   * @description Accessor for the ClassConstructorArguments of the userObject
   * @return InjectorConstructorArgument[]
   */
  public get ClassConstructorArguments() {
    return this.classConstructorArguments
  }

  /**
   * @description Accessor for the ClassConstructorArguments of the userObject
   * @param classConstructorArguments
   */
  public set ClassConstructorArguments(
    classConstructorArguments: InjectorConstructorArgument[]
  ) {
    this.classConstructorArguments = classConstructorArguments
  }

  /**
   * @description Creates an instance of the userObject. Therefore checks the constructorArguments for injected
   * values or special user objects. Every user object argument that has no explicit provided value will be query by
   * the dependencyInjectionAssembler.
   * @return T
   */
  public createInstance(): T {
    try {
      const args: any[] = this.getConstructorArgs()
      return new this.classType(...args)
    } catch (error) {
      throw error
    }
  }

  private mapToValue(argument: InjectorConstructorArgument): any {
    if (argument.value) {
      return argument.value
    } else {
      throw new Error(
        `Missing value for argument ${argument.type} at index ${argument.index}`
      )
    }
  }

  private getConstructorArgs(): any[] {
    this.sortInjectorConstructorArguments()
    try {
      return this.classConstructorArguments.map(this.mapToValue)
    } catch (error) {
      throw new Error(
        `Could not instantiate class ${this.className} due to: ${error.message}`
      )
    }
  }

  private sortInjectorConstructorArguments(): void {
    this.classConstructorArguments.sort((a, b) => {
      if (a.index > b.index) return 1
      if (a.index < b.index) return -1
      return 0
    })
  }
}
