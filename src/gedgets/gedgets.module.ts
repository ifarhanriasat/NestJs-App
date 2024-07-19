// gadgets.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gadgets } from './entities/gedget.entity';
import { GadgetsController } from './gedgets.controller';
import { GadgetsService } from './gedgets.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gadgets, User])],
  controllers: [GadgetsController],
  providers: [GadgetsService],
})

export class GadgetsModule {}
