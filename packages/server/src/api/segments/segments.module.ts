import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudiencesHelper } from '../audiences/audiences.helper';
import { CustomersModule } from '../customers/customers.module';
import { WorkflowsModule } from '../workflows/workflows.module';
import { SegmentCustomers } from './entities/segment-customers.entity';
import { Segment } from './entities/segment.entity';
import { SegmentsController } from './segments.controller';
import { SegmentsService } from './segments.service';
import { BullModule } from '@nestjs/bullmq';
import { SegmentUpdateProcessor } from './processors/segment.processor';
import { CustomerChangeProcessor } from '../customers/processors/customers.processor';
import { JourneysModule } from '../journeys/journeys.module';
import { AccountsModule } from '../accounts/accounts.module';
import { SegmentCustomersService } from './segment-customers.service';
import { Account } from '../accounts/entities/accounts.entity';

function getProvidersList() {
  let providerList: Array<any> = [
    SegmentsService,
    AudiencesHelper,
    SegmentCustomersService,
  ];

  if (process.env.LAUDSPEAKER_PROCESS_TYPE == 'QUEUE') {
    providerList = [
      ...providerList,
      SegmentUpdateProcessor,
      CustomerChangeProcessor,
    ];
  }

  return providerList;
}

function getExportList() {
  let exportList: Array<any> = [SegmentsService];

  if (process.env.LAUDSPEAKER_PROCESS_TYPE == 'QUEUE') {
    exportList = [
      ...exportList,
      SegmentUpdateProcessor,
      CustomerChangeProcessor,
    ];
  }

  return exportList;
}

@Module({
  imports: [
    BullModule.registerQueue({
      name: '{segment_update}',
    }),
    BullModule.registerQueue({
      name: '{events_pre}',
    }),
    BullModule.registerQueue({
      name: '{customer_change}',
    }),
    BullModule.registerQueue({
      name: '{imports}',
    }),
    TypeOrmModule.forFeature([Segment, SegmentCustomers, Account]),
    forwardRef(() => CustomersModule),
    forwardRef(() => WorkflowsModule),
    forwardRef(() => JourneysModule),
    forwardRef(() => AccountsModule),
  ],
  controllers: [SegmentsController],
  providers: getProvidersList(),
  exports: getExportList(),
})
export class SegmentsModule {}
