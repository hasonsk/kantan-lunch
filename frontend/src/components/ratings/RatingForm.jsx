import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
const ThrottleExample = () => {
  const { state } = useLocation();
  const [text, setText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');

  useEffect(() => {
    if (state) console.log(hi);
  }, []);
  // useRef to store the timeout ID and avoid memory leaks
  const timeoutRef = useRef(null);

  // Throttle function that updates debouncedText after a delay
  const handleChange = (e) => {
    const value = e.target.value;

    // Clear the previous timeout to reset the delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to update the state after 500ms
    timeoutRef.current = setTimeout(() => {
      setDebouncedText(value); // Set debounced value after the user stops typing
    }, 500);

    setText(value); // Immediately update text (state is used for immediate feedback)
  };

  useEffect(() => {
    // Clean up the timeout when the component is unmounted
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type something..."
      />
      <p>Immediate input: {text}</p>
      <p>Debounced input: {debouncedText}</p>
    </div>
  );
};

export default ThrottleExample;
