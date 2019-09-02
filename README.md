# rokkit.ts-dependency-injection

TypeScript dependency injection library using decorators for the rokkit.ts framework and other projects.

## Install and Build

To install the package:

```bash
npm install rokkit.ts-di
```

## Usage

The following example show a simple usage of the package.
The first listing shows the class that you want to be injected.

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

The dependencyInjectionAssembler provides further methods to manage injectors.
Injectors are stored in contexts. Each context is used to separate injectors.
The dependencyInjectionAssembler provides a default context that will be used, if you will not provide furhter
information.

### API Description

| Decorators |                                                |
| :--------: | :--------------------------------------------- |
|  Methods:  | <code>@Injectable(contextName?: string)</code> |
|            | <code>@Inject(value: any)</code>               |

|  Class:  | dependencyInjectionAssembler                                                     |
| :------: | :------------------------------------------------------------------------------- |
| Methods: | <code>createContext(contextName: string)</code>                                  |
|          | <code>registerContext(context: DependencyInjectionContext)</code>                |
|          | <code>retrieveContext(contextName: string)</code>                                |
|          | <code>retrieveDefaultContext()</code>                                            |
|          | <code>doesContextExist(context: string &#124; DependencyInjectionContext)</code> |
|          | <code>registerInjector(injector: Injector<T>, contextName?: string)</code>       |
|          | <code>retrieveInjector(injectorName: string, contextName?: string)</code>        |
|          | <code>retrieveInjectorByDefaultContext(injectorName: string)</code>              |

## License

Rokkit.ts-dependency-injection is Open Source software released under the MIT License.
