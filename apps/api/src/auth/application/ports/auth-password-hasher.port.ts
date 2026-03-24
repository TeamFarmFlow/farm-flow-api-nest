export interface AuthPasswordHasherPort {
  hash(raw: string): Promise<string>;
  compare(raw: string, encrypted: string): Promise<boolean>;
}
