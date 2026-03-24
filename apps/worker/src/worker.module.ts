import { Module, OnModuleInit } from '@nestjs/common';

import { ConfigurationModule } from '@libs/config';

@Module({
  imports: [ConfigurationModule.forRoot()],
})
export class WorkerModule implements OnModuleInit {
  private async waitFor(seconds: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, seconds * 1000));
  }

  async onModuleInit() {
    while (true) {
      await this.waitFor(1);
    }
  }
}
