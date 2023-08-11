import styles from "./ButtonRecent.module.css";
import icon from "../../assets/file-document-outline.svg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLDivElement>  {
  filename: string;
}

export function ButtonRecent(props: ButtonProps) {
  return (
    <div className={styles.divButtonRecent} onClick={props.onClick}>
      <img src={icon} className={styles.icon} />
      <button className={styles.buttonRecent} >
        {props.filename}
      </button>
    </div>
  );
}
