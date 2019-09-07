import { assert, expect } from "chai";
import { suite, test } from "mocha-typescript";
import { Injector } from "./injector";
import { InjectorFactory } from "./injectorFactory";

@suite()
export class InjectorFactorySpec {
  @test()
  public createInjectorWithAnyArgList(): void {
    const injector: Injector<
      InjectorFactoryTestClass
    > = InjectorFactory.createInjector(InjectorFactoryTestClass, ["test"]);
    const instance: InjectorFactoryTestClass = injector.createInstance();
    assert.exists(injector);
    assert.isNotEmpty(injector);
    assert.equal(injector.ClassName, "InjectorFactoryTestClass");
    expect(injector.ClassConstructorArguments[0]).deep.include({
      index: 0,
      type: "string",
      value: "test"
    });
    assert.exists(instance);
    assert.isNotEmpty(instance);
    assert.equal(instance.aString, "test");
  }

  @test()
  public createInjectorWithInjectorArgList(): void {
    const injector: Injector<
      InjectorFactoryTestClass
    > = InjectorFactory.createInjector(InjectorFactoryTestClass, [
      {
        index: 0,
        type: "string",
        value: "test"
      }
    ]);
    const instance: InjectorFactoryTestClass = injector.createInstance();
    assert.exists(injector);
    assert.isNotEmpty(injector);
    assert.equal(injector.ClassName, "InjectorFactoryTestClass");
    expect(injector.ClassConstructorArguments[0]).deep.include({
      index: 0,
      type: "string",
      value: "test"
    });
    assert.exists(instance);
    assert.isNotEmpty(instance);
    assert.equal(instance.aString, "test");
  }
}

// tslint:disable-next-line:max-classes-per-file
class InjectorFactoryTestClass {
  public aString: string;

  constructor(aString: string) {
    this.aString = aString;
  }
}
