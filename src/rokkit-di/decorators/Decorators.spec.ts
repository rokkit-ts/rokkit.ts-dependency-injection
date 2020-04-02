import { Inject, Injectable } from './Decorators'
import { RokkitDI } from '../RokkitDI'

describe('DependencyInjectionDecorators', () => {
  it('should create singleton for simple decorated class', () => {
    const instance: DependencyClass = RokkitDI.singletonOf('DependencyClass')
    expect(instance).toBeDefined()
    expect(instance.aString).toEqual('testDep')
  })

  it('should create singleton for complex decorated class', () => {
    const instance: DecoratedTestClass = RokkitDI.singletonOf(
      'DecoratedTestClass'
    )
    expect(instance).toBeDefined()
    expect(instance.aString).toEqual('test')
    expect(instance.dependency).toBeDefined()
    expect(instance.dependency.aString).toEqual('testDep')
  })
})

// tslint:disable-next-line:max-classes-per-file
@Injectable()
class DependencyClass {
  public aString: string

  constructor(@Inject('testDep') aString: string) {
    this.aString = aString
  }
}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
class DecoratedTestClass {
  public dependency: DependencyClass
  public aString: string

  constructor(@Inject('test') aString: string, dependency: DependencyClass) {
    this.aString = aString
    this.dependency = dependency
  }
}
