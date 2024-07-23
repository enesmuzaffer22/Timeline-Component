import React, { useState, useRef, useEffect } from 'react';
import DraggableButton from './DraggableButton';
import ButtonInfoTable from './ButtonInfoTable';

function Timeline() {
    const timelineWidth = 20000; // Zaman çizelgesinin genişliği (px cinsinden)
    const interval = 80; // Her bir zaman işareti arası uzaklık (px cinsinden)
    const numIntervals = timelineWidth / interval; // Toplam zaman işareti sayısı

    const [marker, setMarker] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);
    const [buttonInfo, setButtonInfo] = useState(null);
    const [draggingMarker, setDraggingMarker] = useState(false);
    const timelineRef = useRef(null);
    const buttonRefs = useRef({});

    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const second = (x / interval).toFixed(1); // Ondalık formatında saniye

        setMarker({ x, second });
        setSelectedTime(second);
    };

    const handleButtonSelect = (name, duration) => {
        console.log("buton select function");
        setSelectedButton(name);
        console.log(name);
        const button = buttonRefs.current[name];
        if (button) {
            const buttonRect = button.getBoundingClientRect();
            const rect = timelineRef.current.getBoundingClientRect();
            const buttonStartX = buttonRect.left - rect.left;
            const buttonWidth = buttonRect.width;
            const buttonStartTime = parseFloat(button.dataset.startTime);
            const relativeTime = (buttonWidth / interval).toFixed(1);

            setButtonInfo({
                name: name,
                time: (parseFloat(selectedTime) - buttonStartTime).toFixed(1) + 's',
                startTime: buttonStartTime,
                endTime: (buttonStartTime + parseFloat(relativeTime)).toFixed(1),
                duration: relativeTime
            });
        }
    };

    const handleMouseDown = (e) => {
        if (e.target.classList.contains('timeline-marker')) {
            setDraggingMarker(true);
        }
    };

    const handleMouseMove = (e) => {
        if (draggingMarker && timelineRef.current) {
            const rect = timelineRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const second = (x / interval).toFixed(1); // Ondalık formatında saniye
            setMarker({ x, second });
            setSelectedTime(second);
        }
    };

    const handleMouseUp = () => {
        setDraggingMarker(false);
    };

    useEffect(() => {
        if (draggingMarker) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingMarker]);

    const renderTimelineTicks = () => {
        const ticks = [];
        for (let i = 0; i < numIntervals; i++) {
            ticks.push(
                <div key={i} className="timeline-tick" style={{ left: i * interval }}>
                    {(i * interval / interval).toFixed(1)}s
                </div>
            );
        }
        return ticks;
    };

    return (
        <div className="timeline-main-container">
            {selectedTime !== null && (
                <div className="timeline-info">
                    Seçilen saniye: {selectedTime}s
                </div>
            )}
            <div className="timeline-container">
                <div
                    className="timeline"
                    ref={timelineRef}
                    style={{ width: `${timelineWidth}px` }}
                    onClick={handleClick}
                    onMouseDown={handleMouseDown}
                >
                    {renderTimelineTicks()}
                    {marker && (
                        <div
                            className="timeline-marker"
                            style={{ left: marker.x }}
                        ></div>
                    )}
                </div>
                {['buton-1', 'buton-2', 'buton-3', 'buton-4'].map((name, index) => (
                    <DraggableButton
                        key={name}
                        name={name}
                        startTime={0}
                        onSelect={handleButtonSelect}
                        setButtonRef={ref => (buttonRefs.current[name] = ref)}
                    />
                ))}
            </div>
            <ButtonInfoTable buttonInfo={buttonInfo} />
        </div>
    );
}

export default Timeline;
