export declare const Tag: import("@nestjs/core").DiscoverableDecorator<string>;
export declare function getTaggedServicesToken(tag: string): symbol;
export declare function InjectTaggedServices(tag: string): ParameterDecorator;
