type Factory<T> = () => T

export class ServiceProvider {
  private static factories = new Map<string, Factory<unknown>>()
  private static instances = new Map<string, unknown>()

  static register<T>(key: string, factory: Factory<T>): void {
    this.factories.set(key, factory)
    this.instances.delete(key)
  }

  static get<T>(key: string): T {
    const existing = this.instances.get(key)
    if (existing !== undefined) {
      return existing as T
    }

    const factory = this.factories.get(key)
    if (!factory) {
      throw new Error(`Service "${key}" is not registered`)
    }

    const instance = factory()
    this.instances.set(key, instance)
    return instance as T
    
  }
}