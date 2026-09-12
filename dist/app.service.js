var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { Tag } from './tag/decorator.js';
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
AppService = __decorate([
    Injectable(),
    Tag('application')
], AppService);
export { AppService };
let AppService2 = class AppService2 {
    getHello() {
        return 'Hello World!';
    }
};
AppService2 = __decorate([
    Injectable(),
    Tag('application')
], AppService2);
export { AppService2 };
//# sourceMappingURL=app.service.js.map