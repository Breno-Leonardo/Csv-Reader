import styles from "./InputSearch.module.css";
import React from "react";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputSearch = React.memo((props: InputProps) => {
  return (
    <input
      className={styles.InputSearch}
      placeholder={props.placeholder}
      onChange={props.onChange}
      type="text"
    ></input>
  );
});
export default InputSearch;
