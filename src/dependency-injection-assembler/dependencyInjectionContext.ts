import { Injector } from "../injector";

/**
 * @class DependencyInjectionContext
 * The class creates a context for multiple injectors. It should be used as an structuring unit
 */
export class DependencyInjectionContext {
  private readonly contextName: string;
  private injectors: Map<string, Injector<any>>;

  constructor(contextName: string) {
    if (contextName.length === 0) {
      throw new Error("Context name should not be empty.");
    }
    this.contextName = contextName;
    this.injectors = new Map<string, Injector<any>>();
  }

  /**
   * @description Accessor for the ContextName
   * @return string
   */
  public get ContextName() {
    return this.contextName;
  }

  /**
   * @description Adds an injector to the context
   * @param injectorName
   * @param injector
   * @return void
   */
  public addInjector<T extends object>(
    injectorName: string,
    injector: Injector<T>
  ): void {
    this.injectors.set(injectorName, injector);
  }

  /**
   * @description Gets an injector by name from the context
   * @param injectorName
   * @return Injector<T>
   */
  public getInjector<T extends object>(
    injectorName: string
  ): Injector<T> | undefined {
    return this.injectors.get(injectorName);
  }

  /**
   * @description Get all injectors of the context
   * @return Injector<any>
   */
  public getAllInjectors(): Injector<any>[] {
    const injectors: Injector<any>[] = [];
    this.injectors.forEach(injector => injectors.push(injector));
    return injectors;
  }
}
