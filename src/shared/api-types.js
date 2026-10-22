// OpenAPI-style contract types for the Sadaka mock API.
// These mirror a Swagger schema the real backend would expose.

export const FAMILY_HELP_LIMIT = 5;
export const HELP_TARGET = 5;

/** Age buckets used both in UI filters and the mock matcher. */
export type AgeBucket = '0-3' | '4-7' | '8-14' | '14-18' | '18+';

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  relation: 'father' | 'mother' | 'child' | 'grandparent' | 'guardian';
  registered: boolean;
  clothingSize?: string;
}

export interface FamilyNeed {
  id: string;
  label: string;
  category: 'food' | 'clothes' | 'medicine' | 'school' | 'baby' | 'housing' | 'other';
  urgent?: boolean;
}

export interface Family {
  id: string;
  displayId: string;
  city: string;
  address: string;
  adults: number;
  children: number;
  members: FamilyMember[];
  needs: FamilyNeed[];
  comment: string;
  verified: boolean;
  monthlyHelpCount: number;
  updatedAt: string;
  photo: string;
}

export type PaymentMethod = 'MBANK' | 'Optima' | 'KICB' | 'Bakai';
export type DeliveryMethod = 'Glovo' | 'Yandex';

export interface MoneyHelpPayload {
  familyId: string;
  amount: number;
  method: PaymentMethod;
  donorName?: string;
}

export interface GoodsHelpPayload {
  familyId: string;
  weightKg: number;
  clothingSize: string;
  delivery: DeliveryMethod;
  donorName?: string;
  note?: string;
}

export type CharityType = 'orphanage' | 'mosque' | 'internat';

export interface CharityPoint {
  id: string;
  name: string;
  type: CharityType;
  city: string;
  address: string;
  need: string;
  qrText: string;
  lat: number;
  lng: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
}

export interface SdgGoal {
  id: string;
  code: string;
  title: string;
  text: string;
  tone: 'pink' | 'blue' | 'mint';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ApiError {
  message: string;
  code: string;
}
