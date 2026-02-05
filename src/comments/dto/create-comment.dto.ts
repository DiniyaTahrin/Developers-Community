import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  // @IsMongoId()
  // postID: string;
  @IsOptional()
  @IsMongoId()
  parentCommentId?: string;
}
