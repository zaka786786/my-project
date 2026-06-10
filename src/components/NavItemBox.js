import React, { useState } from 'react';
import { Box, TextField, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TitleField from './NavItems/TitleField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function NavItemBox({ item, onAddParent, onAddChild, onRemove, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleInputChange = (section, field, value) => {
    const updated = {
      ...item,
      [section]: {
        ...item[section],
        [field]: value
      }
    };
    onChange(updated);
  };

  const [isLink, setisLink] = useState('No');

  return (
  <Box
    sx={{
      position: 'relative',
      border: '1px solid #555',
      p: 2,
      borderRadius: 2,
      mb: 2,
      bgcolor: '#f8f9fa',
      color: '#555'
    }}
  >
    {/* Menu */}
    <IconButton
      onClick={handleMenuClick}
      sx={{ position: 'absolute', top: 8, right: 8, color: '#555' }}
    >
      <MoreVertIcon />
    </IconButton>
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <MenuItem onClick={() => { handleClose(); onAddParent(); }}>Add as Parent</MenuItem>
      <MenuItem onClick={() => { handleClose(); onAddChild(); }}>Add as Child</MenuItem>
      <MenuItem onClick={() => { handleClose(); onRemove(); }}>Remove</MenuItem>
    </Menu>

    {/* Parent Fields */}
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        size="small"
        label="Title"
        value={item.parentData.title}
        onChange={(e) => handleInputChange('parentData', 'title', e.target.value)}
      />


      

      <FormControl size="small" sx={{ minWidth: 90, flexGrow: 1 }}>
        <InputLabel id="demo-simple-select-label" sx={{ color: "#ccc" }}>
          Is Link
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={isLink}
          label="Is Link"
          onChange={(e) =>
            handleInputChange("parentData", "isLink", e.target.value)
          }
          input={
            <OutlinedInput
              label="Is Link"
              sx={{
                color: "#888",
                "& fieldset": { borderColor: "#888" },
                "&:hover fieldset": { borderColor: "#aaa" },
                "&.Mui-focused fieldset": { borderColor: "#fff" }
              }}
            />
          }
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      </FormControl>



      <TextField
        size="small"
        label="Path"
        value={item.parentData.path}
        onChange={(e) => handleInputChange('parentData', 'path', e.target.value)}
      /> 
      <TextField
        size="small"
        label="Value"
        value={item.parentData.value}
        onChange={(e) => handleInputChange('parentData', 'value', e.target.value)}
      />


      <FormControl size="small" sx={{ minWidth: 90, flexGrow: 1 }}>
        <InputLabel id="is-open-new-tab" sx={{ color: "#ccc" }}>
          Is Open New Tab
        </InputLabel>
        <Select
          labelId="is-open-new-tab"
          id="is-open-new-tab-select"
          // value={item.parentData.isOpenNewTab || 'No'}
          label="Is open new tab"
          onChange={(e) =>
            handleInputChange("parentData", "isOpenNewTab", e.target.value)
          }
          input={
            <OutlinedInput
              label="Is Open New Tab"
              sx={{
                color: "#888",
                "& fieldset": { borderColor: "#888" },
                "&:hover fieldset": { borderColor: "#aaa" },
                "&.Mui-focused fieldset": { borderColor: "#fff" }
              }}
            />
          }
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      </FormControl>
    </Box>

    {/* Child Fields if type is child */}
    
    {item.type === 'child' && (
      <>
        <p className='mt-3'>Child</p>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt:2 }}>
          <TextField
            label="Title"
            value={item.childData.title}
            onChange={(e) => handleInputChange('childData', 'title', e.target.value)}
            InputLabelProps={{ style: { color: '#555' } }}
            InputProps={{
              style: { color: '#fff' },
              sx: {
                '& fieldset': { borderColor: '#888' },
                '&.Mui-focused fieldset': { borderColor: '#fff' }
              }
            }}
          />
          <TextField
            label="Is Link"
            value={item.childData.isLink}
            onChange={(e) => handleInputChange('childData', 'isLink', e.target.value)}
            InputLabelProps={{ style: { color: '#555' } }}
            InputProps={{
              style: { color: '#fff' },
              sx: {
                '& fieldset': { borderColor: '#888' },
                '&.Mui-focused fieldset': { borderColor: '#fff' }
              }
            }}
          />
          <TextField
            label="Path"
            value={item.childData.path}
            onChange={(e) => handleInputChange('childData', 'path', e.target.value)}
            InputLabelProps={{ style: { color: '#555' } }}
            InputProps={{
              style: { color: '#fff' },
              sx: {
                '& fieldset': { borderColor: '#888' },
                '&.Mui-focused fieldset': { borderColor: '#fff' }
              }
            }}
          />
          <TextField
            label="Value"
            value={item.childData.value}
            onChange={(e) => handleInputChange('childData', 'value', e.target.value)}
            InputLabelProps={{ style: { color: '#555' } }}
            InputProps={{
              style: { color: '#fff' },
              sx: {
                '& fieldset': { borderColor: '#888' },
                '&.Mui-focused fieldset': { borderColor: '#fff' }
              }
            }}
          />
          <TextField
            label="Is Open New Tab"
            value={item.childData.isOpenNewTab}
            onChange={(e) => handleInputChange('childData', 'isOpenNewTab', e.target.value)}
            InputLabelProps={{ style: { color: '#555' } }}
            InputProps={{
              style: { color: '#fff' },
              sx: {
                '& fieldset': { borderColor: '#888' },
                '&.Mui-focused fieldset': { borderColor: '#fff' }
              }
            }}
          />
        </Box>
      </>
    )}
  </Box>
);

}
