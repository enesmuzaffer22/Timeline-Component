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

    const handleButtonSelect = (name, duration, startTime, endTime) => {
        setSelectedButton(name);
        setButtonInfo({
            name: name,
            duration: duration + 's',
            start: startTime.toFixed(1) + 's',
            end: endTime.toFixed(1) + 's'
        });
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

    const groups = [
        { name: 'Grup 1', buttons: ['buton-1', 'buton-2'] },
        { name: 'Grup 2', buttons: ['buton-3', 'buton-4'] },
    ];

    return (
        <div className="timeline-main-container">
            {selectedTime !== null && (
                <div className="timeline-info">
                    Seçilen saniye: {selectedTime}s
                </div>
            )}
            <div className="timeline" ref={timelineRef} style={{ width: `${timelineWidth}px` }} onClick={handleClick} onMouseDown={handleMouseDown}>
                {renderTimelineTicks()}
                {marker && (
                    <div className="timeline-marker" style={{ left: marker.x }}></div>
                )}
            </div>
            <div className="timeline-container">
                {groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="timeline-group">
                        <div className="group-label">{group.name}</div>
                        {group.buttons.map((name, index) => (
                            <DraggableButton
                                key={name}
                                name={name}
                                startTime={0}
                                onSelect={handleButtonSelect}
                                setButtonRef={ref => (buttonRefs.current[name] = ref)}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <ButtonInfoTable buttonInfo={buttonInfo} />
        </div>
    );
}

export default Timeline;
