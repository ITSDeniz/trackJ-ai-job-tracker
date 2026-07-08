export interface Company {
  id: string;
  userId: string;
  name: string;
  website: string | null;
  industry: string | null;
  size: string | null;
  location: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyRepository {
  findByName(name: string, userId: string): Promise<Company | null>;
  findById(id: string): Promise<Company | null>;
  create(name: string, userId: string): Promise<Company>;
}
