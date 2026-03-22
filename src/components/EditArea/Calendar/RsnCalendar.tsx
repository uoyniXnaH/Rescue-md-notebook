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
            setMarkedDates(node.data?.dates?.filter((v) => !isNaN(Date.parse(v))) || []);
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
              onChange={(date: Value) => {
                  setSelectedDate(date as Date);
                  getNodeContents(selectedNodeId!, dayjs(date as Date).format("YYYY-MM-DD"))
                  .then((contents) => {
                      setCurrentFileContents(contents);
                      setCalendarOpen(false);
                  });
              }}
          /></div>
          <Box overflow="auto" position="absolute" top={0} height="100%" width={120} left={-120} p={1} border="1px solid" borderColor="#a0a096" borderRadius={1} display="flex" flexDirection="column" gap={1} sx={{ backgroundColor: "secondary.main" }}>
              {markedDates.map((date, index) => (
                  <Stack key={index} direction="row" alignItems="center" justifyContent="space-between">
                      <Typography key={index} variant="body2" color="primary.contrastText" onClick={() => {
                          setSelectedDate(new Date(date));
                          getNodeContents(selectedNodeId!, dayjs(date).format("YYYY-MM-DD"))
                          .then((contents) => {
                              setCurrentFileContents(contents);
                              setCalendarOpen(false);
                          });
                      }}>
                          {dayjs(date).format("YY-MM-DD")}
                      </Typography>
                      <IconButton size="small">
                          <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                  </Stack>
              ))}
          </Box>
      </div>
    );
}