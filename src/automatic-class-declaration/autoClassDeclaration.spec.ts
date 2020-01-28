import { assert, expect } from "chai";
import { suite, test } from "mocha-typescript";
import { InjectorConstructorArgument } from "../injector";
import autoClassDeclaration from "./autoClassDeclaration";

@suite
export class AutoClassDeclarationSpec {
  @test
  public getClassDeclarationsForDefaultPath(): void {
    const classDeclarations = autoClassDeclaration.ClassDeclarations;
    assert.exists(classDeclarations);
    assert.isArray(classDeclarations);
    assert.isNotEmpty(classDeclarations);
  }

  @test
  public getClassDeclarationsByClassName(): void {
    const classDeclaration = autoClassDeclaration.getClassDeclarationByClassName(
      "AutoClassDeclarationTestClass"
    );
    assert.exists(classDeclaration);
    assert.isNotEmpty(classDeclaration);
    if (classDeclaration) {
      assert.equal(
        classDeclaration.sourceFilePath,
        __filename.replace(/\\/g, "/")
      );
      assert.equal(
        classDeclaration.compiledFilePath,
        (__filename.substr(0, __filename.lastIndexOf(".ts")) + ".js")
          .replace(/\\/g, "/")
          .replace("src", "build")
      );
      assert.equal(
        classDeclaration.classInformation.className,
        "AutoClassDeclarationTestClass"
      );
      classDeclaration.classInformation.constructors.forEach(constructor => {
        expect(constructor.parameters).to.deep.include({
          name: "aString",
          type: "string"
        });
      });
    }
  }

  @test
  public getClassDeclarationsByClassNameAndFileName(): void {
    const classDeclaration = autoClassDeclaration.getClassDeclarationByFileAndClassName(
      __filename,
      "AutoClassDeclarationTestClass"
    );
    assert.exists(classDeclaration);
    assert.isNotEmpty(classDeclaration);
    if (classDeclaration) {
      assert.equal(
        classDeclaration.sourceFilePath,
        __filename.replace(/\\/g, "/")
      );
      assert.equal(
        classDeclaration.compiledFilePath,
        (__filename.substr(0, __filename.lastIndexOf(".")) + ".js")
          .replace(/\\/g, "/")
          .replace("src", "build")
      );
      assert.equal(
        classDeclaration.classInformation.className,
        "AutoClassDeclarationTestClass"
      );
      classDeclaration.classInformation.constructors.forEach(constructor => {
        expect(constructor.parameters).to.deep.include({
          name: "aString",
          type: "string"
        });
      });
    }
  }

  @test
  public mapOldToNewCtorArguments(): void {
    const classDeclaration = autoClassDeclaration.getClassDeclarationByClassName(
      "AutoClassDeclarationTestClass"
    );
    const injectorClassArgsOld: InjectorConstructorArgument[] = [
      {
        index: 0,
        type: "string",
        value: "test"
      }
    ];
    assert.exists(classDeclaration);
    if (classDeclaration) {
      const injectorClassArgs = autoClassDeclaration.mapOldToNewCtorArguments(
        classDeclaration.classInformation.constructors[0].parameters,
        injectorClassArgsOld
      );
      assert.exists(injectorClassArgs);
      assert.isArray(injectorClassArgs);
      assert.isNotEmpty(injectorClassArgs);
      expect(injectorClassArgs).to.deep.include({
        index: 0,
        type: "string",
        value: "test"
      });
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
class AutoClassDeclarationTestClass {
  // tslint:disable-next-line:no-empty
  constructor(aString: string) {}
}
