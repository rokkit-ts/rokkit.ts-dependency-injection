import { Injector } from "../injector";
import { DependencyInjectionContext } from "./dependencyInjectionContext";

class DependencyInjectionAssembler {
  public readonly DEFAULT_CONTEXT_NAME = "DEFAULT_CONTEXT";
  private readonly userContexts: DependencyInjectionContext[];
  private readonly defaultContext: DependencyInjectionContext;

  constructor() {
    this.userContexts = [];
    this.defaultContext = new DependencyInjectionContext(
      this.DEFAULT_CONTEXT_NAME
    );
  }

  public registerContext(context: DependencyInjectionContext): void {
    if (!this.doesContextExist(context)) {
      this.userContexts.push(context);
    } else {
      throw new Error("Context already exists.");
    }
  }

  public createContext(contextName: string): void {
    if (!this.doesContextExist(contextName)) {
      const userContext = new DependencyInjectionContext(contextName);
      this.userContexts.push(userContext);
    } else {
      throw new Error("Context already exists.");
    }
  }

  public retrieveContext(
    contextName: string
  ): DependencyInjectionContext | undefined {
    if (contextName === this.DEFAULT_CONTEXT_NAME) {
      return this.defaultContext;
    }
    return this.userContexts.find(
      context => context.ContextName === contextName
    );
  }

  public retrieveDefaultContext(): DependencyInjectionContext {
    return this.defaultContext;
  }

  public doesContextExist(
    context: string | DependencyInjectionContext
  ): boolean {
    if (typeof context === "string") {
      return (
        context === this.DEFAULT_CONTEXT_NAME ||
        !!this.userContexts.find(
          savedContext => savedContext.ContextName === context
        )
      );
    } else {
      return (
        this.defaultContext.ContextName === context.ContextName ||
        !!this.userContexts.find(
          savedContext => savedContext.ContextName === context.ContextName
        )
      );
    }
  }

  public registerInjector<T extends object>(
    injector: Injector<T>,
    contextName?: string
  ): void {
    if (contextName) {
      const context = this.retrieveContext(contextName);
      if (context) {
        context.addInjector(injector.ClassName, injector);
        return;
      }
    }
    this.defaultContext.addInjector(injector.ClassName, injector);
  }

  public retrieveInjector<T extends object>(
    injectorName: string,
    contextName?: string
  ): Injector<T> | undefined {
    if (contextName) {
      const context = this.retrieveContext(contextName);
      if (context) {
        return context.getInjector(injectorName);
      }
    } else {
      for (const context of this.userContexts) {
        const possibleInjector: Injector<T> | undefined = context.getInjector(
          injectorName
        );
        if (possibleInjector) {
          return possibleInjector;
        }
      }
      return this.retrieveInjectorByDefaultContext(injectorName);
    }
  }

  public retrieveInjectorByDefaultContext<T extends object>(
    injectorName: string
  ): Injector<T> | undefined {
    return this.defaultContext.getInjector(injectorName);
  }
}

const dependencyInjectionAssembler: DependencyInjectionAssembler = new DependencyInjectionAssembler();

export default dependencyInjectionAssembler;
