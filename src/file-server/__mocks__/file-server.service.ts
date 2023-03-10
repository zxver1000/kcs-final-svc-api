import {
  microServiceCreatedDataStub,
  microServiceGetDataStub,
} from '../test/stubs/microservice-data-wrapper.stub';

//* getFileInfo, uploadFile returns FileInfoMicroserviceDataWrapper
export const FileServerService = jest.fn().mockReturnValue({
  getFileInfo: jest.fn().mockResolvedValue(microServiceGetDataStub()),
  uploadFile: jest.fn().mockResolvedValue(microServiceCreatedDataStub()),
});
