import { HttpStatus } from '@nestjs/common';
import { FileInfoReadOnly } from 'src/file-server/data/file.schema';
import { FileInfoMicroserviceDataWrapper } from '../../../common/data/file-info.microservice.dto';

export const mockFileInfoMicroServiceDto: FileInfoReadOnly = {
  owner: 'test-owner',
  id: '6407201654f23c80ad6c3bf1',
  filePath: 'test-filePath',
  fileName: 'test-fileName',
  size: 12345,
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
