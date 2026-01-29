import { IsArray, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsArray()
  experience?: string[];
}
