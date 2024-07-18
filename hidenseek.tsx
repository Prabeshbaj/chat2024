import React, { useState, useRef, useEffect } from 'react';

const ClickOutsideComponent = () => {
  const [isVisible, setIsVisible] = useState(true);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {isVisible && (
        <div ref={ref} className="box">
          <h1>This is the component</h1>
          <p>Click outside of this box to hide it.</p>
        </div>
      )}
      {!isVisible && <button onClick={() => setIsVisible(true)}>Show Component</button>}
    </div>
  );
};

export default ClickOutsideComponent;
