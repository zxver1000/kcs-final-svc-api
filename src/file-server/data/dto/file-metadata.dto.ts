import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FileMetadataDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'File name',
    example: 'user-3',
    required: true,
  })
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'File Size',
    example: '86338',
    required: true,
  })
  size: string;
}
