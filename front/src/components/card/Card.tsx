import { memo } from "react";
import styles from "./Card.module.css";

interface CardProps {
  items: string[];
}

 function Card(props: CardProps) {
  const colorNumber = Math.floor(Math.random() * 22).toString();
  const color = "color" + colorNumber;
  let count = 0;
  let keys = Object.keys(props.items);
  let values = Object.values(props.items);
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      {keys.map((item, index) => {
        keys[index] =keys[index][0].toLocaleUpperCase()+keys[index].substring(1);
        return (
          <p key={count++} className={styles.pCard}>
            {keys[index].replace("_"," ") + ": " + values[index]}
          </p>
        );
      })}
    </div>
  );
}

export default memo(Card);