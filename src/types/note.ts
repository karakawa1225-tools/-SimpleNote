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
  /** 本文の罫線表示 */
  ruledLines?: boolean
  /** タイトル下に日時を表示するか（未設定時は表示） */
  showDateTime?: boolean
  /** タイトル下に表示する日時（ISO）。未設定時は updatedAt / createdAt */
  displayAt?: string | null
}

export interface FolderMeta {
  id: FolderId
  name: string
  color: string
}
