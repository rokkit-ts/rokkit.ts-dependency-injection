# rokkit.ts-dependency-injection

TypeScript dependency injection library using decorators for the rokkit.ts framework and other projects.

## Install and Build

To install the package:

```bash
npm install rokkit.ts-di
```

## Usage

Class that you want to be injected:

```typescript
import { Injectable, Inject } from "rokkit.ts-di";

@Injectable()
class DecoratedClass {
  public foo: string;
  public bar: number;

  constructor(@Inject("test") foo: string, @Inject(0.11) public bar: number) {
    this.foo = foo;
    this.bar = bar;
  }
}
```

After annotating the class, we could retrieve the injector by the "dependencyInjectionAssembler".
With this injector we could now create an instance of the corresponding class.

```typescript
import { dependencyInjectionAssembler, Injector } from "rokkit.ts-di";

const injector: Injector<
  DecoratedClass
> = dependencyInjectionAssembler.retrieveInjector("DecoratedClass");
const instance: DecoratedClass = injector.resolveInstance();

console.log(`Foo: ${instance.foo}, Bar: ${instance.bar}`);
// Output: Foo: test, Bar: 0.11
```

## License

Rokkit.ts-dependency-injection is Open Source software released under the MIT License.
