import React, { useState, useRef, useEffect } from 'react';

const DraggableButton = ({ name, startTime, onSelect, setButtonRef }) => {
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
        e.preventDefault(); // İmleç değişimini engellemek için
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

            // Buton boyutu değiştiğinde bilgi güncelle
            if (onSelect) onSelect(name, (newWidth / 80).toFixed(1)); // 80px = 1s
        }
    };

    const onMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    const handleClick = (e) => {
        e.stopPropagation(); // Diğer olayları engellemek için
        if (onSelect) {
            console.log("tıklandı");
            setButtonRef(buttonRef.current);
            const width = buttonRef.current.getBoundingClientRect().width;
            const duration = (width / 80).toFixed(1); // 80px = 1s
            onSelect(name, duration);
        }
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

    useEffect(() => {
        if (buttonRef.current) {
            const width = buttonRef.current.getBoundingClientRect().width;
            const newDuration = (width / 80).toFixed(1); // 80px = 1s
            if (onSelect) onSelect(name, newDuration);
        }
    }, [buttonRef.current]);

    return (
        <div className="row" ref={rowRef}>
            <button
                ref={buttonRef}
                onMouseDown={onMouseDown}
                onClick={handleClick}
                className="draggable-button"
                data-start-time={startTime}
            > {name}
                <span className="resize-grip resize-grip-left" />
                <span className="resize-grip resize-grip-right" />
            </button>
        </div>
    );
};

export default DraggableButton;
