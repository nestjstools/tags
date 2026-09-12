import { DiscoveryService } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';
import { TagMetadata } from './decorator.js';
import { TagRegistry } from './tag.registry.js';

type ProviderWrapper = {
  instance?: unknown;
  tags?: readonly string[];
};

function createRegistry(providers: ProviderWrapper[]): TagRegistry {
  const discoveryService = {
    getProviders: vi.fn(() => providers),
    getMetadataByDecorator: vi.fn(
      (_decorator: unknown, wrapper: ProviderWrapper) => wrapper.tags,
    ),
  } as unknown as DiscoveryService;

  return new TagRegistry(discoveryService);
}

describe('TagRegistry', () => {
  it('groups an existing provider instance under each of its tags', () => {
    const paymentStrategy = { name: 'stripe' };
    const auditListener = { name: 'audit' };
    const registry = createRegistry([
      { instance: paymentStrategy, tags: ['payment', 'auditable'] },
      { instance: auditListener, tags: ['auditable'] },
      { tags: ['payment'] },
    ]);

    registry.onApplicationBootstrap();

    expect(registry.get('payment')).toEqual([paymentStrategy]);
    expect(registry.get('auditable')).toEqual([
      paymentStrategy,
      auditListener,
    ]);
    expect(registry.get('missing')).toEqual([]);
  });

  it('keeps injected arrays stable and refreshes their contents', () => {
    const firstProvider = { name: 'first' };
    const secondProvider = { name: 'second' };
    const providers: ProviderWrapper[] = [
      { instance: firstProvider, tags: ['example'] },
    ];
    const registry = createRegistry(providers);
    const injectedServices = registry.get('example');

    registry.onApplicationBootstrap();
    expect(injectedServices).toEqual([firstProvider]);

    providers.splice(0, 1, { instance: secondProvider, tags: ['example'] });
    registry.onApplicationBootstrap();

    expect(registry.get('example')).toBe(injectedServices);
    expect(injectedServices).toEqual([secondProvider]);
  });

  it('uses the tag metadata decorator when discovering providers', () => {
    const provider = { instance: {}, tags: ['example'] };
    const discoveryService = {
      getProviders: vi.fn(() => [provider]),
      getMetadataByDecorator: vi.fn(
        (_decorator: unknown, wrapper: ProviderWrapper) => wrapper.tags,
      ),
    } as unknown as DiscoveryService;
    const registry = new TagRegistry(discoveryService);

    registry.onApplicationBootstrap();

    expect(discoveryService.getMetadataByDecorator).toHaveBeenCalledWith(
      TagMetadata,
      provider,
    );
  });
});
