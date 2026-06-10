import * as React from "react";
import "react-tagsinput/react-tagsinput.css";
import TagsInput from "react-tagsinput";

const CustomCross = (props) => (
  <span {...props} style={{ cursor: "pointer", color: "red" }}>
    &#10006;
  </span>
);

export default function CustomTagsInput({
  selectedTagsInput,
  setSelectedTagsInput,
  label = "Add",
  name = "input",
  className = "",
  maxTags = -1,
}) {
  const renderTag = (props) => {
    let { tag, key, disabled, onRemove, classNameRemove, getTagDisplayValue } =
      props;
    return (
      <span className="react-tagsinput-tag" key={key}>
        {getTagDisplayValue(tag)}
        {!disabled && (
          <CustomCross
            className={classNameRemove}
            onClick={() => onRemove(key)}
          />
        )}
      </span>
    );
  };
  return (
    <div className={`w-100 ${className} `}>
      <TagsInput
        value={selectedTagsInput}
        onChange={setSelectedTagsInput}
        inputProps={{
          placeholder: label,
        }}
        name={name}
        renderTag={renderTag}
        maxTags={maxTags}
        label={label}
        variant="outlined"
      />
    </div>
  );
}
