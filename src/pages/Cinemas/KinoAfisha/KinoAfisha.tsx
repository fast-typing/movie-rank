import { SyntheticEvent, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import AdaptiveContainer from "../../../components/AdaptiveContainer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function KinoAfisha({ cinemas }) {
  const [tabs, setTabs] = useState(0);

  function handleTabs(event: SyntheticEvent, newValue: string) {
    setTabs(+newValue);
  }

  function getTime(time: string): string {
    return time.toString().slice(0, 2) + ":" + time.toString().slice(2, 4);
  }

  function isSessionExpired(time: string): boolean {
    console.log(new Date().toTimeString().split(" ")[0], time);
    if (time[0] === "0" && time[1] === "0") return false;
    return new Date().toTimeString().split(" ")[0] > time;
  }

  return cinemas ? (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <Tabs
        value={tabs}
        className="mb-4"
        onChange={handleTabs}
        sx={{ maxWidth: { xs: "1200px" }, width: "90vw" }}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {cinemas.map((cinema, index) => (
          <Tab label={cinema.name} value={index} />
        ))}
      </Tabs>
      <div>
        {cinemas.map((cinema, index) =>
          tabs === index ? (
            <>
              {cinema.timetable.map((el) => (
                <div>
                  <h2 className="h-fit mb-4">Расписание сеансов в кино сегодня</h2>
                  <AdaptiveContainer
                    content={el.movies.map((movie) => (
                      <div className="p-2 bg-[var(--black-2)] rounded h-fit">
                        <img
                          className="aspect-[2/3] w-full object-cover rounded"
                          src={movie.movie_poster}
                          alt={movie.movie_poster}
                        />
                        <a href={movie.movie_link} target="_blank" rel="noreferrer">
                          <h3 className="my-2 two-rows-text h-[54px] underline">{movie.movie_name}</h3>
                        </a>
                        <Accordion className="w-full">
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Сеансы</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <div className="flex flex-wrap gap-2">
                              {movie.times.map((item) =>
                                item.order_link?.length ? (
                                  isSessionExpired(getTime(item.time)) ? (
                                    <Tooltip arrow placement="top" title="Сеанс просрочен">
                                      <span>
                                        <Chip disabled label={getTime(item.time)} />
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <a href={item.order_link} target="_blank" rel="noreferrer">
                                      <Chip label={getTime(item.time)} />
                                    </a>
                                  )
                                ) : (
                                  <Tooltip arrow placement="top" title="недоступно">
                                    <span>
                                      <Chip disabled label={getTime(item.time)} />
                                    </span>
                                  </Tooltip>
                                )
                              )}
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    ))}
                  />
                </div>
              ))}
            </>
          ) : null
        )}
      </div>
      <p className="opacity-50 mt-8">
        Вся информация взята с api{" "}
        <a href="https://www.kinoafisha.info/" className="underline">
          киноафиши
        </a>
      </p>
    </Box>
  ) : null;
}
