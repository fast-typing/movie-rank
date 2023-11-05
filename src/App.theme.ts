import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Theme {
    color: string;
  }

  interface ThemeOptions {
    color: string;
  }
}

const mainColor = red[700];
const hoverColor = red[900];

const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "contained" },
          style: {
            backgroundColor: mainColor,
            color: "white",
            "&:hover": {
              backgroundColor: hoverColor,
            },
            "&.Mui-disabled": {
              backgroundColor: mainColor,
              opacity: 0.6,
              color: "white"
            },
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            border: "2px solid " + mainColor,
            backgroundColor: "transparent",
            color: mainColor,
            "&:hover": {
              backgroundColor: mainColor,
              border: "2px solid " + mainColor,
              color: "white",
            },
          },
        },
      ],
    },
    MuiToggleButton: {
      variants: [
        {
          props: {},
          style: {
            backgroundColor: "#313131",
            transition: ".2s",
            color: "white",
            "&:hover": {
              backgroundColor: "#424242",
            },
            "&.Mui-selected": {
              backgroundColor: mainColor,
            },
            "&:hover.Mui-selected": {
              backgroundColor: hoverColor,
            },
            "&.Mui-disabled": {
              opacity: 0.6,
            },
          },
        },
      ],
    },
    MuiInputLabel: {
      variants: [
        {
          props: {},
          style: {
            color: "white",
            "&.Mui-focused": {
              color: "white",
              fontWeight: 500,
            },
          },
        },
      ],
    },
    MuiDrawer: {
      variants: [
        {
          props: {},
          style: {
            "& .MuiDrawer-paper": {
              top: 86,
            },
          },
        },
      ],
    },
    MuiIconButton: {
      variants: [
        {
          props: { color: "primary" },
          style: {
            color: "white",
            transition: ".2s",
            backgroundColor: mainColor,
            "&:hover": {
              backgroundColor: hoverColor,
            },
            "&.Mui-disabled": {
              backgroundColor: mainColor,
              opacity: 0.6,
            },
          },
        },
      ],
    },
    MuiOutlinedInput: {
      variants: [
        {
          props: {},
          style: {
            color: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgb(150, 150, 150)",
            },
            "&.Mui-focused fieldset": {
              borderColor: mainColor + "!important",
            },
            "& svg": {
              color: "white",
            },
          },
        },
      ],
    },
    MuiFormControl: {
      variants: [
        {
          props: {},
          style: {
            "& label": {
              color: "rgb(150, 150, 150)",
            },
          },
        },
      ],
    },
    MuiSvgIcon: {
      variants: [
        {
          props: {},
          style: {
            color: "white",
          },
        },
      ],
    },
    MuiRating: {
      variants: [
        {
          props: {},
          style: {
            "& svg": {
              color: mainColor,
            },
          },
        },
      ],
    },
    MuiDivider: {
      variants: [
        {
          props: {},
          style: {
            backgroundColor: "white",
            margin: "16px 0",
          },
        },
      ],
    },
    MuiAccordionSummary: {
      variants: [
        {
          props: {},
          style: {
            backgroundColor: "#424242",
            color: "white",
          },
        },
      ],
    },
    MuiAccordionDetails: {
      variants: [
        {
          props: {},
          style: {
            backgroundColor: "#424242",
            color: "white",
          },
        },
      ],
    },
    MuiPagination: {
      variants: [
        {
          props: {},
          style: {
            "& button": {
              color: "white",
              // '&.MuiButtonBase-root.Mui-selected.': {
              //   backgroundColor: mainColor
              // }
            },
          },
        },
      ],
    },
  },
  typography: {
    fontFamily: "Montserrat",
    fontSize: 13,
  },
  color: mainColor,
});

export default theme;
