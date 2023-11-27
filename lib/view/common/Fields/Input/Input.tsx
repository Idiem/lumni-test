import { ChangeEventHandler, CSSProperties, FocusEventHandler, ForwardedRef, forwardRef } from "react";
import styles from "../Inputs.module.css";

export interface IInputProps {
  variant: "outlined" | "filled";
  color?: "light" | "dark";
  multiline?: boolean;
  id?: string;
  type?: "text" | "number" | "password" | "date" | "file" | "email"
  name?: string;
  value?: string | number;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  style?: CSSProperties;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  disableArrows?: boolean;
  accept?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  autofocus?: boolean;
  hidden?: boolean;
}

const Input = forwardRef(function Input(
  props: IInputProps,
  ref: ForwardedRef<HTMLTextAreaElement & HTMLInputElement>,
) {

  const InputBase = (props.multiline ? "textarea" : "input") as "input";

  return (
    <InputBase
      ref={ref}
      id={props.id}
      type={props.type}
      name={props.name}
      className={
        styles[props.variant]
        + (props.color ? ` ${styles[props.color]}` : "")
        + (props.error ? ` ${styles.error}` : "")
        + (props.disableArrows ? ` ${styles.disableArrows}` : "")
      }
      value={props.value}
      disabled={props.disabled}
      placeholder={props.placeholder}
      onChange={props.onChange}
      onBlur={props.onBlur}
      style={props.style}
      maxLength={props.maxLength}
      accept={props.accept}
      min={props.min}
      max={props.max}
      autoFocus={props.autofocus}
      hidden={props.hidden}
    />
  );
});

export default Input;
