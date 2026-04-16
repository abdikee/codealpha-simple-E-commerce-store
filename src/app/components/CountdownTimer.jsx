import React, { useState, useEffect } from 'react';

export function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerItems = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4">
      {timerItems.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center text-primary font-bold text-2xl mb-1">
            {item.value.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
