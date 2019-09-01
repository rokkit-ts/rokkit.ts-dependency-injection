import { Injector } from "../injector";

export class DependencyInjectionContext {
  private readonly contextName: string;
  private injectors: Map<string, Injector<any>>;

  constructor(contextName: string) {
    this.contextName = contextName;
    this.injectors = new Map<string, Injector<any>>();
  }

  public get ContextName() {
    return this.contextName;
  }

  addInjector<T extends object>(
    injectorName: string,
    injector: Injector<T>
  ): void {
    this.injectors.set(injectorName, injector);
  }

  getInjector<T extends object>(injectorName: string): Injector<T> | undefined {
    return this.injectors.get(injectorName);
  }

  getAllInjectors(): Injector<any>[] {
    const injectors: Injector<any>[] = [];
    this.injectors.forEach(injector => injectors.push(injector));
    return injectors;
  }
}
