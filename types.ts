
export enum Category {
  NATIONAL_RANKING = '전국대회(랭킹) 입상',
  NATIONAL_NON_RANKING = '전국대회(비랭킹) 입상',
  LOCAL_MASTER = '지역대회-마스터부',
  LOCAL_CHALLENGER = '지역대회-챌린저부',
  LOCAL_FUTURES = '지역대회-퓨처스부',
  NATIONAL_KOOKHWA = '전국대회(랭킹)-국화부',
  NATIONAL_GAENARI = '전국대회(개나리부/비랭킹 포함)'
}

export type Rule = {
  category: Category;
  subCategory?: string;
  rank: string;
  count: string;
  birthYear: string;
  recency: string;
  score: number;
};

export interface CalculatorState {
  category: Category | '';
  subCategory: string;
  rank: string;
  count: string;
  birthYear: string;
  recency: string;
}
