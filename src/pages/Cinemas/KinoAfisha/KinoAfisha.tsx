import { SyntheticEvent, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import AdaptiveContainer from "../../../components/AdaptiveContainer";
import AfishaMovieCard from "./AfishaMovieCard";

export default function KinoAfisha({ cinemas }) {
  const [tabs, setTabs] = useState(0);

  function handleTabs(event: SyntheticEvent, newValue: string) {
    setTabs(+newValue);
  }

  return cinemas ? (
    <Box sx={{ width: "100%", typography: "body1" }}>
      {cinemas.length ? (
        <>
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
              <Tab key={index} label={cinema.name} value={index} />
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
                          <AfishaMovieCard movie={movie} />
                        ))}
                      />
                    </div>
                  ))}
                </>
              ) : null
            )}
          </div>
        </>
      ) : (
        "Выберите город"
      )}
      <p className="opacity-50 mt-8">
        Вся информация была предоставленна{" "}
        <a href="https://www.kinoafisha.info/" className="underline">
          киноафишой
        </a>
      </p>
    </Box>
  ) : null;
}
