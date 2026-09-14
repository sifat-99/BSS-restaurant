import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import { NavLink } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@emotion/react";
import { Avatar, ListItemAvatar } from "@mui/material";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import { useSelector, useDispatch } from "react-redux";
import { alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

import BSS_ICON_Orange from "../assets/Icons/Spicy-orange.png";
import BSS_ICON_Dark from "../assets/Icons/dark-gray.png";
import BSS_ICON_Green from "../assets/Icons/green-modern.png";

const drawerWidth = 240;
const miniDrawerWidth = 65;

function DashboardMainPage(props) {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const theme = useTheme();
  const themeName = useSelector((state) => state.theme.themeName);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    navigate("/");
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    navigate("/dashboard/profile");
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const showFullSidebar = isHovered || mobileOpen;

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
      }}
    >
      <List>
        <ListItem
          onClick={() => navigate("/dashboard")}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingLeft: 1,
            cursor: "pointer",
          }}
        >
          <ListItemAvatar
            sx={{
              marginRight: 2,
            }}
          >
            <Avatar
              sx={{
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                objectFit: "cover",
                border: "none",
              }}
            >
              {themeName === "dark" ? (
                <img
                  src={BSS_ICON_Dark}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  alt="BSS ICON"
                />
              ) : themeName === "modern" ? (
                <img
                  src={BSS_ICON_Green}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  alt="BSS ICON"
                />
              ) : (
                <img
                  src={BSS_ICON_Orange}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  alt="BSS ICON"
                />
              )}
            </Avatar>
          </ListItemAvatar>
          {showFullSidebar && (
            <Typography
              variant="h6"
              onClick={() => navigate("/dashboard")}
              sx={{
                opacity: showFullSidebar ? 1 : 0,
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              BSS Restaurant
            </Typography>
          )}
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            component={NavLink}
            to="/dashboard/profile"
            sx={{
              minHeight: 48,
              justifyContent: showFullSidebar ? "initial" : "center",
              px: 2.5,
            }}
            style={({ isActive }) => ({
              backgroundColor: isActive ? "rgba(0, 0, 0, 0.08)" : "transparent",
              color: isActive ? theme.palette.primary.main : "inherit",
              borderLeft: isActive
                ? `3px solid ${theme.palette.primary.main}`
                : "3px solid transparent",
            })}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: showFullSidebar ? 3 : "auto",
                justifyContent: "center",
                color: "inherit",
              }}
            >
              <PersonIcon />
            </ListItemIcon>
            <ListItemText
              primary="Profile"
              sx={{ opacity: showFullSidebar ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            component={NavLink}
            to="/dashboard/employee"
            sx={{
              minHeight: 48,
              justifyContent: showFullSidebar ? "initial" : "center",
              px: 2.5,
            }}
            style={({ isActive }) => ({
              backgroundColor: isActive ? "rgba(0, 0, 0, 0.08)" : "transparent",
              color: isActive ? theme.palette.primary.main : "inherit",
              borderLeft: isActive
                ? `3px solid ${theme.palette.primary.main}`
                : "3px solid transparent",
            })}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: showFullSidebar ? 3 : "auto",
                justifyContent: "center",
                color: "inherit",
              }}
            >
              <BadgeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Employee"
              sx={{ opacity: showFullSidebar ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>
        {/* {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: showFullSidebar ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: showFullSidebar ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: showFullSidebar ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))} */}
      </List>
      <Divider />
      {/* <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: showFullSidebar ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: showFullSidebar ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={{ opacity: showFullSidebar ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: {
            sm: `calc(100% - ${isHovered ? drawerWidth : miniDrawerWidth}px)`,
          },
          ml: { sm: `${isHovered ? drawerWidth : miniDrawerWidth}px` },
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          paddingTop: 1,
          paddingBottom: 1,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(255, 255, 255, 0.4)",
          color: theme.palette.text.primary,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: `0 4px 30px ${alpha(theme.palette.common.black, 0.1)}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {isHovered ? (
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
          ) : (
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
              onClick={() => navigate("/dashboard")}
              cursor="pointer"
            >
              BSS Restaurant
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
            <ThemeSwitcher />

            {user && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open profile options">
                  <Button
                    onClick={handleOpenUserMenu}
                    sx={{
                      p: 0.5,
                      textTransform: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      borderRadius: 2,
                    }}
                  >
                    <Avatar
                      alt={user.fullName}
                      src={user.image}
                      sx={{ width: 36, height: 36 }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "text.primary",
                        display: { xs: "none", sm: "block" },
                        fontWeight: "bold",
                      }}
                    >
                      {user.fullName}
                    </Typography>
                  </Button>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleProfile}>
                    <Typography align="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography align="center" color="error">
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: isHovered ? drawerWidth : miniDrawerWidth },
          flexShrink: { sm: 0 },
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: isHovered ? drawerWidth : miniDrawerWidth,
              overflowX: "hidden",
              transition: (theme) =>
                theme.transitions.create("width", {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2, md: 3 },
          minWidth: 0,
          width: {
            xs: "100%",
            sm: `calc(100% - ${isHovered ? drawerWidth : miniDrawerWidth}px)`,
          },
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }}
      >
        <Toolbar />

        {children}
      </Box>
    </Box>
  );
}

export default DashboardMainPage;
