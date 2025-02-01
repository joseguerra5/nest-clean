export interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}
// sempre que meu app precisar de algo extrerno para funcionar tenho que criar o contrato para fazer a inversão de dependencia
export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>
}
