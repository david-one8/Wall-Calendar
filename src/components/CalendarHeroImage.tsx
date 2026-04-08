import { useState, useEffect, useRef } from "react";
import january from "@/assets/calendar-january.jpg";
import february from "@/assets/calendar-february.jpg";
import march from "@/assets/calendar-march.jpg";
import april from "@/assets/calendar-april.jpg";
import may from "@/assets/calendar-may.jpg";
import june from "@/assets/calendar-june.jpg";
import july from "@/assets/calendar-july.jpg";
import august from "@/assets/calendar-august.jpg";
import september from "@/assets/calendar-september.jpg";
import october from "@/assets/calendar-october.jpg";
import november from "@/assets/calendar-november.jpg";
import december from "@/assets/calendar-december.jpg";

const MONTH_IMAGES: Record<number, string> = {
  0: january, 1: february, 2: march, 3: april,
  4: may, 5: june, 6: july, 7: august,
  8: september, 9: october, 10: november, 11: december,
};

const MONTH_ALT: Record<number, string> = {
  0: "Snowy winter birch trees by a frozen lake",
  1: "Cherry blossoms blooming in gentle snow",
  2: "Daffodils and crocuses in early spring",
  3: "Colorful tulip fields with a Dutch windmill",
  4: "Wildflower countryside with butterflies",
  5: "Tropical beach with turquoise waves",
  6: "Lavender fields in Provence at sunset",
  7: "Sunflower field under blue summer sky",
  8: "Autumn vineyard in Tuscan hills",
  9: "New England forest in fall foliage",
  10: "Misty autumn cottage on amber hills",
  11: "Cozy winter village under starry sky",
};

interface CalendarHeroImageProps {
  month: number;
}

const CalendarHeroImage = ({ month }: CalendarHeroImageProps) => {
  const [displayMonth, setDisplayMonth] = useState(month);
  const [prevMonth, setPrevMonth] = useState(month);
  const [transitioning, setTransitioning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (month !== displayMonth) {
      setPrevMonth(displayMonth);
      setTransitioning(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setDisplayMonth(month);
        setTimeout(() => setTransitioning(false), 50);
      }, 300);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [displayMonth, month]);

  return (
    <div className="relative overflow-hidden h-48 sm:h-56 lg:h-64">
      {/* Previous image (fades out) */}
      <img
        src={MONTH_IMAGES[prevMonth]}
        alt={MONTH_ALT[prevMonth]}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          transitioning ? "opacity-100" : "opacity-0"
        }`}
        width={1280}
        height={720}
      />
      {/* Current image (fades in) */}
      <img
        src={MONTH_IMAGES[displayMonth]}
        alt={MONTH_ALT[displayMonth]}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
        width={1280}
        height={720}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-calendar-paper/30 to-transparent pointer-events-none" />
    </div>
  );
};

export default CalendarHeroImage;
