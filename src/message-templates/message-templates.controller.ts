import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpException, UseFilters } from '@nestjs/common';
import { MessageTemplatesService } from './message-templates.service';
import { CreateMessageTemplateDto } from './dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message-template.dto';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SupabaseUser } from 'src/common/interfaces/supabase-user.interface';
import { WhatsappService } from 'src/messages/whatsapp.service';
import { MetaExceptionFilter } from 'src/common/filters/meta-exception.filter';

@Controller('channels/:id/templates')
@ApiBearerAuth('access-token')
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('admin', 'manager')
export class MessageTemplatesController {
  constructor(private readonly messageTemplatesService: MessageTemplatesService, private readonly whatsappService: WhatsappService) { }

  @Post()
  @UseFilters(new MetaExceptionFilter)
  async create(@Param('id') channelId: string, @CurrentUser() user: SupabaseUser, @Body() createMessageTemplateDto: CreateMessageTemplateDto) {
    const { id: createdById } = user;
    
    const waTemplate = await this.whatsappService.createTemplate({ ...createMessageTemplateDto, channelId, createdById })
    const {id: externalId} = waTemplate;
    console.log('Whatsapp template created:', waTemplate);
    
    return await this.messageTemplatesService.create({ ...createMessageTemplateDto, channelId, createdById, externalId, metadata: { ...waTemplate } });
  }

  @Get()
  findAll(@Param('id') channelId: string) {
    return this.messageTemplatesService.findAll(channelId);
  }

  @Get(':templateId')
  findOne(@Param('templateId') id: string) {
    return this.messageTemplatesService.findOne(id);
  }

  @Patch(':templateId')
  update(@Param('templateId') id: string, @Body() updateMessageTemplateDto: UpdateMessageTemplateDto) {

    return this.messageTemplatesService.update(id, updateMessageTemplateDto);
  }

  @Delete(':templateId')
  remove(@Param('templateId') id: string) {
    return this.messageTemplatesService.remove(id);
  }
}
