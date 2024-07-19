import { PartialType } from '@nestjs/mapped-types';
import { CreateGadgetDto } from './create-gedget.dto';

export class UpdateGedgetDto extends PartialType(CreateGadgetDto) {}
