import React, { useState, useRef, useEffect } from 'react';

const DraggableButton = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startLeft, setStartLeft] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [resizeDirection, setResizeDirection] = useState('');
  const buttonRef = useRef(null);
  const rowRef = useRef(null);

  const onMouseDown = (e) => {
    if (e.target.classList.contains('resize-grip-left') || e.target.classList.contains('resize-grip-right')) {
      setIsResizing(true);
      setStartX(e.clientX);
      setStartWidth(buttonRef.current.getBoundingClientRect().width);
      setStartLeft(buttonRef.current.offsetLeft);
      setResizeDirection(e.target.classList.contains('resize-grip-left') ? 'left' : 'right');
    } else {
      setIsDragging(true);
      setStartX(e.clientX);
      setStartLeft(buttonRef.current.offsetLeft);
    }
  };

  const onMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - startX;
      let newLeft = startLeft + dx;

      const maxLeft = rowRef.current.clientWidth - buttonRef.current.getBoundingClientRect().width;
      if (newLeft < 0) newLeft = 0;
      if (newLeft > maxLeft) newLeft = maxLeft;

      buttonRef.current.style.left = newLeft + 'px';
    } else if (isResizing) {
      const dx = e.clientX - startX;
      let newWidth;
      let newLeft = startLeft;

      if (resizeDirection === 'right') {
        newWidth = startWidth + dx;
      } else {
        newWidth = startWidth - dx;
        newLeft = startLeft + dx;
      }

      if (newWidth < 50) newWidth = 50; // Minimum genişlik
      if (newWidth > rowRef.current.clientWidth) newWidth = rowRef.current.clientWidth; // Maksimum genişlik
      if (newLeft < 0) newLeft = 0;

      buttonRef.current.style.width = newWidth + 'px';
      buttonRef.current.style.left = newLeft + 'px';
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, isResizing]);

  return (
    <div className="row" ref={rowRef}>
      <button
        ref={buttonRef}
        onMouseDown={onMouseDown}
        className="draggable-button"
      >
        Drag me
        <span className="resize-grip resize-grip-left" />
        <span className="resize-grip resize-grip-right" />
      </button>
    </div>
  );
};

export default DraggableButton;
