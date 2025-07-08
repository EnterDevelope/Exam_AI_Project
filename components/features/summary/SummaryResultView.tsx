import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  summary: string;
}

export default function SummaryResultView({ summary }: Props) {
  return (
    <article className="prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
    </article>
  );
}
