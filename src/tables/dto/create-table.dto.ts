import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTableDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  type: string;

  @IsNumber()
  @MinLength(10)
  @MaxLength(1_000_000)
  width: number;

  @IsNumber()
  @MinLength(10)
  @MaxLength(1_000_000)
  height: number;

  @IsOptional()
  inStock: boolean;
}
