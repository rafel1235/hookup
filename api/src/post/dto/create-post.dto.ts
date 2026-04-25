import { IsOptional, IsString, IsArray } from 'class-validator';

export class CreatePostDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString({ message: 'Il contenuto deve essere una stringa' })
  content?: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsArray({ message: 'I mediaUrls devono essere un array' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString({ each: true, message: 'Ogni mediaUrl deve essere una stringa' })
  mediaUrls?: string[];
}
