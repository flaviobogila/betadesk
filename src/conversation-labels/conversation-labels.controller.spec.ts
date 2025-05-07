import { Test, TestingModule } from '@nestjs/testing';
import { ConversationLabelsController } from './conversation-labels.controller';
import { ConversationLabelsService } from './conversation-labels.service';

describe('ConversationLabelsController', () => {
  let controller: ConversationLabelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationLabelsController],
      providers: [ConversationLabelsService],
    }).compile();

    controller = module.get<ConversationLabelsController>(ConversationLabelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
