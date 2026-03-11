import { useContext, useState, createContext } from "react";
export const ThemeContext = createContext(null)
export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState("light")
    const toggleTheme = () => setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}
export const useTheme = () => useContext(ThemeContext)