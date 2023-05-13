import React, { useState } from 'react';

export const MarkdownEditor = ({
    content,
    setContent,
}) => {

  const handleTextChange = (event) => {
    setContent(event.target.value);
  };

  return (
    <div>
        <textarea
            value={content}
            onChange={handleTextChange}
            rows={4}
            cols={50}
            style={{
                width: '100%',
                minHeight: '70vh'
            }}
            className='ecfw-p-4'
        />
    </div>
  );
};

