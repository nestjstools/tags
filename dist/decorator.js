import { DiscoveryService } from '@nestjs/core';
import { Inject } from '@nestjs/common';
export const TagMetadata = DiscoveryService.createDecorator();
export function Tag(...tags) {
    const uniqueTags = [...new Set(tags)];
    if (uniqueTags.length === 0 || uniqueTags.some((tag) => tag.trim() === '')) {
        throw new Error('Tag requires at least one non-empty tag name.');
    }
    return TagMetadata(uniqueTags);
}
export function getTaggedServicesToken(tag) {
    return Symbol.for(`tags:services:${tag}`);
}
export function InjectTaggedServices(tag) {
    return Inject(getTaggedServicesToken(tag));
}
//# sourceMappingURL=decorator.js.map