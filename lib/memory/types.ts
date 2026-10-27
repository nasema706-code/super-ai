export type Profile = {
  wallet: string;
  summary: string;
  summonCount: number;
  imagesToday: number;
  imagesDay: string;
  createdAt: string;
  lastSeenAt: string;
};

export type StoredMessage = {
  id: string;
  wallet: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type SummonRecord = {
  id: string;
  wallet: string;
  prompt: string;
  mediaType: string;
  storagePath: string;
  isPublic: boolean;
  createdAt: string;
};

export type MemoryStore = {
  touchProfile(wallet: string): Promise<Profile>;
  listMessages(wallet: string, limit: number): Promise<StoredMessage[]>;
  appendMessage(message: StoredMessage): Promise<void>;
  appendMemory(wallet: string, note: string): Promise<string>;
  incrementSummon(wallet: string): Promise<Profile>;
  consumeImageCredit(wallet: string, day: string): Promise<Profile>;
  addSummon(record: SummonRecord): Promise<void>;
  listPublicSummons(limit: number): Promise<SummonRecord[]>;
  getSummon(id: string): Promise<SummonRecord | null>;
};
