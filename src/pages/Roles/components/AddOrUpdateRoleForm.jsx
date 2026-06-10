import { TextField } from "@mui/material";

const AddOrUpdateRoleForm = ({ form, handleChange }) => {
  return (
    <div className="popover-mid-container">
      <div className="row-spacing mb-3">
        <TextField
          fullWidth
          label="Role Name"
          name="name"
          value={form?.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="row-spacing mb-3">
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={form?.description}
          onChange={handleChange}
          multiline
          rows={3}
        />
      </div>
    </div>
  );
};

export default AddOrUpdateRoleForm;
