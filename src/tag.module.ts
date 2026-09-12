import { DynamicModule, Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TagRegistry } from './tag.registry.js';
import { getTaggedServicesToken } from './decorator.js';

@Global()
@Module({})
export class TagModule {
  /**
   * Register this once, preferably in the root module.
   *
   * The registry is global so tagged providers can inject it from any module.
   */
  static forRoot(): DynamicModule {
    return {
      module: TagModule,
      global: true,
      imports: [DiscoveryModule],
      providers: [TagRegistry],
      exports: [TagRegistry],
    };
  }

  /**
   * Makes tagged providers injectable in the importing feature module.
   *
   * `TagModule.forRoot()` must be imported once by the root module first.
   */
  static forFeature(...tags: string[]): DynamicModule {
    const providers = tags.map((tag) => ({
      provide: getTaggedServicesToken(tag),
      inject: [TagRegistry],
      useFactory: (registry: TagRegistry) => registry.get(tag),
    }));

    return {
      module: TagModule,
      providers,
      exports: providers,
    };
  }
}
