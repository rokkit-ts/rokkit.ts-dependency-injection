import { assert, expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Injector } from "./injector";
import { InjectorFactory } from "./injectorFactory";

@suite()
export class InjectorFactorySpec {
  @test()
  public createInjector(): void {
    const injector: Injector<TestClass1> = InjectorFactory.createInjector(
      TestClass1,
      ["test"]
    );
    const instance: TestClass1 = injector.createInstance();
    assert.exists(injector);
    assert.isNotEmpty(injector);
    assert.equal(injector.ClassName, "TestClass1");
    expect(injector.ClassConstructorArguments).contains("test");
    assert.exists(instance);
    assert.isNotEmpty(instance);
    assert.equal(instance.aString, "test");
  }
}

// tslint:disable-next-line:max-classes-per-file
class TestClass1 {
  public aString: string;

  constructor(aString: string) {
    this.aString = aString;
  }
}
