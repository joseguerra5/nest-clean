import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachment-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachmentRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attach: Attachment): Promise<void> {
    this.items.push(attach)
  }
}
