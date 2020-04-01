import { RokkitDI } from './RokkitDI'

describe('RokkitDI', () => {
  it('should register an injectable component and instantiate a singleton of it', () => {
    const singleton: Test2 = RokkitDI.registerInjectable(Test2, [
      { index: 0, type: 'string', value: 'some string' }
    ]).singletonOf('Test2')

    const singleton2: Test2 = RokkitDI.singletonOf('Test2')
    expect(singleton).toBeDefined()
    expect(singleton.aString).toEqual('some string')
    expect(singleton).toBe(singleton2)
  })

  it('should register an injectable component and instantiate a instance of it', () => {
    const instance: Test2 = RokkitDI.registerInjectable(Test2, [
      { index: 0, type: 'string', value: 'some string' }
    ]).instanceOf('Test2')

    const instance2: Test2 = RokkitDI.instanceOf('Test2')
    expect(instance).toBeDefined()
    expect(instance.aString).toEqual('some string')
    expect(instance).not.toBe(instance2)
  })

  it('should update the dependencies of an injectable and instantiate it', () => {
    RokkitDI.registerInjectable(Test, [
      { index: 0, type: 'string', value: 'some string for test1' }
    ]).registerInjectable(Test2, [
      { index: 0, type: 'string', value: 'some string' }
    ])

    const instance: Test = RokkitDI.singletonOf('Test')

    expect(instance).toBeDefined()
    expect(instance.aString).toEqual('some string for test1')
    expect(instance.anObject).toEqual(new Test2('some string'))
  })
})

class Test {
  constructor(public aString: string, public anObject: Test2) {}
}

// tslint:disable-next-line: max-classes-per-file
class Test2 {
  constructor(public aString: string) {}
}
