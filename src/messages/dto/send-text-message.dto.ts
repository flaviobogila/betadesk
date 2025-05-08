import { IsString, IsNotEmpty, IsUUID, IsBoolean } from 'class-validator';
import { SendBaseMessageDto } from './send-base-message.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SendTextMessageDto extends SendBaseMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsBoolean({ message: 'O campo isPrivate deve ser um booleano.' })
  isPrivate?: string;

  @ApiProperty()
  @IsUUID(undefined, { message: 'O campo mentionedUserId deve ser um uuid.' })
  mentionedUserId?: string;
}
