export interface Note {
  id: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
  // Optional so notes stored before this field existed stay valid: a missing
  // value reads as unpinned.
  pinned?: boolean
}
