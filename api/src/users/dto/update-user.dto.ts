import { PartialType } from '@nestjs/mapped-types';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
/* DTO para atualizacao de usuario */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(Role, { message: 'Role inválida' })
  role?: Role;
}
