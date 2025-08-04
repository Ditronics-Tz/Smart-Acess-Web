import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary.main,
      dark: colors.primary.hover,
      light: colors.primary.light,
    },
    secondary: {
      main: colors.secondary.main,
      dark: colors.secondary.dark,
      light: colors.secondary.light,
    },
    background: {
      default: colors.neutral.white,
      paper: colors.neutral.white,
    },
    text: {
      primary: colors.neutral.text,
      secondary: colors.secondary.main,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: colors.secondary.main,
    },
    h2: {
      fontWeight: 700,
      color: colors.secondary.main,
    },
    h3: {
      fontWeight: 600,
      color: colors.secondary.main,
    },
    h4: {
      fontWeight: 600,
      color: colors.secondary.main,
    },
    h5: {
      fontWeight: 600,
      color: colors.secondary.main,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          backgroundColor: colors.primary.main,
          '&:hover': {
            backgroundColor: colors.primary.hover,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.secondary.main,
        },
      },
    },
  },
});