import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import ClearIcon from "@mui/icons-material/Clear";

const SearchBar = ({ setFilter, variant = "default" }) => {
  const isHeaderVariant = variant === "header";

  return (
    <Stack
      spacing={2}
      sx={{
        width: isHeaderVariant ? 250 : 300,
        cursor: "text",
      }}
    >
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        sx={{ textAlign: "center" }}
        disableClearable={false}
        options={[]}
        clearIcon={
          <ClearIcon
            sx={{
              cursor: "pointer",
              position: "absolute",
              right: "10px",
              color: isHeaderVariant ? "rgba(255, 255, 255, 0.7)" : "inherit",
            }}
          />
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search courses"
            className="search-input-div"
            sx={{
              my: isHeaderVariant ? 0 : 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: isHeaderVariant
                    ? "rgba(255, 255, 255, 0.3)"
                    : "#1d96a7",
                },
                "&:hover fieldset": {
                  borderColor: isHeaderVariant
                    ? "rgba(255, 255, 255, 0.5)"
                    : "#202e61",
                },
                "&.Mui-focused fieldset": {
                  borderColor: isHeaderVariant ? "#fb8928" : "#202e61",
                },
                backgroundColor: isHeaderVariant
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
                borderRadius: isHeaderVariant ? "25px" : "default",
                color: isHeaderVariant ? "white" : "inherit",
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": {
                  color: isHeaderVariant
                    ? "#fb8928 !important"
                    : "#000 !important",
                  fontWeight: "700",
                },
                color: isHeaderVariant
                  ? "rgba(255, 255, 255, 0.7) !important"
                  : "inherit",
              },
              "& .MuiOutlinedInput-input": {
                color: isHeaderVariant ? "white !important" : "inherit",
              },
            }}
            slotProps={{
              input: {
                ...params.InputProps,
                type: "text",
                onChange: (e) => setFilter(e.target.value),
              },
            }}
            onClick={(e) => {
              let nodeName = e.target.nodeName.toLowerCase();
              if (
                nodeName === "svg" ||
                nodeName === "path" ||
                nodeName === "button"
              ) {
                setFilter("");
              }
            }}
          />
        )}
      />
    </Stack>
  );
};

export default SearchBar;
