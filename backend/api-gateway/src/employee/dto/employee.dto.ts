import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class EmployeeQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  departmentId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  isActive?: number;
}

export class CreateEmployeeDto {
  @ApiProperty({ example: "EMP-2026-006" })
  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @ApiProperty({ example: "Rina Kartika" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "rina.kartika@dexa.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: "08123456789" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  departmentId: number;

  @ApiProperty({ example: "QA Engineer" })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({ example: "2026-11-07" })
  @IsString()
  @IsNotEmpty()
  joinDate: string;

  @ApiPropertyOptional({ example: "password123" })
  @IsOptional()
  @IsString()
  password?: string;
}

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ example: "Rina Kartika" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: "rina.kartika@dexa.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: "08123456789" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  departmentId?: number;

  @ApiPropertyOptional({ example: "Senior QA Engineer" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  position?: string;

  @ApiPropertyOptional({ example: "2026-11-07" })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  joinDate?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  isActive?: number;
}
