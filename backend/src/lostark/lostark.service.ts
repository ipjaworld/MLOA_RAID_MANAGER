import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LostarkService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('LOST_ARK_API_KEY');
    this.apiUrl =
      this.configService.get<string>('LOST_ARK_API_URL') ||
      'https://developer-lostark.game.onstove.com';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }

  async getCharacter(characterName: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.apiUrl}/armories/characters/${encodeURIComponent(characterName)}`,
          {
            headers: this.getHeaders(),
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message ||
          '로스트아크 API 요청 중 오류가 발생했습니다.',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCharacterProfile(characterName: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.apiUrl}/armories/characters/${encodeURIComponent(characterName)}/profiles`,
          {
            headers: this.getHeaders(),
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message ||
          '로스트아크 API 요청 중 오류가 발생했습니다.',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCharacterEquipment(characterName: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `${this.apiUrl}/armories/characters/${encodeURIComponent(characterName)}/equipment`,
          {
            headers: this.getHeaders(),
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message ||
          '로스트아크 API 요청 중 오류가 발생했습니다.',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCharacterBasicInfo(characterName: string) {
    try {
      const profile = await this.getCharacterProfile(characterName);
      return {
        name: characterName,
        server: profile.ServerName,
        job: profile.CharacterClassName,
        level: profile.CharacterLevel,
        itemLevel: parseFloat(profile.ItemAvgLevel.replace(',', '')),
      };
    } catch (error) {
      throw new HttpException(
        '캐릭터 정보를 가져오는데 실패했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
