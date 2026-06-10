import { TextField } from "@mui/material";

const AddOrUpdateComponent = ({ formInputs, handleChange, rowData }) => {
  return (
    <div className="popover-mid-container">
      <div className="spacing">
        <div className="row-spacing">
          <TextField
            fullWidth
            label="Title"
            value={formInputs.title}
            onChange={handleChange}
            name="title"
            className="text-field-border"
            required
          />
        </div>

        <div className="row-spacing">
          <TextField
            fullWidth
            label="Description"
            value={formInputs.description}
            onChange={handleChange}
            name="description"
            className="text-field-border"
            required
            multiline
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default AddOrUpdateComponent;
