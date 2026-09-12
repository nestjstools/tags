export declare const TagMetadata: import("@nestjs/core").DiscoverableDecorator<readonly string[]>;
export declare function Tag(...tags: string[]): ClassDecorator;
export declare function getTaggedServicesToken(tag: string): symbol;
export declare function InjectTaggedServices(tag: string): ParameterDecorator;
