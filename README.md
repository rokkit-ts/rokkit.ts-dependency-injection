# rokkit.ts-dependency-injection

TypeScript dependency injection library using decorators for the rokkit.ts framework and other projects.

## Install and Build

To install the package:

```bash
npm install @rokkit.ts/dependency-injection
```

## Usage

The following example show a simple usage of the package.
The first listing shows the class that you want to be injected.

```typescript
import { Injectable, Inject } from "@rokkit.ts/dependency-injection";

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
import {
  dependencyInjectionAssembler,
  Injector
} from "@rokkit.ts/dependency-injection";

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

### Automatic Constructor Argument scanning

The package provides the ability to scan classes arguments automatically. Furthermore the injector will look up
userObjects in the dependencyInjectionAssembler if any construcotr argument is not decorated with the <code>@Inject(value:
any)</code> annotation.

#### Code Example

The first listing shows two classes the "FirstDecoratedClass" class has a dependency for the second class
"SecondDecoratedClass". Note that both class are annotated as "@Injectable", but only the second class has "@Inject"
annotation present on the constructor. The package will now scan all user source code files for the constructor
argument and automatically adds the found arguments. This allows you to create an instance of "FirstDecoratedClass"
without annotating the constructor with a specific value for user object.

By default the source code scan will look for the source code directory "./src". If you want to change this behavior
set the environment variable <code>SRC_SCAN_DIR</code> to you preferable directory before starting your application.

```typescript
import { Injectable, Inject } from "@rokkit.ts/dependency-injection";

@Injectable()
class FirstDecoratedClass {
  public classDependency: SecondDecoratedClass;

  constructor(classDependency: SecondDecoratedClass) {
    this.classDependency = classDependency;
  }
}

@Injectable()
class SecondDecoratedClass {
  public foo: string;
  public bar: number;

  constructor(@Inject("test") foo: string, @Inject(0.11) public bar: number) {
    this.foo = foo;
    this.bar = bar;
  }
}
```

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

## Contribution

If you want to contribute to the project, please don't hesitate to send feedback, create issues or a pull request for
open ones.

## License

Rokkit.ts-dependency-injection is Open Source software released under the MIT License.
