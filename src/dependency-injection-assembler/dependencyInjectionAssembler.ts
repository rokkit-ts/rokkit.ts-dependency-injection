import { Injector } from "../injector";
import { DependencyInjectionContext } from "./dependencyInjectionContext";

/**
 * @class DependencyInjectionAssembler
 * This class is used as a singleton and therefore is not exported. This class provides the capabilities to interact
 * with the library. You can register, edit and retrieve InjectorContexts and Injectors to create instances.
 */
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

  /**
   * @description Registers a context on the assembler.
   * @param context
   */
  public registerContext(context: DependencyInjectionContext): void {
    if (!this.doesContextExist(context)) {
      this.userContexts.push(context);
    } else {
      throw new Error("Context already exists.");
    }
  }

  /**
   * @description Creates and registers a context on the assembler.
   * @param contextName
   */
  public createContext(contextName: string): void {
    if (!this.doesContextExist(contextName)) {
      const userContext = new DependencyInjectionContext(contextName);
      this.userContexts.push(userContext);
    } else {
      throw new Error("Context already exists.");
    }
  }

  /**
   * @description Retrieve context for the given contextName. Returns undefined when there is no context for the
   * provided argument.
   * @param contextName
   * @return DependencyInjectionContext
   */
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

  /**
   * @description Retrieves the default context
   */
  public retrieveDefaultContext(): DependencyInjectionContext {
    return this.defaultContext;
  }

  /**
   * @description Checks if the given context or contextName is present on the assembler instance.
   * @param context
   */
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

  /**
   * @description Registers an injector on a specific context for the given contextName. If the contextName is not
   * provided the injector will be registered no the default context.
   * @param injector
   * @param contextName
   */
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

  /**
   * @description Retrieves the specified injector its injectorName and the contextName. If the contextName is not
   * specified, the method will query all contexts. Could possible be undefined if there is no injector with this name.
   * @param injectorName
   * @param contextName
   * @return Injector<T>
   */
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

  /**
   * @description Retrieves the specified injector by the default context. Could possible be undefined if there is
   * no injector with this name.
   * @param injectorName
   * @return Injector<T>
   */
  public retrieveInjectorByDefaultContext<T extends object>(
    injectorName: string
  ): Injector<T> | undefined {
    return this.defaultContext.getInjector(injectorName);
  }
}

/**
 * @export Singleton instance of the class DependencyInjectionAssembler
 * @description This instance is the only API to the DependencyInjectionAssembler.
 */
const dependencyInjectionAssembler: DependencyInjectionAssembler = new DependencyInjectionAssembler();
export default dependencyInjectionAssembler;
