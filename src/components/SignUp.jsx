import { useState, useContext, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Fade,
  Slide,
} from "@mui/material";
import { keyframes } from "@mui/system";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TableGIF from "../assets/Icons/RoundTable.png";
import BSS_LOGO_Dark from "../assets/Logos/BSS_Restaurant_Premium_Dark.png";
import BSS_LOGO_Orange from "../assets/Logos/BSS_Restaurant_Spicy_Fresh.png";
import BSS_LOGO_Green from "../assets/Logos/BSS_Restaurant_Modern_Elegant.png";
import { useDispatch, useSelector } from "react-redux";
import { login, startLoading, stopLoading } from "../store/authSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import ImageCarousel from "./Carousel";
import { alpha } from "@mui/material/styles";
import ValidationIllustration from "../assets/illustrations/ValidationIllustration";
import SecurityIllustration from "../assets/illustrations/SecurityIllustration";
import AnalyticsIllustration from "../assets/illustrations/AnalyticsIllustration";
import DynamicManagementIllustration from "../assets/illustrations/DynamicManagementIllustration";
import DynamicDashboardIllustration from "../assets/illustrations/DynamicDashboardIllustration";

const slowSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const smokeAnimation = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
    filter: blur(2px);
  }
  50% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-120px) scale(3);
    opacity: 0;
    filter: blur(8px);
  }
`;

const SmokeElement = ({ sx }) => (
  <Box
    sx={{
      position: "absolute",
      width: "80px",
      height: "80px",
      background:
        "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)",
      borderRadius: "50%",
      animation: `${smokeAnimation} 3s infinite ease-in-out`,
      pointerEvents: "none",
      zIndex: 10,
      ...sx,
    }}
  />
);

export const DynamicCard = ({ title, subTitle, illustration }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
        color: "text.primary",
        padding: { xs: 4, md: 8 },
        textAlign: "center",
      }}
    >
      {illustration}

      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 2.5,
          color: "text.primary",
          fontSize: { xs: "1.75rem", md: "2.25rem" },
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: "text.secondary",
          maxWidth: 550,
          lineHeight: 1.6,
          fontSize: { xs: "1rem", md: "1.125rem" },
        }}
      >
        {subTitle}
      </Typography>
    </Box>
  );
};

export const RightBanner = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Rotating Table */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${TableGIF})`, // ডামি ফুড ইমেজ লিংক
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          animation: `${slowSpin} 120s infinite linear`,
        }}
      />

      {/* Smoke Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <SmokeElement sx={{ top: "35%", left: "45%", animationDelay: "0s" }} />
        <SmokeElement sx={{ top: "55%", left: "65%", animationDelay: "1s" }} />
        <SmokeElement sx={{ top: "65%", left: "35%", animationDelay: "2s" }} />
        <SmokeElement
          sx={{
            top: "45%",
            left: "55%",
            animationDelay: "1.5s",
            width: "50px",
            height: "50px",
          }}
        />
        <SmokeElement sx={{ top: "75%", left: "60%", animationDelay: "3s" }} />
        <SmokeElement
          sx={{ top: "30%", left: "70%", animationDelay: "2.5s" }}
        />
      </Box>
    </Box>
  );
};

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const themeName = useSelector((state) => state.theme.themeName);

  const isLoading = useSelector((state) => state.auth.isLoading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted");
    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const password = data.get("password");
    dispatch(startLoading());
    dispatch(login({ username, password }));
    setTimeout(() => {
      dispatch(stopLoading());
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <Grid
      container
      component="main"
      sx={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Theme Switcher */}
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
        <ThemeSwitcher />
      </Box>

      <Grid
        size={{ xs: 12, md: 7 }}
        sx={{
          display: { xs: "none", md: "block" },
          position: "relative",
          zIndex: 2,
          overflow: "hidden",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
        }}
      >
        <Slide direction="left" in={true} timeout={{ enter: 1000 }}>
          <Box sx={{ width: "100%", height: "100%" }}>
            <ImageCarousel
              items={[
                <RightBanner key="0" />,

                <DynamicCard
                  title={" Welcome Back to BSS Restaurant Dashboard! "}
                  subTitle={
                    " Effortlessly manage your restaurant's heartbeat — from employees to every table's orders. Let's make service seamless and delicious together! "
                  }
                  illustration={<DynamicDashboardIllustration />}
                  key={0}
                />,
                <DynamicCard
                  title={"Your Restaurant, Prefectly Managed!!"}
                  subTitle={
                    "Enter your credentials to access a world of insights that empower your team and delight your guests."
                  }
                  illustration={<DynamicManagementIllustration />}
                  key={4}
                />,
                <DynamicCard
                  illustration={<ValidationIllustration />}
                  title={"Task Management Validated"}
                  subTitle={
                    "Stay on top of your daily operations with seamless task tracking and real-time validation across all your branches."
                  }
                  key="1"
                />,
                <DynamicCard
                  illustration={<SecurityIllustration />}
                  title={"Granular Access Control"}
                  subTitle={
                    "Empower your staff safely. Manage roles, visibility, and permissions with our robust security dashboard."
                  }
                  key="2"
                />,
                <DynamicCard
                  illustration={<AnalyticsIllustration />}
                  title={"Data-Driven Insights"}
                  subTitle={
                    "Visualize your restaurant's performance. Track sales, monitor trends, and make informed decisions instantly."
                  }
                  key="3"
                />,
              ]}
            />
          </Box>
        </Slide>
      </Grid>

      <Grid
        size={{ xs: 12, md: 5 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.default",
          px: { xs: 4, md: 6 },
          zIndex: 1,
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "90%", sm: "95%", md: 425 },
            textAlign: "center",
          }}
        >
          <Slide direction="right" in={true} timeout={{ enter: 1000 }}>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "80px", // ensures space is reserved so it doesn't jump
                  mb: 1,
                }}
              >
                <img
                  src={
                    themeName === "dark"
                      ? BSS_LOGO_Dark
                      : themeName === "spicy"
                        ? BSS_LOGO_Orange
                        : BSS_LOGO_Green
                  }
                  alt="BSS_LOGO"
                  style={{
                    height: "100px",
                    width: "auto",
                    objectFit: "contain",
                    transform:
                      themeName === "dark" ? "scale(0.95)" : "scale(1)",
                    transition: "all 0.3s ease",
                  }}
                />
              </Box>

              <Typography
                component="h2"
                variant="h5"
                sx={{
                  mb: 4,
                  mt: 4,
                  color:
                    themeName === "dark"
                      ? "primary.main"
                      : themeName === "spicy"
                        ? "primary.main"
                        : "primary.main",
                }}
              >
                WELCOME BACK
              </Typography>

              {/* Form */}
              <Box
                component="form"
                onSubmit={handleFormSubmit}
                noValidate
                sx={{ mt: 1, textAlign: "left" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  defaultValue={"admin@mail.com"}
                  autoComplete="username"
                  autoFocus
                  variant="outlined"
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  defaultValue={"Admin@123"}
                  variant="outlined"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label="Remember me"
                  sx={{
                    mt: 1,
                    mb: 2,
                    color: rememberMe ? "primary.main" : "text.secondary",
                    "& .MuiFormControlLabel-label": {
                      fontWeight: rememberMe ? "bold" : "normal",
                      transition: "color 0.2s ease, font-weight 0.2s ease",
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 1,
                    mb: 3,
                    py: 1.5,
                    fontSize: "1rem",
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress color="theme.primary" size={24} />
                  ) : (
                    "SIGN UP"
                  )}
                </Button>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Link
                    href="#"
                    variant="body2"
                    color="text.secondary"
                    underline="hover"
                  >
                    Forgot Password?
                  </Link>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{" "}
                    <Link
                      component={RouterLink}
                      to="/"
                      color="primary"
                      underline="hover"
                      fontWeight="bold"
                    >
                      LOGIN
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Slide>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignupPage;
