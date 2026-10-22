// OpenAPI-style contract types for the Sadaka mock API.
// Type-only file (no runtime code). JS files reference it through JSDoc, for example:
//   /** @typedef {import('../shared/api-types').Family} Family */
//
// Endpoint summary
//   GET    /families?q&sort&gender&city      -> Family[]
//   GET    /families/:id                     -> Family
//   GET    /families/:id/delivery   (auth)   -> FamilyDelivery
//   POST   /families/:id/needs      (member) -> Family
//   PATCH  /families/:id/needs/:needId (member) -> Family
//   DELETE /families/:id/needs/:needId (member) -> Family
//   POST   /families/:id/help-goods (auth)   -> GoodsHelpResult   (409 HELP_LIMIT on the 6th help)
//   GET    /needs-catalog                    -> NeedCatalogItem[]
//   GET    /cities                           -> City[]
//   GET    /charity-points?type              -> CharityPoint[]
//   POST   /charity-points/:id/donate (auth) -> Donation
//   GET    /team                             -> TeamMember[]
//   GET    /sdgs                             -> SdgGoal[]
//   POST   /auth/register | /auth/login      -> AuthResponse
//   GET    /me (auth)                        -> Me
//   GET    /me/helps (auth)                  -> MyHelps
// Money help for families does not exist: families receive goods only.

export type Lang = 'ru' | 'ky';
export type Localized = Record<Lang, string>;

export type ApiErrorCode =
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'EXISTS'
  | 'HELP_LIMIT';

export interface ApiError {
  message: string;
  code: ApiErrorCode;
}

/* ---------------------------------- Needs --------------------------------- */

export type NeedCategory = 'food' | 'clothes' | 'medicine' | 'school' | 'baby' | 'housing' | 'other';

export interface NeedCatalogItem {
  key: string;
  category: NeedCategory;
  label: string; // resolved for the request language
}

export interface FamilyNeed {
  id: string;
  key: string | null; // catalog key, or null for a custom (free-text) need
  label: string; // resolved label, or the custom text as typed
  category: NeedCategory;
  urgent: boolean;
}

/** POST body: either a catalog key or a custom label. */
export interface NeedInput {
  key?: string;
  label?: string;
  urgent?: boolean;
}

/** PATCH body: same fields as NeedInput, all optional. */
export type NeedPatch = NeedInput;

/* --------------------------------- Families -------------------------------- */

export type ChildGender = 'male' | 'female';
export type FamilySort = 'helpCountAsc' | 'recent' | 'all';

export interface City {
  key: string;
  name: string;
}

export interface Family {
  id: string; // internal: routing only, never rendered in the UI
  label: string; // anonymized, for example "Семья А."
  cityKey: string;
  city: string;
  adults: number;
  boys: number;
  girls: number;
  children: number; // boys + girls (count only, no ages)
  needs: FamilyNeed[];
  verified: boolean;
  monthlyHelpCount: number; // helps in the current calendar month
  needsUpdatedAt: string; // ISO date of the last needs update
}

export interface FamilyListParams {
  q?: string;
  sort?: FamilySort;
  gender?: ChildGender; // families with at least one boy / girl
  city?: string; // city key
}

/** Returned only to logged-in donors; never part of the public Family payload. */
export interface FamilyDelivery {
  familyId: string;
  city: string;
  street: string;
  house: string;
  address: string; // "city, street, house"
}

/* ----------------------------------- Help ---------------------------------- */

export type DeliveryProviderId = 'glovo' | 'yandex';
export type StoreId = 'globus' | 'narodny';
export type HelpFlow = 'delivery' | 'store-then-delivery';

export interface GoodsHelpPayload {
  needIds: string[];
  weightKg: number;
  clothingSize?: string;
  flow: HelpFlow;
  provider: DeliveryProviderId;
  storeId?: StoreId;
}

export interface GoodsHelpItem {
  needId: string;
  label: string;
}

export interface GoodsHelp {
  id: string;
  kind: 'goods';
  familyId: string;
  familyLabel: string;
  city: string;
  items: GoodsHelpItem[];
  weightKg: number;
  clothingSize: string | null;
  flow: HelpFlow;
  provider: DeliveryProviderId;
  storeId: StoreId | null;
  receipt: string;
  createdAt: string;
}

export interface GoodsHelpResult {
  help: GoodsHelp;
  family: Family;
}

/* ------------------------------ Charity points ----------------------------- */

export type CharityType = 'orphanage' | 'mosque' | 'internat';

export interface PaymentRequisites {
  bank: string;
  account: string;
  recipient: string; // resolved organization name
}

export interface CharityPoint {
  id: string;
  type: CharityType;
  cityKey: string;
  city: string;
  name: string;
  street: string;
  house: string;
  address: string; // "city, street, house"
  need: string;
  requisites: PaymentRequisites;
  lat: number;
  lng: number;
}

export interface DonatePayload {
  amount: number;
}

export interface Donation {
  id: string;
  kind: 'donation';
  pointId: string;
  pointName: string;
  amount: number;
  currency: 'KGS';
  receipt: string;
  createdAt: string;
}

/* ------------------------------ Team and goals ----------------------------- */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
}

export type SdgTone = 'pink' | 'blue' | 'mint';

export interface SdgGoal {
  id: string;
  number: 1 | 2 | 10; // goals 16 and 17 are never used
  code: string; // "ЦУР 1" / "ТӨМ 1"
  title: string;
  text: string;
  contribution: string; // one line: how Sadaka contributes
  tone: SdgTone;
}

/* ----------------------------------- Auth ---------------------------------- */

export type UserRole = 'donor' | 'family';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  familyId: string | null; // set for low-income family accounts
}

export interface Me extends AuthUser {
  family: Family | null; // family-membership info
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface MyHelps {
  goods: GoodsHelp[];
  donations: Donation[];
}