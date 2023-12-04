import { Accordion, AccordionDetails, AccordionSummary, Chip, Tooltip, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function AfishaMovieCard({ movie }) {
  function getTime(time: string): string {
    return time.toString().slice(0, 2) + ":" + time.toString().slice(2, 4);
  }

  function isSessionExpired(time: string): boolean {
    if (time[0] === "0" && time[1] === "0") return false;
    return new Date().toTimeString().split(" ")[0] > time;
  }

  return (
    <div className="p-2 bg-[var(--black-2)] rounded h-fit">
      <img className="aspect-[2/3] w-full object-cover rounded" src={movie.movie_poster} alt={movie.movie_poster} />
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
                <Tooltip arrow placement="top" title="Недоступно">
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
  );
}
