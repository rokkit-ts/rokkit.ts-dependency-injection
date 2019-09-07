import { assert, expect } from "chai";
import { suite, test } from "mocha-typescript";
import dependencyInjectionAssembler from "../dependency-injection-assembler/dependencyInjectionAssembler";
import { Injector } from "./injector";

@suite()
export class InjectorSpec {
  @test
  public createInjector(): void {
    const injector: Injector<InjectorTestClass> = new Injector(
      InjectorTestClass,
      [
        {
          index: 0,
          type: "string",
          value: "test"
        }
      ]
    );
    const instance: InjectorTestClass = injector.createInstance();
    assert.exists(injector);
    assert.isNotEmpty(injector);
    assert.equal(injector.ClassName, "InjectorTestClass");
    expect(injector.ClassConstructorArguments).deep.include({
      index: 0,
      type: "string",
      value: "test"
    });
    assert.exists(instance);
    assert.isNotEmpty(instance);
    assert.equal(instance.aString, "test");
  }

  @test
  public provideNativeArgumentWithOutValueAndExpectToThrowError(): void {
    const injector: Injector<InjectorTestClass> = new Injector(
      InjectorTestClass,
      [
        {
          index: 0,
          type: "string",
          value: undefined
        }
      ]
    );

    expect(() => injector.createInstance()).to.throw(
      "Could not instantiate native values without the @Inject annotation."
    );
  }

  @test
  public noRegisteredUserDependencyExpectToThrowError(): void {
    const injector: Injector<InjectorTestClassWithUserObject> = new Injector(
      InjectorTestClassWithUserObject,
      [
        {
          index: 0,
          type: "string",
          value: "test"
        },
        {
          index: 1,
          type: "InjectorTestClass",
          value: undefined
        }
      ]
    );

    expect(() => injector.createInstance()).to.throw(
      "It is not possible to find an injector of type: InjectorTestClass."
    );
  }

  @test
  public registeredUserDependencyExpectInstanceCreated(): void {
    const injector: Injector<InjectorTestClassWithUserObject> = new Injector(
      InjectorTestClassWithUserObject,
      [
        {
          index: 0,
          type: "string",
          value: "test"
        },
        {
          index: 1,
          type: "InjectorTestClass",
          value: undefined
        }
      ]
    );

    const injectorDep: Injector<InjectorTestClass> = new Injector(
      InjectorTestClass,
      [
        {
          index: 0,
          type: "string",
          value: "test"
        }
      ]
    );

    dependencyInjectionAssembler.registerInjector(injectorDep);

    const instance: InjectorTestClassWithUserObject = injector.createInstance();
    assert.exists(instance);
    assert.isNotEmpty(instance);
    assert.equal(instance.aString, "test");
    assert.exists(instance.dependency);
    assert.isNotEmpty(instance.dependency);
    assert.equal(instance.dependency.aString, "test");
  }

  @test
  public changeClassConstructorArgumentsOnInjector(): void {
    const injector: Injector<InjectorTestClass> = new Injector(
      InjectorTestClass,
      [
        {
          index: 0,
          type: "string",
          value: "test"
        }
      ]
    );
    assert.exists(injector);
    assert.isNotEmpty(injector);
    assert.equal(injector.ClassName, "InjectorTestClass");
    expect(injector.ClassConstructorArguments).deep.include({
      index: 0,
      type: "string",
      value: "test"
    });
    injector.ClassConstructorArguments = [
      {
        index: 0,
        type: "string",
        value: "changed"
      }
    ];
    expect(injector.ClassConstructorArguments).deep.include({
      index: 0,
      type: "string",
      value: "changed"
    });
  }
}

// tslint:disable-next-line:max-classes-per-file
class InjectorTestClass {
  public aString: string;

  constructor(aString: string) {
    this.aString = aString;
  }
}

// tslint:disable-next-line:max-classes-per-file
class InjectorTestClassWithUserObject {
  public aString: string;
  public dependency: InjectorTestClass;

  constructor(aString: string, dependency: InjectorTestClass) {
    this.aString = aString;
    this.dependency = dependency;
  }
}
