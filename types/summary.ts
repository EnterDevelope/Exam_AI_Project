export interface SummaryData {
  id: string;
  content: string;
  outline: OutlineItem[];
  highlights: Highlight[];
  createdAt: string;
  subject: string;
  style: 'simple' | 'detailed';
}

export interface OutlineItem {
  id: string;
  title: string;
  level: number;
  content: string;
}

export interface Highlight {
  id: string;
  text: string;
  importance: 'high' | 'medium' | 'low';
  context: string;
} 