import { IsNotEmpty, IsString } from 'class-validator';
export class FilesMicroServiceDto {
  @IsString()
  @IsNotEmpty()
  owner: string;

  @IsString()
  @IsNotEmpty()
  fileid: string;

  //* Let Redis Use This DTO
  //* Check redis-manager-service.ts
  constructor(partial: Partial<FilesMicroServiceDto>) {
    Object.assign(this, partial);
  }
}
