import { assert, expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Injector } from "./injector";

@suite()
export class InjectorSpec {
  @test
  public createInjector(): void {
    const injector: Injector<TestClass1> = new Injector(TestClass1, ["test"]);
    const instance: TestClass1 = injector.createInstance();
    assert.exists(injector);
    assert.isNotEmpty(injector);
    assert.equal(injector.ClassName, "TestClass1");
    expect(injector.ClassConstructorArguments).contains("test");
    assert.exists(instance);
    assert.isNotEmpty(instance);
    assert.equal(instance.aString, "test");
  }

  @test
  public changeClassConstructorArgumentsOnInjector(): void {
    const injector: Injector<TestClass1> = new Injector(TestClass1, ["test"]);
    assert.exists(injector);
    assert.isNotEmpty(injector);
    assert.equal(injector.ClassName, "TestClass1");
    expect(injector.ClassConstructorArguments).contains("test");
    injector.ClassConstructorArguments = ["changed"];
    expect(injector.ClassConstructorArguments).contains("changed");
  }
}

// tslint:disable-next-line:max-classes-per-file
class TestClass1 {
  public aString: string;

  constructor(aString: string) {
    this.aString = aString;
  }
}
