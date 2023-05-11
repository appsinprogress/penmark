import React from 'react';

export const Title = ({ value, setValue, date, setDate }) => {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  date = date || new Date().toISOString().split('T')[0];

  return (
    <div
      className='ecfw-px-4 ecfw-pt-4 ecfw-pb-2'
    >
      <div>
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)}
          className='ecfw-bg-transparent ecfw-outline-none ecfw-text-md ecfw-font-semibold ecfw-text-slate-400 ecfw-py-2'
        />
      </div>
      <input type="text" value={value} onChange={handleChange} placeholder='Title'
        className='ecfw-outline-none ecfw-text-4xl ecfw-font-bold ecfw-text-foreground ecfw-bg-background ecfw-rounded-sm ecfw-w-full'
      />
    </div>
  );
};

