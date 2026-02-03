import React from "react";
import Calendar from 'react-calendar';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
// import 'react-calendar/dist/Calendar.css';

import styles from "./Calendar.module.css";
import { useFileTreeStore } from "@store/store";
import useTauriCmd from "@tauri/TauriCmd";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function RsnCalendar() {
    const { getNodeById } = useTauriCmd();
    const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
    const selectedDate = useFileTreeStore((state) => state.selectedDate);
    const setSelectedDate = useFileTreeStore((state) => state.setSelectedDate);
    const [markedDates, setMarkedDates] = React.useState<Date[]>([]);
    const calendarClass = [styles.reactCalendar];

    const isMarked = (date: Date) =>
        markedDates.some(
            d =>
                d.getFullYear() === date.getFullYear() &&
                d.getMonth() === date.getMonth() &&
                d.getDate() === date.getDate()
        );
    
    const addTileClass = (date: Date) => {
        let className = [styles.reactCalendarTile];
        if (date.getTime() === selectedDate?.getTime()) {
            className.push(styles.reactCalendarTileActive);
        } else if (isMarked(date)) {
            className.push(styles.markedDate);
        }
        return className;
    }

    const calendarRef = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
        const nav = calendarRef.current?.querySelector('.react-calendar__navigation');
        if (nav) {
            nav.classList.add(styles.reactCalendarNavigation);
        }
        getNodeById(selectedNodeId!)
        .then((node) => {
            setMarkedDates(node.data?.date || []);
        })
    }, []);

    return (
        <div ref={calendarRef}><Calendar
            className={calendarClass.join(" ")}
            prevLabel={<KeyboardArrowLeftIcon />}
            nextLabel={<KeyboardArrowRightIcon />}
            prev2Label={<KeyboardDoubleArrowLeftIcon />}
            next2Label={<KeyboardDoubleArrowRightIcon />}
            tileClassName={({ date }) => addTileClass(date)}
            value={selectedDate}
            onChange={(date: Value) => {
                setSelectedDate(date as Date);
            }}
        /></div>
    );
}