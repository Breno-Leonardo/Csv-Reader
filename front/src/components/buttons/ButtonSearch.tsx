import styles from "./ButtonSearch.module.css"
import icon from "../../assets/text-box-search.svg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>  {
  
}

export function ButtonSearch(props: ButtonProps) {
  return (
    
      
      <button className={styles.button}    onClick={props.onClick}>
        <img src={icon} className={styles.icon} />
      </button>
    
  );
}
