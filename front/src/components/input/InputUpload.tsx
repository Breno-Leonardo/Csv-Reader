import styles from "./InputUpload.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function InputUpload(props: InputProps) {
  return <input  className= {styles.inputUpload} onChange={props.onChange} type="file"  accept="text/csv"></input>;
}
