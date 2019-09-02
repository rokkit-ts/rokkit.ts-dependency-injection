import { assert, expect } from "chai";
import { suite, test } from "mocha-typescript";
import dependencyInjectionAssembler from "../dependency-injection-assembler/dependencyInjectionAssembler";
import { Injector } from "../injector";
import { Inject, Injectable } from "./dependencyInjectionDecorators";

@suite
export class DependencyInjectionDecoratorSpec {
  @test
  public createAnnotatedInstance(): void {
    const injector:
      | Injector<TestClass>
      | undefined = dependencyInjectionAssembler.retrieveInjector("TestClass");

    assert.exists(injector);
    assert.isNotEmpty(injector);

    if (injector) {
      assert.equal(injector.ClassName, "TestClass");
      assert.exists(injector.ClassConstructorArguments);
      assert.isArray(injector.ClassConstructorArguments);
      expect(injector.ClassConstructorArguments).to.include("test");

      const instance: TestClass = injector.createInstance();
      assert.exists(instance);
      assert.isNotEmpty(instance);
      assert.equal(instance.aString, "test");
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
class TestClass {
  public aString: string;

  constructor(@Inject("test") aString: string) {
    this.aString = aString;
  }
}
