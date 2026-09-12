import { DiscoveryService } from '@nestjs/core';
import { Inject } from '@nestjs/common';

/** Internal metadata decorator used while discovering tagged providers. */
export const TagMetadata = DiscoveryService.createDecorator<readonly string[]>();

/**
 * Marks a Nest provider as belonging to one or more named tags.
 *
 * Tagged classes must still be registered as providers in a Nest module. A
 * provider appears once in each tagged collection, even if a tag is repeated.
 */
export function Tag(...tags: string[]): ClassDecorator {
  const uniqueTags = [...new Set(tags)];

  if (uniqueTags.length === 0 || uniqueTags.some((tag) => tag.trim() === '')) {
    throw new Error('Tag requires at least one non-empty tag name.');
  }

  return TagMetadata(uniqueTags);
}

/** A token used by `TagModule.forFeature()` and `InjectTaggedServices()`. */
export function getTaggedServicesToken(tag: string): symbol {
  return Symbol.for(`tags:services:${tag}`);
}

export function InjectTaggedServices(tag: string): ParameterDecorator {
  return Inject(getTaggedServicesToken(tag));
}
