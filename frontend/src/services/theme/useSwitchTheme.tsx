import "ts-array-ext/reduceAsync";

import { createContext, FC, ReactElement, useCallback, useContext, useState } from "react";
import { theme1, theme2 } from "theme/theme";

export enum Themes {
  Normal,
  Martins
}

const useThemeContextValue = () => {
  const [theme, setTheme] = useState(theme1);

  const changeTheme = useCallback((newTheme: Themes) => {
    if (newTheme === Themes.Martins) {
      setTheme(theme1);
    } else if (newTheme === Themes.Normal) {
      setTheme(theme2);
    }
  }, []);

  return { theme, changeTheme };
};

const ThemesContext =
  createContext<Pick<ReturnType<typeof useThemeContextValue>, "changeTheme">>(null);

interface Props {
  children(_data: typeof theme1): ReactElement;
}

export const ThemeContextProvider: FC<Props> = ({ children }) => {
  const { changeTheme, theme } = useThemeContextValue();

  return <ThemesContext.Provider value={{ changeTheme }}>{children(theme)}</ThemesContext.Provider>;
};

export const useSwitchTheme = () => useContext(ThemesContext);
