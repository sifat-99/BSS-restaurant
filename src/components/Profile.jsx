import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { GetProfileAPI } from "../api/GET";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Divider,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import { alpha, useTheme } from "@mui/material/styles";

const ProfileInfoItem = ({ icon, label, value }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Box
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          borderRadius: "50%",
          p: 1,
          display: "flex",
          mr: 2,
        }}
      >
        {React.cloneElement(icon, { color: "primary" })}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="500">
          {value || "N/A"}
        </Typography>
      </Box>
    </Box>
  );
};

const Profile = () => {
  const token = useSelector((state) => state.auth.token);
  const reduxUser = useSelector((state) => state.auth.user);
  const theme = useTheme();

  const [user, setUser] = useState(reduxUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await GetProfileAPI(token);
        if (response && response.data) {
          setUser(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          No User Profile Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please log in again to load your profile details.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="700" gutterBottom sx={{ mb: 4 }}>
        My Profile
      </Typography>

      <Card
        elevation={4}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(
            theme.palette.primary.light,
            0.05,
          )} 100%)`,
        }}
      >
        <Box
          sx={{
            height: 120,
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          }}
        />
        <CardContent sx={{ pt: 0, px: { xs: 3, md: 5 }, pb: { xs: 3, md: 5 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-end" },
              mt: -6,
              mb: 4,
            }}
          >
            <Avatar
              src={user.image}
              alt={user.fullName}
              sx={{
                width: 120,
                height: 120,
                border: `4px solid ${theme.palette.background.paper}`,
                boxShadow: theme.shadows[3],
                bgcolor: "primary.light",
                fontSize: "3rem",
                mb: { xs: 2, sm: 0 },
                mr: { sm: 3 },
              }}
            >
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Box sx={{ textAlign: { xs: "center", sm: "left" }, pb: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {user.fullName}
              </Typography>
              <Typography
                variant="subtitle1"
                color="primary.main"
                fontWeight="500"
              >
                @{user.userName}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
            Contact Information
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ProfileInfoItem
                icon={<EmailIcon />}
                label="Email Address"
                value={user.email}
              />
              <ProfileInfoItem
                icon={<PhoneIcon />}
                label="Phone Number"
                value={user.phoneNumber}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ProfileInfoItem
                icon={<PersonIcon />}
                label="Username"
                value={user.userName}
              />
              <ProfileInfoItem
                icon={<BadgeIcon />}
                label="User ID"
                value={user.id}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
