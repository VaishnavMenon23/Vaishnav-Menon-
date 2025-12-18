export interface UserDoc {
  id: string;
  email: string;
  name?: string;
  roles?: string[];
  preferences?: any;
  createdAt?: string;
}
