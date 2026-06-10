import {
  MenuItem,
  Select,
  Box,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
 
const ToggleLanguage = ({ value, setValue }) => {
  const handleChange = (e) => {
    const newLang = e.target.value;
    setValue(newLang);
  };
 
  const languages = [
    { code: "en", label: "English", flag: "https://flagcdn.com/24x18/us.png" },
    { code: "ur", label: "اردو", flag: "https://flagcdn.com/24x18/pk.png" },
  ];
 
  return (
    <FormControl fullWidth>
      <InputLabel>Select your Language</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        size="small"
        label="Select your Language"
        variant="outlined"
        fullWidth
        renderValue={(selected) => {
          const lang = languages.find((l) => l.code === selected);
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src={lang?.flag} alt={lang?.label} width={20} />
              <Typography variant="body2">{lang?.label}</Typography>
            </Box>
          );
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang?.code} value={lang.code}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src={lang?.flag} alt={lang?.label} width={20} />
              <Typography variant="body2">{lang?.label}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
 
export default ToggleLanguage;
 
 