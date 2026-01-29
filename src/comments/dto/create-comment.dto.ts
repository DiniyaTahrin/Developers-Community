import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsMongoId()
  postID: string;
}
