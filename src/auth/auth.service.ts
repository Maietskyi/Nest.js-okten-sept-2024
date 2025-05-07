import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Token } from './entities/tocken.entity';
import { ConfigService } from '@nestjs/config';
import { IToken } from './inretfaces/tokens.interface';

@Injectable()
export class AuthService {
  private accessTokenExpiresIn: number;
  private refreshTokenExpiresIn: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenExpiresIn =
      this.configService.get<number>('ACCESS_TOKEN_EXPIRATION_TIME') || 0;
    this.refreshTokenExpiresIn =
      this.configService.get<number>('REFRESH_TOKEN_EXPIRATION_TIME') || 0;
  }

  async register(register: RegisterDto): Promise<User> {
    const user = this.userRepository.create(register);
    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<IToken> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    const jti = Math.random().toString(36).substring(10);
    const payload = { userId: user.id, username: user.username, jti };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: `${this.accessTokenExpiresIn}s`,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${this.refreshTokenExpiresIn}s`,
    });

    await this.saveTokens(
      user,
      accessToken,
      refreshToken,
      this.accessTokenExpiresIn,
      this.refreshTokenExpiresIn,
      jti,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveTokens(
    user: User,
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
    refreshTokenExpiresIn: number,
    jti: string,
  ): Promise<void> {
    const tokenEntity = this.tokenRepository.create({
      accessToken,
      refreshToken,
      accessTokenExpiresAt: new Date(
        Date.now() + this.accessTokenExpiresIn * 1000,
      ),
      refreshTokenExpiresAt: new Date(
        Date.now() + this.refreshTokenExpiresIn * 1000,
      ),
      user,
      jti,
    });
    await this.tokenRepository.save(tokenEntity);
  }

  private async validateUser(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
