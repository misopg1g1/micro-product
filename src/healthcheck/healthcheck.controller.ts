import { Controller, Get } from '@nestjs/common';
import { HealthcheckService } from './healthcheck.service';

@Controller('health')
export class HealthcheckController {
  constructor(private healthcheckService: HealthcheckService) {}

  @Get()
  async health() {
    return await this.healthcheckService.health();
  }
}
