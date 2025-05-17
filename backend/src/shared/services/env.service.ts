import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  public readonly jwtSecret: string;
  public readonly accessTokenExpirationTime: number;
  public readonly refreshTokenExpirationTime: number;

  public readonly dbType: string;
  public readonly dbHost: string;
  public readonly dbPort: number;
  public readonly dbUsername: string;
  public readonly dbPassword: string;
  public readonly dbDatabase: string;

  constructor(private configService: ConfigService) {
    this.jwtSecret = configService.get<string>(
      'JWT_SECRET',
      '5d484e935e141d68f141077c218a501a72bec6321fa4eadc3951c6f94d3e0b7f589465f1db5cf773',
    );
    this.accessTokenExpirationTime = configService.get<number>(
      'ACCESS_TOKEN_EXPIRATION_TIME',
      600,
    );
    this.refreshTokenExpirationTime = configService.get<number>(
      'REFRESH_TOKEN_EXPIRATION_TIME',
      1200,
    );

    this.dbType = configService.get<string>('DB_TYPE', 'mysql');
    this.dbHost = configService.get<string>('DB_HOST', 'localhost');
    this.dbPort = configService.get<number>('DB_PORT', 3307);
    this.dbUsername = configService.get<string>('DB_USERNAME', 'users');
    this.dbPassword = configService.get<string>('DB_PASSWORD', 'users');
    this.dbDatabase = configService.get<string>(
      'DB_DATABASE',
      'my-nestjs-test',
    );
  }
}
