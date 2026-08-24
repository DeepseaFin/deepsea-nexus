export type KnowledgePrimitive = string | number | boolean;

export type KnowledgeValue =
  | KnowledgePrimitive
  | readonly KnowledgePrimitive[]
  | Record<string, KnowledgePrimitive | readonly KnowledgePrimitive[]>;
