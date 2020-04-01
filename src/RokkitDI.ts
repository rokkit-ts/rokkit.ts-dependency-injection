import {
  Injector,
  InjectorConstructorArgument,
  InjectorFactory
} from './injector'
import { TypeScannerSingleton } from './TypeScanner'

/**
 * @class RokkitDI
 * This class exposes the API to register Injectables on the dependencies container.
 * The container is maintained as a singleton, so that all module of your application use the same container nad get the same injectors.
 * In order to retrieve an instance you can decide if you want to get an singleton or a new instance.
 */
class DependencyInjectionContainer {
  private readonly injectables = new Map<string, Injector<{}>>()
  private readonly instances = new Map<string, {}>()

  public registerInjectable<T extends object>(
    classConstructor: new (...args: any[]) => T,
    classConstructorArguments?: any[] | InjectorConstructorArgument[]
  ): DependencyInjectionContainer {
    // check scanned arguments when the params are empty
    const injectorArgs = this.updateProvidedWithScannedArguments(
      classConstructor.name,
      classConstructorArguments
    )
    // create injector
    const injector = InjectorFactory.createInjector(
      classConstructor,
      injectorArgs
    )
    // register injector on static map!
    this.injectables.set(classConstructor.name, injector)

    return this
  }

  /**
   * @function singletonOf
   * This function let's you retrieve a registered intjector as a singleton object. That means
   * that each next call will get the exact same instances.
   * @param injectable:string Name of the class you want to retrieve
   * @returns any object that is already stored or we be create by the corresponding injector
   */
  public singletonOf(injectable: string): any {
    return (
      this.instances.get(injectable) ?? this.instantiateSingleton(injectable)
    )
  }

  /**
   * @function instanceOf
   * This function let's you create new instance of the registered injector.
   * That means that every time you call this function you will retrieve a new object.
   * @param injectable:string Name of the class you want to retrieve
   * @returns any new object that is created by the corresponding injector
   */
  public instanceOf(injectable: string): any {
    try {
      const injector = this.injectorFor(injectable)
      return injector.createInstance()
    } catch (error) {
      throw new Error(
        `Could not instantiate an instance of ${injectable}.\n` + error.message
      )
    }
  }

  private updateProvidedWithScannedArguments(
    injectorName: string,
    providedArgs: InjectorConstructorArgument[] = []
  ): InjectorConstructorArgument[] {
    const scannedArgs = TypeScannerSingleton.injectorArgumentsFor(injectorName)
    return scannedArgs.map((arg, index) => {
      const providedArg = providedArgs.find(pargs => pargs.index === index)
      return {
        index,
        type: arg.type,
        value: providedArg?.value
      }
    })
  }

  private instantiateSingleton(injectable: string): {} {
    try {
      const injector = this.injectorFor(injectable)
      this.instances.set(injectable, injector.createInstance())
      return this.instances.get(injectable)!
    } catch (error) {
      throw new Error(
        `Could not instantiate a singlton of ${injectable}.\n` + error.message
      )
    }
  }

  private injectorFor(injectable: string): Injector<{}> {
    const injector = this.injectables.get(injectable)
    if (!injector) {
      throw new Error(
        `Could not find a registered injector for the name: ${injectable}.`
      )
    }
    return injector
  }
}

export const RokkitDI = new DependencyInjectionContainer()
