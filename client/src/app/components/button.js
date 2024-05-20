import styles from './button.module.css'
export default function CustomButton({type, text}){
    return(
        <button className={styles.formbtn} type={type}>{text}</button>
    )
}