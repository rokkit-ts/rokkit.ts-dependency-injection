import { Injector } from './injector'

describe('Injector', () => {
  it('should create an instance of the injector', () => {
    const injector: Injector<InjectorTestClass> = new Injector(
      InjectorTestClass,
      [
        {
          index: 0,
          type: 'string',
          value: 'test'
        }
      ]
    )
    const instance: InjectorTestClass = injector.createInstance()

    expect(instance).toBeDefined()
    expect(instance).toEqual(new InjectorTestClass('test'))
  })

  it('should throw error when the value of native argument is undefined', () => {
    const injector: Injector<InjectorTestClass> = new Injector(
      InjectorTestClass,
      [
        {
          index: 0,
          type: 'string',
          value: undefined
        }
      ]
    )

    expect(() => injector.createInstance()).toThrow(
      'Could not instantiate class InjectorTestClass due to: Missing value for argument string at index 0'
    )
  })

  it('should throw error when object argument could not be found.', () => {
    const injector: Injector<InjectorTestClassWithUserObject> = new Injector(
      InjectorTestClassWithUserObject,
      [
        {
          index: 0,
          type: 'string',
          value: 'test'
        },
        {
          index: 1,
          type: 'InjectorTestClass',
          value: undefined
        }
      ]
    )

    expect(() => injector.createInstance()).toThrowError(
      'Could not instantiate class InjectorTestClassWithUserObject due to: Missing value for argument InjectorTestClass at index 1'
    )
  })

  it('should create instance when the correct obj args are passed', () => {
    const injector: Injector<InjectorTestClassWithUserObject> = new Injector(
      InjectorTestClassWithUserObject,
      [
        {
          index: 0,
          type: 'string',
          value: 'test'
        },
        {
          index: 1,
          type: 'InjectorTestClass',
          value: new InjectorTestClass('test')
        }
      ]
    )

    const instance: InjectorTestClassWithUserObject = injector.createInstance()
    expect(instance).toBeDefined()
    expect(instance.aString).toEqual('test')
    expect(instance.dependency).toBeDefined()
    expect(instance.dependency.aString).toEqual('test')
  })
})

// tslint:disable-next-line:max-classes-per-file
class InjectorTestClass {
  public aString: string

  constructor(aString: string) {
    this.aString = aString
  }
}

// tslint:disable-next-line:max-classes-per-file
class InjectorTestClassWithUserObject {
  public aString: string
  public dependency: InjectorTestClass

  constructor(aString: string, dependency: InjectorTestClass) {
    this.aString = aString
    this.dependency = dependency
  }
}
