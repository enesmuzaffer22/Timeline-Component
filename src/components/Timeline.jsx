import React from 'react';
import DraggableButton from './DraggableButton';

function Timeline() {
    const timelineWidth = 5000; // Zaman çizelgesinin genişliği (px cinsinden)
    const interval = 80; // Her bir zaman işareti arası uzaklık (px cinsinden)
    const numIntervals = timelineWidth / interval; // Toplam zaman işareti sayısı

    const renderTimelineTicks = () => {
        const ticks = [];
        for (let i = 0; i < numIntervals; i++) {
            ticks.push(
                <div key={i} className="timeline-tick" style={{ left: i * interval }}>
                    {i + 1}s
                </div>
            );
        }
        return ticks;
    };

    return (
        <div className="timeline-container">
            <div className="timeline" style={{ width: `${timelineWidth}px` }}>
                {renderTimelineTicks()}
            </div>
            <DraggableButton />
            <DraggableButton />
            <DraggableButton />
            <DraggableButton />
        </div>
    );
}

export default Timeline;
