import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { TagMetadata } from './decorator.js';

/**
 * A read-only index of singleton Nest providers grouped by their tags.
 * It is populated after Nest has initialized every module and before the
 * application starts accepting requests.
 */
@Injectable()
export class TagRegistry implements OnApplicationBootstrap {
  private readonly providersByTag = new Map<string, unknown[]>();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onApplicationBootstrap(): void {
    for (const providers of this.providersByTag.values()) {
      providers.length = 0;
    }

    for (const wrapper of this.discoveryService.getProviders()) {
      const tags = this.discoveryService.getMetadataByDecorator(
        TagMetadata,
        wrapper,
      );

      if (tags === undefined || wrapper.instance === undefined) {
        continue;
      }

      for (const tag of tags) {
        this.getMutable(tag).push(wrapper.instance);
      }
    }
  }

  get<T = unknown>(tag: string): readonly T[] {
    return this.getMutable(tag) as readonly T[];
  }

  private getMutable(tag: string): unknown[] {
    let providers = this.providersByTag.get(tag);
    if (providers === undefined) {
      providers = [];
      this.providersByTag.set(tag, providers);
    }

    return providers;
  }
}
