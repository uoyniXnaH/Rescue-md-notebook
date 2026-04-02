import React from "react";
import Calendar from 'react-calendar';
import { Stack, Box, Typography, IconButton } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
    const [markedDates, setMarkedDates] = React.useState<string[]>([]);
    const [listHoveredId, setListHoveredId] = React.useState<number>(-1);
    const calendarClass = [styles.reactCalendar];
    const locale = {
        en: "en-US",
        sc: "zh-CN",
        ja: "ja-JP"
    };

    const isSameDay = (date1: Date, date2: Date | null) => {
        if (!date2) return false;
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    const addTileClass = (date: Date) => {
        let className = [styles.reactCalendarTile];
        if (isSameDay(date, selectedDate)) {
            className.push(styles.reactCalendarTileActive);
        } else if (markedDates.some((d) => isSameDay(date, new Date(d)))) {
            className.push(styles.markedDate);
        }
        if (isSameDay(date, new Date())) {
            className.push(styles.today);
        }
        return className;
    }

    const handleChangeDate = (date: Date) => {
        setSelectedDate(date);
        getNodeContents(selectedNodeId!, dayjs(date).format("YYYY-MM-DD"))
        .then((contents) => {
            setCurrentFileContents(contents);
            setCalendarOpen(false);
        });
    }

    const calendarRef = React.useRef<HTMLDivElement | null>(null);
    React.useEffect(() => {
        const nav = calendarRef.current?.querySelector('.react-calendar__navigation');
        if (nav) {
            nav.classList.add(styles.reactCalendarNavigation);
        }
        getNodeById(selectedNodeId!)
        .then((node) => {
            setMarkedDates(node.data?.dates?.filter((v) => !isNaN(Date.parse(v))).sort() || []);
        })
    }, []);

    return (
      <div style={{ position: "relative" }}>
          <div ref={calendarRef}><Calendar
              locale={locale[settings.language]}
              className={calendarClass.join(" ")}
              prevLabel={<KeyboardArrowLeftIcon />}
              nextLabel={<KeyboardArrowRightIcon />}
              prev2Label={<KeyboardDoubleArrowLeftIcon />}
              next2Label={<KeyboardDoubleArrowRightIcon />}
              tileClassName={({ date }) => addTileClass(date)}
              value={selectedDate}
              onChange={(date: Value) => {handleChangeDate(date as Date)}}
          /></div>
          <Box
            overflow="auto"
            position="absolute"
            top={0}
            height="100%"
            width={120}
            left={-120}
            border="1px solid"
            borderColor="#a0a096"
            display="flex"
            flexDirection="column"
            bgcolor="secondary.main"
          >
              {markedDates.map((date, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    onMouseEnter={() => setListHoveredId(index)}
                    onMouseLeave={() => setListHoveredId(-1)}
                    sx={{
                        backgroundColor: isSameDay(new Date(date), selectedDate) ? "primary.contrastText" : listHoveredId == index ? "action.hover" : "transparent"
                    }}
                  >
                      <Typography
                        key={index}
                        variant="body2"
                        color={isSameDay(new Date(date), selectedDate) ? "primary.main" : "primary.contrastText"}
                        px={1}
                        py={0.5}
                        flexGrow={1}
                        onClick={() => {handleChangeDate(new Date(date))}}
                        sx={{
                            userSelect: "none"
                        }}
                      >
                          {dayjs(date).format("YY-MM-DD")}
                      </Typography>
                      <IconButton size="small" color={isSameDay(new Date(date), selectedDate) ? "primary" : "info"}>
                          <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                  </Stack>
              ))}
          </Box>
      </div>
    );
}