export interface BoundingBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface EvidenceReference {
  readonly page: number;
  readonly section: string;
  readonly fragment: string;
  readonly boundingBox?: BoundingBox;
}
