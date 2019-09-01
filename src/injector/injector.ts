export class Injector<T extends object> {
  private readonly className: string;
  private readonly classType: new (...args: any[]) => T;
  private classConstructorArguments: any[];

  public constructor(
    className: string,
    classConstructor: new (...args: any[]) => T,
    classConstructorArguments: any[]
  ) {
    this.className = className;
    this.classType = classConstructor;
    this.classConstructorArguments = classConstructorArguments;
  }

  public get ClassName(): string {
    return this.className;
  }

  public get ClassConstructorArguments() {
    return this.classConstructorArguments;
  }

  public set ClassConstructorArguments(classConstructorArguments: any[]) {
    this.classConstructorArguments = classConstructorArguments;
  }

  public createInstance(): T {
    return new this.classType(...this.classConstructorArguments);
  }
}
