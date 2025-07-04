import { IsString, IsNotEmpty, IsEmail, IsUrl, IsOptional, Min } from 'class-validator';

export class CreateCelebrityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  category: string;

  @IsString()
  country: string;

  @IsEmail()
  email: string; // ✅ Add this

  @IsString()
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsString()
  instagram?: string;

  @IsOptional()
  @IsString()
  youtube?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  setlist?: string;

  @Min(1000)
  fanbase: number;
}
