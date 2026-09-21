import { Select, MenuItem } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setThemeName } from "../store/themeSlice";

const ThemeSwitcher = () => {
    const themeName = useSelector((state: any) => state.theme.themeName);
    const dispatch = useDispatch();

    return (
        <Select
            value={themeName}
            onChange={(e) => dispatch(setThemeName(e.target.value))}
            size="small"
            sx={{
                bgcolor: "background.paper",
                borderRadius: 1,
                color: "primary.main",
                fontWeight: "bold",
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.dark",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                },
                "& .MuiSvgIcon-root": {
                    color: "primary.main",
                },
            }}
        >
            <MenuItem
                value="spicy"
                sx={{
                    color: themeName === "spicy" ? "primary.main" : "text.primary",
                    fontWeight: themeName === "spicy" ? "bold" : "normal",
                }}
            >
                Spicy
            </MenuItem>
            <MenuItem
                value="modern"
                sx={{
                    color: themeName === "modern" ? "primary.main" : "text.primary",
                    fontWeight: themeName === "modern" ? "bold" : "normal",
                }}
            >
                Modern
            </MenuItem>
            <MenuItem
                value="dark"
                sx={{
                    color: themeName === "dark" ? "primary.main" : "text.primary",
                    fontWeight: themeName === "dark" ? "bold" : "normal",
                }}
            >
                Dark
            </MenuItem>
        </Select>
    );
};

export default ThemeSwitcher;
