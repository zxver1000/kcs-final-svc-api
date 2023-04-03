import { Test, TestingModule } from '@nestjs/testing';
import { PostGroupService } from './post-group.service';

describe('PostGroupService', () => {
  let service: PostGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostGroupService],
    }).compile();

    service = module.get<PostGroupService>(PostGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
