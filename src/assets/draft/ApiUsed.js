<TableContainer sx={{ maxHeight: 600 }}>
    <Table
        stickyHeader
        sx={{ minWidth: 800 }}
        aria-label="a dense table Employee List"
    >
        <TableHead
            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}
        >
            <TableRow>
                <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem", py: 2 }}
                >
                    Staff Member
                </TableCell>
                <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem", py: 2 }}
                >
                    NID
                </TableCell>
                <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem", py: 2 }}
                >
                    Role
                </TableCell>
                <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem", py: 2 }}
                >
                    Contact Info
                </TableCell>
                <TableCell
                    sx={{ fontWeight: "bold", fontSize: "1rem", py: 2 }}
                >
                    Joined On
                </TableCell>
                <TableCell
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        py: 2,
                        textAlign: "right",
                    }}
                >
                    Actions
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {employees.length > 0 ? (
                employees.map((emp: any) => (
                    <TableRow
                        key={emp.id}
                        hover
                        sx={{
                            "&:nth-of-type(odd)": {
                                backgroundColor:
                                    theme.palette.mode === "dark"
                                        ? alpha(theme.palette.primary.main, 0.05)
                                        : alpha(theme.palette.primary.main, 0.06),
                            },
                            "&:last-child td, &:last-child th": { border: 0 },
                            transition: "background-color 0.2s ease",
                            "&:hover": {
                                bgcolor:
                                    theme.palette.mode === "dark"
                                        ? alpha(theme.palette.primary.main, 0.15)
                                        : alpha(theme.palette.primary.main, 0.12),
                            },
                            // py: -2,
                        }}
                    >
                        <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar
                                    src={
                                        emp.user?.image
                                            ? `${BACKEND_API}/images/user/${emp.user.image}`
                                            : ""
                                    }
                                    alt={`${emp.user?.firstName || ""} ${emp.user?.lastName || ""}`}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        mr: 2,
                                        bgcolor: alpha(
                                            theme.palette.secondary.main,
                                            0.2,
                                        ),
                                        color: "secondary.main",
                                        fontWeight: "bold",
                                        border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    }}
                                >
                                    {emp.user?.firstName
                                        ? emp.user.firstName[0].toUpperCase()
                                        : "S"}
                                </Avatar>
                                <Box>
                                    <Typography
                                        sx={{
                                            variant: "subtitle1",
                                            fontWeight: "bold",
                                            textWrap: "nowrap"
                                        }}
                                    >
                                        {`${emp.user?.firstName || ""} ${emp.user?.lastName || ""}`.trim() ||
                                            emp.user?.fullName ||
                                            "Unknown"}
                                    </Typography>
                                </Box>
                            </Box>
                        </TableCell>
                        <TableCell>
                            <Typography
                                variant="body2"
                                color="text.secondary" sx={{ fontWeight: "500", textWrap: "nowrap" }}
                            >
                                {emp.user?.nid ? `${emp.user.nid}` : ""}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Chip
                                label={emp.designation || "N/A"}
                                color="secondary"
                                variant="outlined"
                                sx={{
                                    fontWeight: "bold",
                                    borderRadius: 1.5,
                                    borderWidth: 2,
                                }}
                            />
                        </TableCell>
                        <TableCell>
                            <Typography
                                sx={{
                                    variant: "body2",
                                    fontWeight: "500",
                                    textWrap: "nowrap"
                                }}
                            >
                                {emp.user?.email || "N/A"}
                            </Typography>
                            {/* <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{
                                                                fontWeight: "500"
                                                            }}
                                                        >
                                                            {emp.user?.phoneNumber || "N/A"}
                                                        </Typography> */}
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: "500", textWrap: "nowrap" }}>
                                {formatDate(emp.joinDate)}
                            </Typography>
                        </TableCell>
                        <TableCell
                            sx={{ textAlign: "right", whiteSpace: "nowrap" }}
                        >
                            <Tooltip title="View Details">
                                <IconButton
                                    color="info"
                                    onClick={() => handleViewClick(emp)}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Staff">
                                <IconButton
                                    color="primary"
                                    sx={{ mx: 0.5 }}
                                    onClick={() => handleEditClick(emp)}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove Staff">
                                <IconButton
                                    color="error"
                                    onClick={() => handleDeleteClick(emp)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Avatar
                            sx={{
                                m: "auto",
                                mb: 2,
                                bgcolor: "transparent",
                                color: "text.secondary",
                                width: 64,
                                height: 64,
                            }}
                        >
                            <RestaurantMenuIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography
                            sx={{
                                color: "text.secondary",
                                variant: "h6",
                                fontWeight: "bold"
                            }}
                        >
                            Your staff roster is empty
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                            Click "Add Staff" to start building your restaurant
                            team.
                        </Typography>
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>
</TableContainer>
