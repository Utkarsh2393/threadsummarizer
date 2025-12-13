export interface Source {
  title: string;
  uri: string;
}

export interface SummaryData {
  title: string;
  summary: string;
  sources: Source[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  sources?: Source[];
  title?: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  query: string;
  summaryData: SummaryData;
  timestamp: number;
}

export interface User {
  name: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export type Theme = 'light' | 'dark';
