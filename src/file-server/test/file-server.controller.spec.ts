import { mockMulterFileStub } from './stubs/multer-file.stub';
import {
  microServiceGetDataStub,
  microServiceCreatedDataStub,
  mockFileInfoMicroServiceDto,
} from './stubs/microservice-data-wrapper.stub';
import { FileServerService } from '../file-server.service';
import { FileServerService as MockFileServerService } from '../__mocks__/file-server.service';
import { FileServerController } from '../file-server.controller';
import { Test } from '@nestjs/testing';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FileInfoMicroserviceDataWrapper } from '../../common/data/file-info.microservice.dto';
import { User } from '../../user/data/user.schema';

//* Find Actual Service, It will Auto Mock from __mocks__
jest.mock('../file-server.service');

//* Testing Service Works Or Not
//* Because Controller is calling Service Not the Other Logics
describe('FileServerController', () => {
  //* Create Testing Module and Every Need Things
  let controller: FileServerController;
  let service: FileServerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'MS-User',
            transport: Transport.TCP,
            options: {
              host: process.env.FileServerHost,
              port: Number(process.env.FileServerPort),
            },
          },
        ]),
      ],
      controllers: [FileServerController],
      //* Providers Need to Use Above Things
      //* Need to create 'Mock' of the providers
      //* Which allows you to test (spy) the functions
      //* Basically, Dependencies!
      //* AutoMocking -> Creating __mock__ directory under the root of domain
      //* For example, __mock__/file-server.service.ts
      providers: [
        {
          provide: FileServerService,
          useClass: MockFileServerService,
        },
      ],
    }).compile();

    controller = moduleRef.get<FileServerController>(FileServerController);
    service = moduleRef.get<FileServerService>(FileServerService);
    //* useful to modify mock, return value, ...
    //* clear each cache
    jest.clearAllMocks();
  });

  //* Test Each Function
  describe('getFileInfo', () => {
    //* Make Sure that the Right Function is Called
    describe('when getFileInfo is called', () => {
      let data: FileInfoMicroserviceDataWrapper;
      const fileid = '6407201654f23c80ad6c3bf1';

      //* Call the function through the controller
      beforeEach(async () => {
        data = await controller.getFileInfo(fileid);
      });

      //* Controller may call the function through the service
      test('then it should call fileServerService.getFileInfo', () => {
        //* With the Given Parameter
        expect(service.getFileInfo).toBeCalledWith(
          mockFileInfoMicroServiceDto.id,
        );
      });

      //* And the result should be microServiceGetDataStub()
      //* Which is Mock Data
      test('then it should return a MicroserviceDataWrapper', () => {
        expect(data).toEqual(microServiceGetDataStub());
      });
    });
  });

  describe('uploadFile', () => {
    describe('when uploadFile is called', () => {
      let data: FileInfoMicroserviceDataWrapper;
      const user = {
        email: 'test@test.com',
        id: 'test-id',
      } as User;

      //    @Payload('userid') userid: string,
      //    @Payload('files') files: Express.Multer.File[],
      beforeEach(async () => {
        data = await controller.uploadFile([mockMulterFileStub()], user);
      });

      test('then it should call fileServerService.uploadFile', () => {
        expect(service.uploadFile).toBeCalledWith([mockMulterFileStub()], user);
      });

      test('then it should return a MicroserviceDataWrapper', () => {
        expect(data).toEqual(microServiceCreatedDataStub());
      });
    });
  });
});
