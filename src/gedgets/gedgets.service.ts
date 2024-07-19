// gadgets.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gadgets } from './entities/gedget.entity';
import { CreateGadgetDto } from './dto/create-gedget.dto';
import { UpdateGedgetDto } from './dto/update-gedget.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class GadgetsService {
  constructor(
    @InjectRepository(Gadgets)
    private readonly gadgetsRepository: Repository<Gadgets>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createGadgetDto: CreateGadgetDto): Promise<Gadgets> {
    const user = await this.usersRepository.findOneBy({ id: createGadgetDto.userId });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const gadget = this.gadgetsRepository.create({ ...createGadgetDto, user });
    return await this.gadgetsRepository.save(gadget);
  }

  async findAll(): Promise<Gadgets[]> {
    return await this.gadgetsRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Gadgets> {
    const gadget = await this.gadgetsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!gadget) {
      throw new NotFoundException('Gadget not found');
    }
    return gadget;
  }

  async update(id: number, updateGadgetDto: UpdateGedgetDto): Promise<Gadgets> {
    const gadget = await this.gadgetsRepository.preload({
      id,
      ...updateGadgetDto,
    });

    if (!gadget) {
      throw new NotFoundException('Gadget not found');
    }

    return await this.gadgetsRepository.save(gadget);
  }

  async remove(id: number): Promise<any> {
    const result = await this.gadgetsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Gadget not found');
    }
    else {
      return ({"message":"Deleted!"})
    }
  }
}
