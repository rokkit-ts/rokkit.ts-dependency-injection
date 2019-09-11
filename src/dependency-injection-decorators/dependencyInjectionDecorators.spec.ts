import { assert } from "chai";
import { suite, test } from "mocha-typescript";
import dependencyInjectionAssembler from "../dependency-injection-assembler/dependencyInjectionAssembler";
import { Injector } from "../injector";
import { Inject, Injectable } from "./dependencyInjectionDecorators";

@suite
export class DependencyInjectionDecoratorSpec {
  @test
  public createAnnotatedInstance(): void {
    const injector:
      | Injector<DecoratedTestClass>
      | undefined = dependencyInjectionAssembler.retrieveInjector(
      "DecoratedTestClass"
    );

    assert.exists(injector);
    assert.isNotEmpty(injector);

    if (injector) {
      assert.equal(injector.ClassName, "DecoratedTestClass");
      assert.exists(injector.ClassConstructorArguments);
      assert.isArray(injector.ClassConstructorArguments);
      assert.equal(injector.ClassConstructorArguments.length, 2);
      const instance: DecoratedTestClass = injector.createInstance();
      assert.exists(instance);
      assert.isNotEmpty(instance);
      assert.equal(instance.aString, "test");
      assert.exists(instance.dependency);
      assert.isNotEmpty(instance.dependency);
      assert.equal(instance.dependency.aString, "testDep");
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
@Injectable(__filename)
class DependencyClass {
  public aString: string;

  constructor(@Inject("testDep") aString: string) {
    this.aString = aString;
  }
}

// tslint:disable-next-line:max-classes-per-file
@Injectable(__filename)
class DecoratedTestClass {
  public dependency: DependencyClass;
  public aString: string;

  constructor(@Inject("test") aString: string, dependency: DependencyClass) {
    this.aString = aString;
    this.dependency = dependency;
  }
}
