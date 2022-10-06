import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsFQDN,
  IsOptional,
  IsBoolean,
  isArray,
  IsArray,
} from 'class-validator';

export class UpdateAccountDto {
  @Trim()
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public lastName: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  public password: string;

  @IsString()
  @IsOptional()
  public mailgunAPIKey: string;

  @IsFQDN()
  @IsOptional()
  public sendingDomain: string;

  @IsString()
  @IsOptional()
  public sendingName: string;

  @IsBoolean()
  @IsOptional()
  public onboarded: boolean;

  @IsArray()
  @IsOptional()
  public expectedOnboarding: string[];

  @IsString()
  @IsOptional()
  public finishedOnboarding: string;

  @IsString()
  @IsOptional()
  public sendingEmail: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @IsOptional()
  public slackTeamId: [string];
}