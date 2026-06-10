import React from "react";
import PhoneInput from "react-phone-input-2";

const CustomPhoneInput = ({
  country = "pk",
  phoneNumber,
  setPhoneNumber,
  disabled,
}) => {
  const handleChange = (value, country) => {
    setPhoneNumber(value);
  };

  return (
    <PhoneInput
      value={phoneNumber}
      setValue={setPhoneNumber}
      onChange={handleChange}
      country={country}
      disabled={disabled}
    />
  );
};

export default CustomPhoneInput;
