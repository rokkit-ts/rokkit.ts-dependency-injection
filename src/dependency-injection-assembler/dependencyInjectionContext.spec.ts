import { assert, expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Injector } from "../injector";
import { DependencyInjectionContext } from "./dependencyInjectionContext";

@suite()
export class DependencyInjectionContextSpec {
  private readonly contextName = "TEST-CONTEXT";

  @test()
  public createContext(): DependencyInjectionContext {
    const context: DependencyInjectionContext = new DependencyInjectionContext(
      this.contextName
    );
    assert.exists(context);
    assert.equal(context.ContextName, this.contextName);
    assert.isArray(context.getAllInjectors());
    assert.isEmpty(context.getAllInjectors());
    return context;
  }

  @test
  public createContextWithEmptyStringExpectToFail(): void {
    expect(() => new DependencyInjectionContext("")).to.throw(
      "Context name should not be empty."
    );
  }

  @test()
  public addInjectorToContext(): void {
    const context = this.createContext();
    const injector: Injector<TestClass1> = new Injector<TestClass1>(
      TestClass1,
      ["test"]
    );
    // TODO do I really need that name?
    context.addInjector("TestClass", injector);
    assert.isArray(context.getAllInjectors());
    assert.isNotEmpty(context.getAllInjectors());
    const retrievedInjector = context.getInjector("TestClass");
    assert.exists(retrievedInjector);
    assert.isNotEmpty(retrievedInjector);
    assert.equal(retrievedInjector, injector);
  }

  @test()
  public addMultipleInjectorsToContext(): void {
    const context = this.createContext();
    const injector1: Injector<TestClass1> = new Injector<TestClass1>(
      TestClass1,
      ["test"]
    );
    context.addInjector("TestClass1", injector1);
    const injector2: Injector<TestClass1> = new Injector<TestClass1>(
      TestClass1,
      ["test"]
    );
    context.addInjector("TestClass2", injector2);
    const injector3: Injector<TestClass1> = new Injector<TestClass1>(
      TestClass1,
      ["test"]
    );
    context.addInjector("TestClass3", injector3);
    assert.isArray(context.getAllInjectors());
    assert.isNotEmpty(context.getAllInjectors());
    expect(context.getAllInjectors()).contains(injector1);
    expect(context.getAllInjectors()).contains(injector2);
    expect(context.getAllInjectors()).contains(injector3);
  }
}

// tslint:disable-next-line:max-classes-per-file
class TestClass1 {
  private aString: string;

  constructor(aString: string) {
    this.aString = aString;
  }
}
