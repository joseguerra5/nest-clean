import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt";
import { Env } from "@/infra/env/env";
import { z } from "zod";

const tokenPayloadSchema = z.object({
  sub: z.string().uuid()
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

// a classe por ser um provider precisa ter o injectable
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get("JWT_PUBLIC_KEY", { infer: true })

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algoritms: ["RS256"],
      secretOrKey: Buffer.from(publicKey, "base64")
    })
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}