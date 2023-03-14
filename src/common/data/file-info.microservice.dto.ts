import { FileInfoReadOnly } from '../../file-server/data/file.schema';

export interface FileInfoMicroserviceDataWrapper {
  success: boolean;
  code: number;
  result?: FileInfoReadOnly[] | boolean;
}
