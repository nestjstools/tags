var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TagModule_1;
import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TagRegistry } from './tag.registry.js';
import { getTaggedServicesToken } from './decorator.js';
let TagModule = TagModule_1 = class TagModule {
    static forRoot() {
        return {
            module: TagModule_1,
            global: true,
            imports: [DiscoveryModule],
            providers: [TagRegistry],
            exports: [TagRegistry],
        };
    }
    static forFeature(...tags) {
        const providers = tags.map((tag) => ({
            provide: getTaggedServicesToken(tag),
            inject: [TagRegistry],
            useFactory: (registry) => registry.get(tag),
        }));
        return {
            module: TagModule_1,
            providers,
            exports: providers,
        };
    }
};
TagModule = TagModule_1 = __decorate([
    Global(),
    Module({})
], TagModule);
export { TagModule };
//# sourceMappingURL=tag.module.js.map