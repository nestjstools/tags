import { DiscoveryService } from '@nestjs/core';
import { Inject } from '@nestjs/common';
export const Tag = DiscoveryService.createDecorator();
export function getTaggedServicesToken(tag) {
    return Symbol.for(`tags:services:${tag}`);
}
export function InjectTaggedServices(tag) {
    return Inject(getTaggedServicesToken(tag));
}
//# sourceMappingURL=decorator.js.map