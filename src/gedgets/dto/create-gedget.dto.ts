// src/gadgets/dto/create-gadget.dto.ts
import { IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateGadgetDto {

    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()
    @IsOptional()
    description: string;
    
    @IsNotEmpty()
    @Min(1)
    userId: number;

}
