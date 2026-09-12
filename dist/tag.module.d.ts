import { DynamicModule } from '@nestjs/common';
export declare class TagModule {
    static forRoot(): DynamicModule;
    static forFeature(...tags: string[]): DynamicModule;
}
