import { OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
export declare class TagRegistry implements OnApplicationBootstrap {
    private readonly discoveryService;
    private readonly providersByTag;
    constructor(discoveryService: DiscoveryService);
    onApplicationBootstrap(): void;
    get<T = unknown>(tag: string): readonly T[];
    private getMutable;
}
