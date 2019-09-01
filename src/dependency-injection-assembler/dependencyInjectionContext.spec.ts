import { assert } from "chai";
import { suite, test } from "mocha-typescript";
import { DependencyInjectionContext } from "./dependencyInjectionContext";

@suite()
export class DependencyInjectionContextSpec {
  private readonly contextName = "TEST-CONTEXT";

  @test()
  public createContext(): void {
    const context: DependencyInjectionContext = new DependencyInjectionContext(
      this.contextName
    );
    assert.exists(context);
    assert.equal(context.ContextName, this.contextName);
    assert.isArray(context.getAllInjectors());
    assert.isEmpty(context.getAllInjectors());
  }
}
