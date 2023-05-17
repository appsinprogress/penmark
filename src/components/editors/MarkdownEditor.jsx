import React, { useState } from 'react';

export const MarkdownEditor = ({
  content,
  setContent,
}) => {

  const handleTextChange = (event) => {
    setContent(event.target.value);
  };

  const amountOfLines = content.split('\n').length;
  const amountOfLinesDoubled = amountOfLines * 2;
  const amountOfRows = amountOfLinesDoubled > 50 ? amountOfLinesDoubled : 50;

  return (
    <div>
      <textarea
        value={content}
        onChange={handleTextChange}
        rows={amountOfRows}
        cols={50}
        style={{
          width: '100%',
          minHeight: '100lvh'
        }}
        className='ecfw-p-4'
      />
    </div>
  );
};

