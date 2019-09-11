import { assert, expect } from "chai";
import { suite, test } from "mocha-typescript";
import dependencyInjectionAssembler from "../dependency-injection-assembler/dependencyInjectionAssembler";
import { DependencyInjectionDecoratorHelper } from "./dependencyInjectionDecoratorHelper";

@suite
export class DependencyInjectionDecoratorHelperSpec {
  @test
  public registerInjectorOnAssembler(): void {
    DependencyInjectionDecoratorHelper.registerInjectorOnAssembler(
      DependencyInjectionHelperTestClass
    );

    const injector = dependencyInjectionAssembler.retrieveInjector(
      "DependencyInjectionHelperTestClass"
    );
    assert.exists(injector);
    assert.isNotEmpty(injector);
  }

  @test
  public registerInjectorOnAssemblerWithFileName(): void {
    DependencyInjectionDecoratorHelper.registerInjectorOnAssembler(
      DependencyInjectionHelperTestClass
    );

    const injector = dependencyInjectionAssembler.retrieveInjector(
      "DependencyInjectionHelperTestClass"
    );
    assert.exists(injector);
    assert.isNotEmpty(injector);
  }

  @test
  public registerInjectableArgument(): void {
    DependencyInjectionDecoratorHelper.registerInjectableArgument(
      (DependencyInjectionHelperTestClass as any).constructor,
      0,
      "test"
    );

    const args: any[] = DependencyInjectionDecoratorHelper.getInjectorClassConstructorArguments(
      (DependencyInjectionHelperTestClass as any).constructor
    );

    assert.isNotEmpty(args);
    assert.isArray(args);
    assert.equal(args.length, 1);
    expect(args).deep.include({
      index: 0,
      type: "string",
      value: "test"
    });
  }
}

// tslint:disable-next-line:max-classes-per-file
class DependencyInjectionHelperTestClass {
  public aString: string;

  constructor(aString: string) {
    this.aString = aString;
  }
}
