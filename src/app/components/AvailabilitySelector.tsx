'use client'

// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import Link from "next/link";
import { Check, Clock, ChevronRight } from "lucide-react";


interface TimeSlot {
    time: string; // e.g., "09:00 AM"
    isAvailable: boolean;
}

interface AvailabilitySelectorProps {
    serviceId: string;
    serviceName: string;
    durationMinutes: number; // Critical for Crux Logic API call
    price: number;
    slug: string;
};

export function AvailabilitySelector({ serviceId, serviceName, slug }: AvailabilitySelectorProps) {

    // DATE selection
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    // API results
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    // UI management
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // const router = useRouter();
    const to24Hour = (t: string) => {
    // expects like "09:00 AM" or "12:30 PM"
    const [time, meridiem] = t.split(' ');
    
    // Split the array destructuring:
    const timeParts = time.split(':').map(Number);
    let hh = timeParts[0]; // hh needs 'let' because it is reassigned
    const mm = timeParts[1]; // mm can be 'const' because it is never reassigned
    
    if (meridiem === 'PM' && hh !== 12) hh += 12;
    if (meridiem === 'AM' && hh === 12) hh = 0;
    
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
};
      
      // inside your JSX, ensure selectedDate && selectedTime are set
      const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
      const timeParam = selectedTime ? to24Hour(selectedTime) : '';

    useEffect(() => {
        if (!selectedDate) {
            setTimeSlots([]);
            return;
        };
        const fetchAvailability = async () => {
            setIsLoading(true);
            setTimeSlots([]);
            setSelectedTime(null);


            const url = `/api/public/availability?serviceId=${serviceId}&date=${dateString}`

            try {
                const response = await fetch(url);
                const data = await response.json();

                // API returns fullTimeBlock as TimeSlot[]
                if (response.ok && data.fullTimeBlock) {
                    setTimeSlots(data.fullTimeBlock)
                } else {
                    // Handle API error/empty slots gracefully
                    setTimeSlots([]);
                    console.error("API Error:", data.error);
                }
            } catch (error) {
                console.error("Fetch failed:", error);
                setTimeSlots([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAvailability();
    }, [selectedDate, serviceId, dateString])

    return (
        <div className="space-y-8">
            <div className="flex flex-col xl:flex-row gap-12">
                {/* Calendar Section */}
                <div className="flex-shrink-0">
                    <label className="block text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">1. Choose Date</label>
                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm inline-block p-4">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            className="rounded-md"
                        />
                    </div>
                </div>

                {/* Time Slots Section */}
                <div className="flex-1 min-w-[300px]">
                    <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider">2. Choose Time</label>
                        {selectedDate && (
                            <span className="text-sm font-medium text-white bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
                                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        )}
                    </div>
                    
                    <div className="min-h-[300px]">
                        {!selectedDate ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 p-8">
                                <Clock className="w-8 h-8 mb-2 opacity-50" />
                                <p>Please select a date first</p>
                            </div>
                        ) : isLoading ? (
                            <div className="grid grid-cols-3 gap-3 animate-pulse">
                                {[1,2,3,4,5,6].map(i => (
                                    <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                                {!isLoading && timeSlots.length === 0 ? (
                                    <div className="col-span-3 text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                                        No slots available for this date.
                                    </div>
                                ) : (
                                    timeSlots.map((slot) => {
                                        const isSelected = selectedTime === slot.time;
                                        return slot.isAvailable ? (
                                            <button
                                                key={slot.time}
                                                onClick={() => setSelectedTime(slot.time)}
                                                className={`
                                                    relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 border
                                                    ${isSelected 
                                                        ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-900/20 scale-[1.02]' 
                                                        : 'bg-zinc-900 text-slate-300 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white'
                                                    }
                                                `}
                                            >
                                                {slot.time}
                                                {isSelected && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-zinc-900"></div>
                                                )}
                                            </button>
                                        ) : (
                                            <div
                                                key={slot.time}
                                                className="px-4 py-3 text-sm rounded-xl bg-zinc-900/50 text-zinc-600 border border-zinc-800 cursor-not-allowed justify-center flex decoration-zinc-600 relative overflow-hidden"
                                            >
                                                <span className="relative z-10">{slot.time}</span>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-full h-[1px] bg-zinc-700 rotate-12"></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky/Fixed Summary Footer if date & time selected */}
            {selectedDate && selectedTime && (
                <div className="mt-8 pt-8 border-t border-zinc-800 animate-fade-in-up">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center">
                                <Check className="w-6 h-6" />
                             </div>
                             <div>
                                 <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">Excellent Choice</p>
                                 <p className="text-white font-bold text-lg">
                                    {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {selectedTime}
                                 </p>
                             </div>
                         </div>
                         
                         <Link
                            href={`/app/${slug}/checkout?serviceId=${serviceId}&date=${dateString}&time=${timeParam}`}
                            className="w-full sm:w-auto"
                        >
                            <Button className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-xl shadow-rose-900/20 transition-all hover:scale-105">
                                Continue <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}