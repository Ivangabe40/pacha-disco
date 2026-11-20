import { useState, useEffect } from "react";

function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, over: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      over: false,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl font-black text-xl md:text-3xl text-white"
        style={{ background: "rgba(255,0,0,0.12)", border: "1px solid rgba(255,0,0,0.3)", fontVariantNumeric: "tabular-nums" }}>
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
}

export default function CountdownTimer({ targetDate }) {
  const { days, hours, minutes, seconds, over } = useCountdown(targetDate);
  if (over) return <p className="text-xs text-red-500 uppercase tracking-widest font-bold">¡Esta noche!</p>;
  return (
    <div className="flex items-end gap-2 md:gap-3">
      {days > 0 && <Unit value={days} label="días" />}
      <Unit value={hours} label="hrs" />
      <Unit value={minutes} label="min" />
      <Unit value={seconds} label="seg" />
    </div>
  );
}