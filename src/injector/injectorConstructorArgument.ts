/**
 * @interface InjectorConstructorArgument
 * Stores the constructor argument of an injector.
 * Each argument consits out of an index, type and a value.
 * The value can be undefined due to UserClassTypes. These types will be retrieved by the
 * dependencyInjectionAssembler by the injectors.
 */
export interface InjectorConstructorArgument {
  index: number;
  type: string;
  value?: any;
}
