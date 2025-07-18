import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  Min,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  imageUrls?: string[];

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  videoUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tags?: string[];

  @IsOptional()
  @IsString()
  isPublished?: string;
}
