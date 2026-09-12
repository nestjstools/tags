import { AppTaggedServicesConsumer } from './app.tagged-services.consumer.js';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppTaggedServicesConsumer);
    getHello(): string;
}
