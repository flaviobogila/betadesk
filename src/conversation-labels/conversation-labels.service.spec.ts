import { Test, TestingModule } from '@nestjs/testing';
import { ConversationLabelsService } from './conversation-labels.service';

describe('ConversationLabelsService', () => {
  let service: ConversationLabelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationLabelsService],
    }).compile();

    service = module.get<ConversationLabelsService>(ConversationLabelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
