var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { TagMetadata } from './decorator.js';
let TagRegistry = class TagRegistry {
    discoveryService;
    providersByTag = new Map();
    constructor(discoveryService) {
        this.discoveryService = discoveryService;
    }
    onApplicationBootstrap() {
        for (const providers of this.providersByTag.values()) {
            providers.length = 0;
        }
        for (const wrapper of this.discoveryService.getProviders()) {
            const tags = this.discoveryService.getMetadataByDecorator(TagMetadata, wrapper);
            if (tags === undefined || wrapper.instance === undefined) {
                continue;
            }
            for (const tag of tags) {
                this.getMutable(tag).push(wrapper.instance);
            }
        }
    }
    get(tag) {
        return this.getMutable(tag);
    }
    getMutable(tag) {
        let providers = this.providersByTag.get(tag);
        if (providers === undefined) {
            providers = [];
            this.providersByTag.set(tag, providers);
        }
        return providers;
    }
};
TagRegistry = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DiscoveryService])
], TagRegistry);
export { TagRegistry };
//# sourceMappingURL=tag.registry.js.map