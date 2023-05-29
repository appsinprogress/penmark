import React, {useEffect, useRef} from 'react';
import { MarkdownToggleButton } from './buttons/CustomEditorButtons.jsx';

export const Title = ({ value, setValue, date, setDate, isMarkdown, setIsMarkdown }) => {
  const textareaRef = useRef(null);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleTextareaResize = () => {
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  //properly size the textbox when it loads and when the window resizes
  useEffect(() => {

    handleTextareaResize();
    
    const handleWindowResize = () => {
      handleTextareaResize();  
    };
  
    window.addEventListener('resize', handleWindowResize);
  
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [textareaRef]);

  date = date || new Date().toISOString().split('T')[0];

  return (
    <div
      className='ecfw-px-4 ecfw-pt-4 ecfw-pb-2'
    >
      <div
        className='ecfw-flex ecfw-justify-between ecfw-my-2'
      >
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)}
          className='ecfw-cursor-pointer ecfw-bg-transparent ecfw-outline-none ecfw-text-md ecfw-font-semibold ecfw-text-slate-400 ecfw-py-2'
        />
        <MarkdownToggleButton
          isMarkdown={isMarkdown}
          setIsMarkdown={setIsMarkdown}
        />

      </div>
      <textarea type="text" value={value} onChange={handleChange} placeholder='Title'
        ref={textareaRef}
        rows={1}
        onInput={handleTextareaResize}
        style={{ resize: 'none', overflow: 'hidden' }}
        className='ecfw-outline-none ecfw-text-3xl ecfw-font-bold ecfw-text-foreground ecfw-bg-background ecfw-rounded-sm ecfw-w-full'
      />
    </div>
  );
};

