import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class MarketSearchService {
  private ebayToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private configService: ConfigService) {}

  private async getEbayToken(): Promise<string> {
    const now = Date.now();

    if (this.ebayToken && this.tokenExpiry > now + 300000) {
      return this.ebayToken;
    }

    const appId = this.configService.get<string>('EBAY_APP_ID');
    const certId = this.configService.get<string>('EBAY_CERT_ID');

    const credentials = Buffer.from(`${appId}:${certId}`).toString('base64');

    try {
      const response = await axios.post(
        'https://api.ebay.com/identity/v1/oauth2/token',
        'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      const token = response.data.access_token;

      this.ebayToken = token;
      this.tokenExpiry = now + response.data.expires_in * 1000;

      return token;
    } catch (error) {
      throw new HttpException(
        'Falha ao autenticar com a API do mercado.',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  }

  async searchMiniature(query: string) {
    const token = await this.getEbayToken();

    try {
      const response = await axios.get(
        'https://api.ebay.com/buy/browse/v1/item_summary/search',
        {
          params: {
            q: query,
            limit: 10,
            category_ids: '222',
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const items = response.data.itemSummaries || [];
      return items.map((item: any) => ({
        title: item.title,
        price: item.price.value,
        currency: item.price.currency,
        imageUrl: item.image?.imageUrl || null,
        url: item.itemWebUrl,
      }));
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar dados do mercado.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
