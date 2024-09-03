import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ markdown }) => {
  return (
    <div style={{ padding: '1rem', fontSize: '1.25rem', textAlign: 'left' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
