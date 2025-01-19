import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FillInBlanksController } from './fill-in-blanks.controller';
import { FillInBlanksService } from './fill-in-blanks.service';
import { FillInBlanks } from './schemas/fill-in-blanks.schema';
import { FillInBlanksSchema } from './schemas/fill-in-blanks.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FillInBlanks.name, schema: FillInBlanksSchema }]),
  ],
  controllers: [FillInBlanksController],
  providers: [FillInBlanksService],
})
export class FillInBlanksModule {} 