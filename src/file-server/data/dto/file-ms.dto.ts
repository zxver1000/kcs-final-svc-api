import { IsNotEmpty, IsString } from 'class-validator';
export class FileInfoMicroserviceDto {
  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  //* Let Redis Use This DTO
  //* Check redis-manager-service.ts
  constructor(partial: Partial<FileInfoMicroserviceDto>) {
    Object.assign(this, partial);
  }
}
