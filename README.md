# rokkit.ts-dependency-injection

[![Build Status](https://travis-ci.com/rokkit-ts/rokkit.ts-dependency-injection.svg?branch=master)](https://travis-ci.com/rokkit-ts/rokkit.ts-dependency-injection)

TypeScript dependency injection library using decorators for the rokkit.ts framework and other projects.
It provides a simple API to register classes and create instances of them.
The instances are handled in one container called `RokkitDI`.

## Install and Build

To install the package:

```bash
npm install @rokkit.ts/dependency-injection
```

## Usage

You can use two different ways of using the whole package.

The first way is to register your classes by decorators.
The second way is to use the native API of the RokkitDI container.

### Using Decorators

The following example show a simple usage of the package.
The first listing shows the class that you want to be injected.

```typescript
import { Injectable, Inject } from '@rokkit.ts/dependency-injection'

@Injectable()
class DecoratedClass {
  public foo: string
  public bar: number

  constructor(@Inject('test') foo: string, @Inject(0.11) public bar: number) {
    this.foo = foo
    this.bar = bar
  }
}
```

After annotating the class, we can retrieve an singleton or an instance by the `RokkitDI`.
With this injector we could now create an instance of the corresponding class.

```typescript
import { RokkitDI } from '@rokkit.ts/dependency-injection'
const instance: DecoratedClass = RokkitDI.singletonOf('DecoratedClass')

console.log(`Foo: ${instance.foo}, Bar: ${instance.bar}`)
// Output: Foo: test, Bar: 0.11
```

#### Automatic Constructor Argument scanning

The package provides the ability to scan classes arguments automatically. If any constructor argument is not decorated with the <code>@Inject
(value:
any)</code> annotation, the base container tries to create automatically an instance for it.

#### Code Example

The first listing shows two classes the "FirstDecoratedClass" class has a dependency for the second class
"SecondDecoratedClass". Note that both class are annotated as <code>@Injectable</code>, but only the second class
has <code>@Inject</code>
annotation present on the constructor. The package will now scan all user source code files for the constructor
argument and automatically adds the found arguments. This allows you to create an instance of "FirstDecoratedClass"
without annotating the constructor with a specific value for user object.

By default the source code scan will look for the source code directory "./src". If you want to change this behavior
set the environment variable <code>SRC_SCAN_DIR</code> to you preferable directory before starting your application.

```typescript
import { Injectable, Inject } from '@rokkit.ts/dependency-injection'

@Injectable()
class FirstDecoratedClass {
  public classDependency: SecondDecoratedClass

  constructor(classDependency: SecondDecoratedClass) {
    this.classDependency = classDependency
  }
}

@Injectable()
class SecondDecoratedClass {
  public foo: string
  public bar: number

  constructor(@Inject('test') foo: string, @Inject(0.11) public bar: number) {
    this.foo = foo
    this.bar = bar
  }
}
```

### Use the native API

The native API let's you easy register an injectable class on the `RokkitDi` container.
In order to register a class you need to provide its arguments.

```typescript
import { RokkitDI } from '@rokkit.ts/dependency-injection'

class AClass {
  constructor(public foo: string, bar: number)
}

RokkitDI.registerInjectable(AClass, [
  { index: 0, type: 'string', value: 'test' },
  { index: 1, type: 'number', value: 0.11 }
])

const instance: AClass = RokkitDI.singletonOf('AClass')

console.log(`Foo: ${instance.foo}, Bar: ${instance.bar}`)
// Output: Foo: test, Bar: 0.11
```

## API Description

| Decorators |                                                |
| :--------: | :--------------------------------------------- |
|  Methods:  | <code>@Injectable(contextName?: string)</code> |
|            | <code>@Inject(value: any)</code>               |

|  Class:  | RokkitDI                                    |
| :------: | :------------------------------------------ |
| Methods: | <code>registerInjectable(Class)</code>      |
|          | <code>singletonOf(className: string)</code> |
|          | <code>instanceOf(className: string)</code>  |

## Contribution

All kinds of contributions are welcome, no matter how big or small.
Before you start to contribute please read our [Code of Conduct](./CODE_OF_CONDUCT.md).

In order to submit any contribution check out our [contribution guidelines](./CONTRIBUTION.md).

## License

Rokkit.ts-dependency-injection is Open Source software released under the MIT License.
