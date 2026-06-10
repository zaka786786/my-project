import { TextField } from "@mui/material";

const AddOrUpdateLeadStatusForm = ({ form, handleChange, rowData }) => {
  return (
    <div className="container px-0">
      <div className="d-flex gap-3 mb-3 mt-2">
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        {rowData && (
          <TextField
            fullWidth
            label="Order"
            name="order"
            value={form?.order}
            onChange={handleChange}
            required
          />
        )}
      </div>

      <div className="d-flex gap-3 mb-3">
        <TextField
          fullWidth
          label="Text Color"
          name="text_color"
          type="color"
          value={form?.text_color || "#000000"}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          fullWidth
          label="Background Color"
          name="background_color"
          type="color"
          value={form?.background_color || "#ffffff"}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
      </div>

      <div>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={3}
        />
      </div>
    </div>
  );
};

export default AddOrUpdateLeadStatusForm;
