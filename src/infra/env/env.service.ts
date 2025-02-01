import { ConfigService } from '@nestjs/config'
import { Env } from './env'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  // helper que pega todas as chaves do Env e infere a chave como true
  get<T extends keyof Env>(key: T) {
    return this.configService.get<T>(key, { infer: true })
  }
}
