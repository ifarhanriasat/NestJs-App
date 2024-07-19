// gadgets.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, UsePipes, UseGuards, ValidationPipe } from '@nestjs/common';
import { GadgetsService } from './gedgets.service';
import { CreateGadgetDto } from './dto/create-gedget.dto';
import { UpdateGedgetDto } from './dto/update-gedget.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gadgets')
@UseGuards(JwtAuthGuard)

export class GadgetsController {
  constructor(private readonly gadgetsService: GadgetsService) {}

  @Post('/create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createGadgetDto: CreateGadgetDto) {
    return await this.gadgetsService.create(createGadgetDto);
  }

  @Get('/getAll')
  async findAll() {
    return await this.gadgetsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.gadgetsService.findOne(+id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Param('id') id: string, @Body() updateGadgetDto: UpdateGedgetDto) {
    return await this.gadgetsService.update(+id, updateGadgetDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.gadgetsService.remove(+id);
  }
}
