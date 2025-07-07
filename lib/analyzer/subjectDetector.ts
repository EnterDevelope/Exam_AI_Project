import type { File } from '@/types/common';

export interface SubjectDetectionResult {
  subject: string;
  confidence: number;
  alternatives?: string[];
}

export async function detectSubject(file: File): Promise<SubjectDetectionResult> {
  // TODO: Implement subject detection logic
  // 1. Extract text from file
  // 2. Analyze text for subject indicators
  // 3. Return detected subject with confidence score
  throw new Error('Not implemented');
} 