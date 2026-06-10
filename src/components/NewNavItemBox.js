import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

const NavItemCard = ({
  item,
  parentIdx,
  boolOptions,
  handleParentChange,
  handleChildChange,
  addChild,
  removeChild,
  removeParent,
}) => {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  return (
    <Card key={item.id} sx={{ mb: 3, p: 2 }}>
      <CardContent>
        {/* <Typography variant="h6" gutterBottom>
          Parent Item
        </Typography> */}

        <TextField
          label="Title"
          value={item.title}
          onChange={(e) =>
            handleParentChange(parentIdx, 'title', e.target.value)
          }
          
          sx={{ mb: 2 }}
        />

        <TextField
          label="Value"
          value={item.value}
          onChange={(e) =>
            handleParentChange(parentIdx, 'value', e.target.value)
          }
          
          sx={{ mb: 2 }}
        />

        <TextField
          label="Path"
          value={item.path || ''}
          onChange={(e) =>
            handleParentChange(parentIdx, 'path', e.target.value)
          }
          
          sx={{ mb: 2 }}
        />

        {!hasChildren && (
          <>
            {/* <Typography variant="subtitle1" gutterBottom>
              Parent Link Options
            </Typography> */}

            <Select
              label="Is Link"
              value={item.isLink || 'No'}
              onChange={(e) =>
                handleParentChange(parentIdx, 'isLink', e.target.value)
              }
              
              sx={{ mb: 2 }}
            >
              {boolOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>

            <Select
              label="Open in New Tab"
              value={item.isOpenNewTab || 'No'}
              onChange={(e) =>
                handleParentChange(parentIdx, 'isOpenNewTab', e.target.value)
              }
              
              sx={{ mb: 2 }}
            >
              {boolOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </>
        )}

        {hasChildren && (
          <>
            {/* <Typography variant="subtitle1" gutterBottom>
              Children
            </Typography> */}

            {item.children.map((child, childIdx) => (
              <Card
                key={child.id}
                variant="outlined"
                sx={{ p: 2, mb: 2, backgroundColor: '#fafafa' }}
              >
                <TextField
                  label="Child Title"
                  value={child.title}
                  onChange={(e) =>
                    handleChildChange(parentIdx, childIdx, 'title', e.target.value)
                  }
                  
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Child Value"
                  value={child.value}
                  onChange={(e) =>
                    handleChildChange(parentIdx, childIdx, 'value', e.target.value)
                  }
                  
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Child Path"
                  value={child.path || ''}
                  onChange={(e) =>
                    handleChildChange(parentIdx, childIdx, 'path', e.target.value)
                  }
                  
                  sx={{ mb: 2 }}
                />

                <Select
                  label="Is Link"
                  value={child.isLink || 'No'}
                  onChange={(e) =>
                    handleChildChange(parentIdx, childIdx, 'isLink', e.target.value)
                  }
                  
                  sx={{ mb: 2 }}
                >
                  {boolOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>

                <Select
                  label="Open in New Tab"
                  value={child.isOpenNewTab || 'No'}
                  onChange={(e) =>
                    handleChildChange(parentIdx, childIdx, 'isOpenNewTab', e.target.value)
                  }
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {boolOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeChild(parentIdx, childIdx)}
                >
                  Remove Child
                </Button>
              </Card>
            ))}
          </>
        )}

        <Button
          variant="outlined"
          onClick={() => addChild(parentIdx)}
          sx={{ mt: 1, mr: 1 }}
        >
          Add Child
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={() => removeParent(parentIdx)}
          sx={{ mt: 1 }}
        >
          Remove Nav Item
        </Button>
      </CardContent>
    </Card>
  );
};

export default NavItemCard;
