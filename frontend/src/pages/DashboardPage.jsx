import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Fab,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Popover,
  Snackbar,
  Alert,
  InputAdornment,
  TextareaAutosize,
} from "@mui/material";
import {
  Folder,
  Info,
  Edit,
  Delete,
  CheckCircle,
  Add,
  Close,
} from "@mui/icons-material";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
import {
  getExpenseBucketList,
  SaveNewExpenseBucket,
  DeleteExpenseBucket,
  UpdateExpenseBucket,
} from "../api/expenseAPI";
import { getUserId } from "../utils/StoreUserDetails";
import Header from "../components/Header";
import "../styles/dashboardStyle.css";
import useRowSelection from "../utils/useRowSelection";
import CustomDialog from "../utils/CustomDialog";

const DashboardPage = ({ folders }) => {
  const [expenseBuckets, setExpenseBuckets] = useState([]);
  const navigate = useNavigate();
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [anchorElPopover, setAnchorElPopover] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [bucketName, setBucketName] = useState("");
  const [bucketNameRemainingChars, setBucketNameRemainingChars] = useState(50);
  const [description, setDescription] = useState("");
  const [descriptionRemainingChars, setDescriptionRemainingChars] =
    useState(100);
  const [tag, setTag] = useState("");
  const [tagRemainingChars, setTagRemainingChars] = useState(10);
  const [quickNote, setQuickNote] = useState("");
  const [quickNoteRemainingChars, setQuickNoteRemainingChars] = useState(500);
  const [dialogType, setDialogType] = useState("");
  const [openNotification, setOpenNotification] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [expBucketId, setExpBucketId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [originalBucketName, setOriginalBucketName] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [originalTag, setOriginalTag] = useState("");

  const { selectedItems, handleRowClick, handleRowDoubleClick } =
    useRowSelection();

  const fetchExpenseBuckets = useCallback(async () => {
    setLoading(true); // Set loading to true while fetching
    setError(""); // Clear previous errors
    setInfoMessage("");
    try {
      const userID = await getUserId();
      const ExpenseBucketList = await getExpenseBucketList(userID);

      if (ExpenseBucketList.length > 0) {
        setExpenseBuckets(ExpenseBucketList);
      } else {
        setInfoMessage(
          "No expense buckets available. Please Add New Expense Bucket!"
        );
      }
    } catch (error) {
      console.error("Error fetching expense buckets:", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, []);

  useEffect(() => {
    fetchExpenseBuckets();
  }, [fetchExpenseBuckets]);

  const handleFabClick = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElMenu(null);
  };

  const handlePopoverClick = (event, description) => {
    if (description) {
      setAnchorElPopover(event.currentTarget);
      setSelectedDescription(description);
    }
  };

  const handlePopoverClose = () => {
    setAnchorElPopover(null);
    setSelectedDescription("");
  };

  const isMenuOpen = Boolean(anchorElMenu);
  const isPopoverOpen = Boolean(anchorElPopover);

  const handleOpenDialog = (type, bucketId = null) => {
    setDialogType(type);
    setOpenDialog(true);
    setExpBucketId(bucketId); // Add this line to handle delete dialog
    if (type === "update") {
      const bucket = expenseBuckets.find((bucket) => bucket.id === bucketId);
      setBucketName(bucket.bucketName);
      setDescription(bucket.description);
      setTag(bucket.tag);

      // Store original values
      setOriginalBucketName(bucket.bucketName);
      setOriginalDescription(bucket.description);
      setOriginalTag(bucket.tag);
    }
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setBucketName("");
    setDescription("");
    setTag("");
    setQuickNote("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const userID = await getUserId();
    try {
      // Save logic here
      if (dialogType === "bucket") {
        console.log("Bucket Name:", bucketName);
        console.log("Description:", description);
        console.log("Tag:", tag);

        const response = await SaveNewExpenseBucket(
          bucketName,
          description,
          tag,
          userID
        );

        // Check the status and set appropriate message and severity
        if (response.status === "201") {
          setSeverity("success");
        } else {
          setSeverity("error");
        }
        setMessage(response.message);
        setOpenNotification(true);
        await fetchExpenseBuckets();
      } else if (dialogType === "quickNote") {
        console.log("Quick Note:", quickNote);
      }
      handleCloseDialog();

      // Navigate to the same route to re-render the component
      // navigate(0);
    } catch (error) {
      // Show error notification
      setSeverity("error");
      setMessage(error.message || "An error occurred during the save process.");
      setOpenNotification(true);
    }
  };

  //handle delete Expense Bucket
  const handleDelete = async () => {
    const response = await DeleteExpenseBucket(expBucketId);
    if (response.status === "200") {
      setSeverity("success");
      setMessage(response.message);
      setExpenseBuckets(
        expenseBuckets.filter((bucket) => bucket.id !== expBucketId)
      );
    } else {
      setSeverity("error");
      setMessage(response.message);
    }
    setOpenDialog(false);
    setOpenNotification(true);
    await fetchExpenseBuckets();
  };

  //handle Update Expense Bucket Details

  const handleUpdate = async () => {
    const userID = await getUserId(); //get userId
    // Construct the request payload with only changed fields
    const payload = {};
    if (bucketName !== originalBucketName) payload.bucketName = bucketName;
    if (description !== originalDescription) payload.description = description;
    if (tag !== originalTag) payload.tag = tag;

    // Prevent API call if no changes are detected
    if (Object.keys(payload).length === 0) {
      setMessage(
        "No changes detected. Please modify the details before updating."
      );
      setSeverity("info");
      setOpenNotification(true);
      return; // Exit the function if no changes are detected
    }
    try {
      const response = await UpdateExpenseBucket(expBucketId, userID, payload);

      if (response.status === "200") {
        setSeverity("success");
        setMessage(response.message);
        setExpenseBuckets(
          expenseBuckets.filter((bucket) => bucket.id !== expBucketId)
        );
      } else {
        setSeverity("error");
        setMessage(response.message);
      }
    } catch (error) {
      // Show error notification
      setSeverity("error");
      setMessage(error.message || "An error occurred during the save process.");
      setOpenNotification(true);
    }

    setOpenDialog(false);
    setOpenNotification(true);
    await fetchExpenseBuckets();
  };

  //handle live enter character countdown
  const handleInputChange = (e, fieldName, maxLength) => {
    const value = e.target.value;
    const remaining = maxLength - value.length;

    switch (fieldName) {
      case "quickNote":
        setQuickNote(value);
        setQuickNoteRemainingChars(remaining);
        break;
      case "tag":
        setTag(value);
        setTagRemainingChars(remaining);
        break;
      case "bucketName":
        setBucketName(value);
        setBucketNameRemainingChars(remaining);
        break;
      case "description":
        setDescription(value);
        setDescriptionRemainingChars(remaining);
        break;
      default:
        break;
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenNotification(false);
  };

  //dynamically change Popup dialog box
  const renderDialogContent = () => {
    if (dialogType === "bucket" || dialogType === "update") {
      return (
        <>
          <TextField
            autoFocus
            margin="dense"
            id="bucketName"
            label="Bucket Name"
            type="text"
            fullWidth
            variant="standard"
            value={bucketName}
            inputProps={{ maxLength: 50 }}
            onChange={(e) => handleInputChange(e, "bucketName", 50)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {bucketNameRemainingChars}/50
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={description}
            inputProps={{ maxLength: 100 }}
            onChange={(e) => handleInputChange(e, "description", 100)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {descriptionRemainingChars}/100
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="tag"
            label="Tag"
            type="text"
            fullWidth
            variant="standard"
            value={tag}
            inputProps={{ maxLength: 10 }}
            onChange={(e) => handleInputChange(e, "tag", 10)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {tagRemainingChars}/10
                </InputAdornment>
              ),
            }}
          />
        </>
      );
    } else if (dialogType === "quickNote") {
      return (
        <>
          {/* <DialogContentText>
            Please enter your quick note (max 500 characters).
          </DialogContentText> */}
          <div style={{ position: "relative" }}>
            <TextareaAutosize
              minRows={10}
              style={{
                width: "98%",
                padding: "5px",
                resize: "vertical",
                height: "10px",
                fontSize: "16px",
              }}
              value={quickNote}
              maxLength={500}
              onChange={(e) => handleInputChange(e, "quickNote", 500)}
            />
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                fontSize: "12px",
                color: "#666",
              }}
            >
              {quickNoteRemainingChars}/500
            </div>
          </div>
        </>
      );
    } else if (dialogType === "delete") {
      return "Are you sure you want to delete this expense bucket?";
    }
  };

  return (
    <div>
      <Header />
      <div className="dashboard">
        <h1 style={{ marginLeft: "20px", textAlign: "center" }}>
          Your Expense Buckets
        </h1>
        {loading ? (
          <p>Loading expense buckets...</p> // Show loading indicator
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p> // Show error message
        ) : infoMessage ? (
          <h3 style={{ color: "GrayText", textAlign: "center" }}>
            {infoMessage}
          </h3> // Show informational message
        ) : (
          <List>
            {expenseBuckets.map((bucket, index) => (
              <React.Fragment key={bucket.id}>
                <ListItem
                  className="list-item"
                  key={bucket.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                    width: "90%",
                    margin: "0 auto",
                  }}
                >
                  <ListItemIcon
                    key={bucket.id}
                    onClick={() => handleRowClick(bucket.id)}
                    onDoubleClick={() => handleRowDoubleClick(bucket.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {selectedItems.includes(bucket.id) ? (
                      <CheckCircle
                        style={{ color: "red" }}
                        className="selected-folder"
                      />
                    ) : (
                      <Folder />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={bucket.bucketName}
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() => navigate(`/viewBucket`)}
                  />
                  <ListItemIcon
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "10px",
                    }}
                  >
                    <i
                      className="fas fa-tag"
                      style={{ marginRight: "5px" }}
                    ></i>
                    <span>{bucket.tag}</span>
                  </ListItemIcon>
                  <ListItemIcon>
                    <Tooltip title={bucket.description} arrow>
                      <IconButton
                        onClick={(event) =>
                          handlePopoverClick(event, bucket.description)
                        }
                      >
                        <Info />
                      </IconButton>
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemIcon>
                    <IconButton
                      onClick={() => handleOpenDialog("update", bucket.id)}
                    >
                      <Edit />
                    </IconButton>
                  </ListItemIcon>
                  <ListItemIcon>
                    <IconButton
                      onClick={() => handleOpenDialog("delete", bucket.id)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
                {index < expenseBuckets.length - 1 && (
                  <Divider
                    sx={{
                      width: "88%",
                      backgroundColor: "rgba(125, 124, 124, 0.7)",
                      margin: "0 auto",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
        <Fab
          sx={{
            position: "fixed",
            bottom: 50,
            right: 50,
            backgroundColor: isMenuOpen
              ? "rgba(248, 61, 61, 0.99)"
              : "rgba(58, 187, 7, 0.97)",
          }}
          onClick={handleFabClick}
        >
          {isMenuOpen ? <Close /> : <Add />}
        </Fab>

        <Menu
          anchorEl={anchorElMenu}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            mt: -1, // Adjust to move the menu higher above the FAB
            "& .MuiPaper-root": {
              marginBottom: 1, // Adjust the margin-bottom if necessary
            },
          }}
        >
          <MenuItem
            onClick={() => handleOpenDialog("bucket")}
            sx={{ "&:hover": { backgroundColor: "rgba(136, 244, 94, 0.97)" } }}
          >
            Add New Bucket
          </MenuItem>
          <MenuItem
            onClick={() => handleOpenDialog("quickNote")}
            sx={{ "&:hover": { backgroundColor: "rgba(136, 244, 94, 0.97)" } }}
          >
            Add Quick Note
          </MenuItem>
        </Menu>
        <CustomDialog
          open={openDialog}
          onClose={handleCloseDialog}
          title={
            dialogType === "bucket"
              ? "Add New Bucket"
              : dialogType === "quickNote"
              ? "Add Quick Note"
              : dialogType === "update"
              ? "Update Bucket Details"
              : "Confirm Deletion"
          }
          content={renderDialogContent()}
          onConfirm={
            dialogType === "delete"
              ? handleDelete
              : dialogType === "update"
              ? handleUpdate
              : handleSave
          }
          confirmText={
            dialogType === "delete"
              ? "Delete"
              : dialogType === "update"
              ? "Update"
              : "Save"
          }
        />
        <Snackbar
          open={openNotification}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{ mt: 8 }}
        >
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
        <Popover
          open={isPopoverOpen}
          anchorEl={anchorElPopover}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <div
            style={{
              padding: "10px",
              maxWidth: "200px",
              maxHeight: "100px",
              overflowY: "auto",
              backgroundColor: "lightgray",
            }}
          >
            <p>{selectedDescription}</p>
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default DashboardPage;
