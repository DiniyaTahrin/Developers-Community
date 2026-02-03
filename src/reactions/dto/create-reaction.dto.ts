import { IsEnum } from 'class-validator';

export enum ReactionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

export class CreateReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;
}
