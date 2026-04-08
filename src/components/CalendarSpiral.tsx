const CalendarSpiral = () => {
  const holes = Array.from({ length: 14 });
  return (
    <div className="flex justify-around items-center px-6 py-2 relative">
      {holes.map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-3 h-5 rounded-full border-2 border-calendar-spiral bg-background relative -mb-1 z-10" />
          <div className="w-0.5 h-2 bg-calendar-spiral/40" />
        </div>
      ))}
    </div>
  );
};

export default CalendarSpiral;
