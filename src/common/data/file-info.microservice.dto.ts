import { FileInfoMicroserviceDto } from '../../file-server/data/dto/file-ms.dto';

export interface FileInfoMicroserviceDataWrapper {
  success: boolean;
  code: number;
  result?: FileInfoMicroserviceDto[] | boolean;
}
