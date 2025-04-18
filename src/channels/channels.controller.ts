import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { Request } from 'express';
import { ChannelsService } from './channels.service';

@Controller('channels')
@UseGuards(SupabaseAuthGuard)
export class ChannelsController {
  constructor(private readonly channelService: ChannelsService) {}

  @Post()
  async create(@Body() dto: CreateChannelDto, @Req() req: any) {
    const tenantId = req.user?.user_metadata?.tenant_id;

    if (!tenantId) {
      throw new NotFoundException('Tenant não encontrado no token.');
    }

    return this.channelService.createChannel(dto, tenantId);
  }

  @Get()
  async findAll(@Req() req: any) {
    const tenantId = req.user?.user_metadata?.tenant_id;
    return this.channelService.getAllChannels(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const tenantId = req.user?.user_metadata?.tenant_id;
    return this.channelService.getByIdAndValidateTenant(id, tenantId);
  }
}
