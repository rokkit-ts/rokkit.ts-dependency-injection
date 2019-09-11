import { assert, expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Injector } from "../injector";
import dependencyInjectionAssembler from "./dependencyInjectionAssembler";
import { DependencyInjectionContext } from "./dependencyInjectionContext";

@suite()
export class DependencyInjectionAssemblerSpec {
  @test
  public createContext(): void {
    dependencyInjectionAssembler.createContext("TEST_CONTEXT");
    const context:
      | DependencyInjectionContext
      | undefined = dependencyInjectionAssembler.retrieveContext(
      "TEST_CONTEXT"
    );
    assert.exists(context);
    if (context) {
      assert.equal(context.ContextName, "TEST_CONTEXT");
      assert.exists(context.getAllInjectors());
      assert.isArray(context.getAllInjectors());
      assert.isEmpty(context.getAllInjectors());
    }

    expect(() => dependencyInjectionAssembler.createContext("")).to.throw(
      "Context name should not be empty."
    );
    expect(() =>
      dependencyInjectionAssembler.createContext("TEST_CONTEXT")
    ).to.throw("Context already exists.");
    expect(() =>
      dependencyInjectionAssembler.createContext("DEFAULT_CONTEXT")
    ).to.throw("Context already exists.");
  }

  @test
  public registerContext(): void {
    const context: DependencyInjectionContext = new DependencyInjectionContext(
      "REGISTER_TEST"
    );
    dependencyInjectionAssembler.registerContext(context);

    const retrieveContext:
      | DependencyInjectionContext
      | undefined = dependencyInjectionAssembler.retrieveContext(
      "REGISTER_TEST"
    );
    assert.exists(retrieveContext);
    if (retrieveContext) {
      assert.equal(retrieveContext.ContextName, "REGISTER_TEST");
      assert.exists(retrieveContext.getAllInjectors());
      assert.isArray(retrieveContext.getAllInjectors());
      assert.isEmpty(retrieveContext.getAllInjectors());
      assert.equal(retrieveContext, context);
    }

    expect(() =>
      dependencyInjectionAssembler.registerContext(context)
    ).to.throw("Context already exists.");

    const defaultContext: DependencyInjectionContext = new DependencyInjectionContext(
      "DEFAULT_CONTEXT"
    );
    expect(() =>
      dependencyInjectionAssembler.registerContext(defaultContext)
    ).to.throw("Context already exists.");
  }

  @test
  public retrieveDefaultContext(): void {
    const context: DependencyInjectionContext = dependencyInjectionAssembler.retrieveDefaultContext();
    assert.exists(context);
    assert.equal(
      context.ContextName,
      dependencyInjectionAssembler.DEFAULT_CONTEXT_NAME
    );
    assert.exists(context.getAllInjectors());
    assert.isArray(context.getAllInjectors());
    assert.isEmpty(context.getAllInjectors());
  }

  @test
  public doesContextExist(): void {
    const defaultContextExist = dependencyInjectionAssembler.doesContextExist(
      dependencyInjectionAssembler.DEFAULT_CONTEXT_NAME
    );
    assert.isTrue(defaultContextExist);
    const defaultContext: DependencyInjectionContext = dependencyInjectionAssembler.retrieveDefaultContext();
    const defaultContextExist1 = dependencyInjectionAssembler.doesContextExist(
      defaultContext
    );
    assert.isTrue(defaultContextExist1);

    const testContextNotExist = dependencyInjectionAssembler.doesContextExist(
      "test-context"
    );
    assert.isFalse(testContextNotExist);
    dependencyInjectionAssembler.createContext("test-context");
    const testContextNotExist1 = dependencyInjectionAssembler.doesContextExist(
      "test-context"
    );
    assert.isTrue(testContextNotExist1);
  }

  @test
  public registerInjector(): void {
    const injector: Injector<DependencyAssemblerTestClass1> = new Injector<
      DependencyAssemblerTestClass1
    >(DependencyAssemblerTestClass1, [
      {
        index: 0,
        type: "string",
        value: "test"
      }
    ]);
    dependencyInjectionAssembler.createContext("TEST-CLASS-CONTEXT");
    dependencyInjectionAssembler.registerInjector(
      injector,
      "TEST-CLASS-CONTEXT"
    );
    const retrievedInjector = dependencyInjectionAssembler.retrieveInjector(
      "DependencyAssemblerTestClass1",
      "TEST-CLASS-CONTEXT"
    );
    assert.exists(retrievedInjector);
    assert.equal(retrievedInjector, injector);

    const retrievedInjector1 = dependencyInjectionAssembler.retrieveInjector(
      "DependencyAssemblerTestClass1"
    );

    assert.exists(retrievedInjector1);
    assert.equal(retrievedInjector1, injector);

    const injector2: Injector<DependencyAssemblerTestClass2> = new Injector<
      DependencyAssemblerTestClass2
    >(DependencyAssemblerTestClass2, [
      {
        index: 0,
        type: "string",
        value: "test"
      }
    ]);

    dependencyInjectionAssembler.registerInjector(injector2);
    const retrievedInjector2 = dependencyInjectionAssembler.retrieveInjector(
      "DependencyAssemblerTestClass2",
      dependencyInjectionAssembler.DEFAULT_CONTEXT_NAME
    );
    assert.exists(retrievedInjector2);
    assert.equal(retrievedInjector2, injector2);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class DependencyAssemblerTestClass1 {
  public aString: string;

  constructor(aString: string, test1: number) {
    this.aString = aString;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class DependencyAssemblerTestClass2 {
  public aString: string;

  constructor(aString: string) {
    this.aString = aString;
  }
}
