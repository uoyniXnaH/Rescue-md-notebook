import React from "react";
import Calendar from 'react-calendar';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import dayjs from "dayjs";
// import 'react-calendar/dist/Calendar.css';

import styles from "./Calendar.module.css";
import { useSettingStore, useFileTreeStore, useDisplayStore } from "@store/store";
import useTauriCmd from "@tauri/TauriCmd";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
type Props = {
    setCalendarOpen: (open: boolean) => void;
}

export default function RsnCalendar({ setCalendarOpen }: Props) {
    const { getNodeById, getNodeContents } = useTauriCmd();
    const selectedNodeId = useFileTreeStore((state) => state.selectedNodeId);
    const selectedDate = useFileTreeStore((state) => state.selectedDate);
    const settings = useSettingStore((state) => state.settings);
    const setSelectedDate = useFileTreeStore((state) => state.setSelectedDate);
    const setCurrentFileContents = useDisplayStore((state) => state.setCurrentFileContents);
    const [markedDates, setMarkedDates] = React.useState<Date[]>([]);
    const calendarClass = [styles.reactCalendar];
    const locale = {
        en: "en-US",
        sc: "zh-CN",
        ja: "ja-JP"
    };

    const isMarked = (date: Date) =>
        markedDates.some(
            d =>
                new Date(d).getFullYear() === date.getFullYear() &&
                new Date(d).getMonth() === date.getMonth() &&
                new Date(d).getDate() === date.getDate()
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
            setMarkedDates(node.data?.dates || []);
        })
    }, []);

    return (
        <div ref={calendarRef}><Calendar
            locale={locale[settings.language]}
            className={calendarClass.join(" ")}
            prevLabel={<KeyboardArrowLeftIcon />}
            nextLabel={<KeyboardArrowRightIcon />}
            prev2Label={<KeyboardDoubleArrowLeftIcon />}
            next2Label={<KeyboardDoubleArrowRightIcon />}
            tileClassName={({ date }) => addTileClass(date)}
            value={selectedDate}
            onChange={(date: Value) => {
                setSelectedDate(date as Date);
                getNodeContents(selectedNodeId!, dayjs(date as Date).format("YYYY-MM-DD"))
                .then((contents) => {
                    setCurrentFileContents(contents);
                    setCalendarOpen(false);
                });
            }}
        /></div>
    );
}