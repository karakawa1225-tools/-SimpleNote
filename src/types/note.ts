export type FolderId =
  | 'work'
  | 'private'
  | 'ideas'
  | 'materials'
  | 'other'

export type AttachmentType = 'image' | 'pdf'

export interface Attachment {
  id: string
  type: AttachmentType
  name: string
  /** placeholder color or data URL */
  preview?: string
}

export interface Note {
  id: string
  title: string
  body: string
  memo: string
  folderId: FolderId
  createdAt: string
  updatedAt: string
  favorite: boolean
  trashed: boolean
  attachments: Attachment[]
}

export interface FolderMeta {
  id: FolderId
  name: string
  color: string
}
