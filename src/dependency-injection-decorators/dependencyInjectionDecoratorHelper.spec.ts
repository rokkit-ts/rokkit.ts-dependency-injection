import { assert, expect } from "chai";
import { suite, test } from "mocha-typescript";
import dependencyInjectionAssembler from "../dependency-injection-assembler/dependencyInjectionAssembler";
import { DependencyInjectionDecoratorHelper } from "./dependencyInjectionDecoratorHelper";

@suite
export class DependencyInjectionDecoratorHelperSpec {
  @test
  public registerInjectorOnAssembler(): void {
    DependencyInjectionDecoratorHelper.registerInjectorOnAssembler(TestClass1);

    const injector = dependencyInjectionAssembler.retrieveInjector(
      "TestClass1"
    );
    assert.exists(injector);
    assert.isNotEmpty(injector);
  }

  @test
  public registerInjectableArgument(): void {
    DependencyInjectionDecoratorHelper.registerInjectableArgument(
      (TestClass1 as any).constructor,
      0,
      "test"
    );

    const args: any[] = DependencyInjectionDecoratorHelper.getInjectorClassConstructorArguments(
      (TestClass1 as any).constructor
    );

    assert.isNotEmpty(args);
    assert.isArray(args);
    assert.equal(args.length, 1);
    expect(args).to.include("test");
  }
}

// tslint:disable-next-line:max-classes-per-file
class TestClass1 {
  public aString: string;

  constructor(aString: string) {
    this.aString = aString;
  }
}
