import { PartialType } from '@nestjs/swagger';
import { CreateConversationLabelDto } from './create-conversation-label.dto';

export class UpdateConversationLabelDto extends PartialType(CreateConversationLabelDto) {}
