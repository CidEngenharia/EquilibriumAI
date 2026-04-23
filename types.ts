
export type Category = 'love' | 'goodAt' | 'worldNeeds' | 'paidFor';

export interface IkigaiItem {
  id: string;
  text: string;
  category: Category;
}

export type SType = 'seiri' | 'seiton' | 'seiso' | 'seiketsu' | 'shitsuke';
export type SSubtype = 'positive' | 'negative';

export interface SItem {
  id: string;
  text: string;
  type: SType;
  subtype: SSubtype;
}

export interface KaizenLog {
  id: string;
  improvement: string;
  date: string;
  completed: boolean;
}

export interface KintsugiEntry {
  id: string;
  failure: string;
  lesson: string;
  date: string;
}

export interface GamanGoal {
  id: string;
  goal: string;
  startDate: string;
  daysPersisted: number;
}
