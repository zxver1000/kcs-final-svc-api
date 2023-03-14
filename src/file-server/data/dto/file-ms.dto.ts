import { PickType } from '@nestjs/swagger';
import { FileInfo } from '../file.schema';

export class FileInfoMicroserviceDto extends PickType(FileInfo, [
  'id',
  'owner',
  'filePath',
] as const) {
  //* Let Redis Use This DTO
  //* Check redis-manager-service.ts
  constructor(partial: Partial<FileInfoMicroserviceDto>) {
    super();
    Object.assign(this, partial);
  }
}
