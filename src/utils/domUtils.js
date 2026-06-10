import styled from "styled-components";

export const update_root_value = (variable, value) => {
  document.documentElement.style.setProperty(variable, value);
};

export const get_root_value = (variable) => {
  return document.documentElement.style.getPropertyValue(variable);
};

export const capitalizeName = (name) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const formatFullName = (firstName, lastName) => {
  const capitalizedFirstName = capitalizeName(firstName);
  const capitalizedLastName = capitalizeName(lastName);
  return `${capitalizedFirstName} ${capitalizedLastName}`.trim();
};

export const Input = styled("input")({
  display: "none",
});
