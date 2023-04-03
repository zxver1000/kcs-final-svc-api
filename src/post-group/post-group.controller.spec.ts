import { Test, TestingModule } from '@nestjs/testing';
import { PostGroupController } from './post-group.controller';

describe('PostGroupController', () => {
  let controller: PostGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostGroupController],
    }).compile();

    controller = module.get<PostGroupController>(PostGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
