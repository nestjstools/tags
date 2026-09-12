<p align="center">
    <image src="nestjstools-logo.png" width="400" alt="NestJSTools Logo" />
</p>

# @nestjstools/tags

Collect NestJS providers marked with a tag and access their existing singleton instances as a group. It is useful for strategy, handler, plugin, and adapter patterns where one service selects from many implementations.

## Install

```bash
npm install @nestjstools/tags
```
or
```bash
yarn add @nestjstools/tags
```

## What this solves

This is a general multi-provider discovery mechanism. Mark providers with the same tag and receive the existing Nest singleton instances as a group. The consumer decides how to use that group.

A provider can belong to more than one group:

```ts
@Injectable()
@Tag('payment-strategy', 'auditable')
export class StripePaymentStrategy {}
```

The same Nest instance appears in both collections. Repeating a tag in one decorator call does not create a duplicate entry.

- **Strategy or factory:** select one implementation by capability or input.
- **Chain of responsibility:** try handlers in order until one handles the request.
- **Plugin or observer model:** execute every registered extension for an event or extension point.
- **Composite service:** combine several implementations behind one facade.
- **Rules and pipelines:** run validation rules, enrichers, or transformation steps in sequence.
- **Modular integrations:** feature modules can contribute adapters without editing a central `switch` statement.

## Strategy pattern - example implementation with this library

This example chooses an email delivery strategy at runtime. Both strategies are ordinary Nest providers; `@Tag()` only adds metadata that the module discovers.

```ts
// email.strategy.ts
export interface EmailStrategy {
  supports(recipient: string): boolean;
  send(recipient: string, body: string): Promise<void>;
}
```

```ts
// smtp-email.strategy.ts
import { Injectable } from '@nestjs/common';
import { Tag } from '@nestjstools/tags';
import type { EmailStrategy } from './email.strategy.js';

@Injectable()
@Tag('email-strategy')
export class SmtpEmailStrategy implements EmailStrategy {
  supports(recipient: string): boolean {
    return !recipient.endsWith('@example.test');
  }

  async send(recipient: string, body: string): Promise<void> {
    // Send with SMTP.
  }
}
```

```ts
// sandbox-email.strategy.ts
import { Injectable } from '@nestjs/common';
import { Tag } from '@nestjstools/tags';
import type { EmailStrategy } from './email.strategy.js';

@Injectable()
@Tag('email-strategy')
export class SandboxEmailStrategy implements EmailStrategy {
  supports(recipient: string): boolean {
    return recipient.endsWith('@example.test');
  }

  async send(recipient: string, body: string): Promise<void> {
    // Store the email in a sandbox instead of sending it.
  }
}
```

Register the tag infrastructure once at the application root. Import `forFeature()` in a module that injects a particular tag.

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { TagModule } from '@nestjstools/tags';
import { EmailModule } from './email.module.js';

@Module({
  imports: [TagModule.forRoot(), EmailModule],
})
export class AppModule {}
```

```ts
// email.module.ts
import { Module } from '@nestjs/common';
import { TagModule } from '@nestjstools/tags';
import { EmailService } from './email.service.js';
import { SandboxEmailStrategy } from './sandbox-email.strategy.js';
import { SmtpEmailStrategy } from './smtp-email.strategy.js';

@Module({
  imports: [TagModule.forFeature('email-strategy')],
  providers: [EmailService, SmtpEmailStrategy, SandboxEmailStrategy],
})
export class EmailModule {}
```

Inject all implementations tagged as `email-strategy` into the consumer:

```ts
// email.service.ts
import { Injectable } from '@nestjs/common';
import { InjectTaggedServices } from '@nestjstools/tags';
import type { EmailStrategy } from './email.strategy.js';

@Injectable()
export class EmailService {
  constructor(
    @InjectTaggedServices('email-strategy')
    private readonly strategies: readonly EmailStrategy[],
  ) {}

  async send(recipient: string, body: string): Promise<void> {
    const strategy = this.strategies.find((item) => item.supports(recipient));

    if (!strategy) {
      throw new Error(`No email strategy supports ${recipient}`);
    }

    await strategy.send(recipient, body);
  }
}
```

## Dynamic lookup

Use `TagRegistry` when the tag is not known until runtime. This requires only `TagModule.forRoot()`.

```ts
import { Injectable } from '@nestjs/common';
import { TagRegistry } from '@nestjstools/tags';
import type { EmailStrategy } from './email.strategy.js';

@Injectable()
export class PluginService {
  constructor(private readonly tags: TagRegistry) {}

  getEmailStrategies(): readonly EmailStrategy[] {
    return this.tags.get<EmailStrategy>('email-strategy');
  }
}
```

## Lifecycle and scope

The registry is populated during Nest's application bootstrap. The injected array is therefore ready in request handlers and lifecycle hooks after bootstrap, but should not be consumed from the receiving service's constructor body.

Tags represent existing Nest singleton instances; they do not create copies. Request-scoped and transient providers are not suitable for shared tagged collections.
