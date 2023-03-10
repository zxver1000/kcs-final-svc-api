import { HttpStatus } from '@nestjs/common';
import { FileInfoMicroserviceDataWrapper } from '../../../common/data/file-info.microservice.dto';
import { FileInfoMicroserviceDto } from '../../../file-server/data/dto/file-ms.dto';

export const mockFileInfoMicroServiceDto: FileInfoMicroserviceDto = {
  owner: 'test-owner',
  id: '6407201654f23c80ad6c3bf1',
};

export const microServiceGetDataStub = (): FileInfoMicroserviceDataWrapper => {
  return {
    success: true,
    code: HttpStatus.OK,
    result: [mockFileInfoMicroServiceDto],
  };
};

export const microServiceCreatedDataStub =
  (): FileInfoMicroserviceDataWrapper => {
    return {
      success: true,
      code: HttpStatus.CREATED,
      result: [mockFileInfoMicroServiceDto],
    };
  };

export const microServiceDeletedDataStub =
  (): FileInfoMicroserviceDataWrapper => {
    return {
      success: true,
      code: HttpStatus.OK,
      result: true,
    };
  };
