import styles from './label.module.css'
export default function Label({iscode, setIscode}){
    const handleClick = () => {
        setIscode(!iscode)
    }
    return(
        <div className={styles.container}>
            <h3 id = "p" className={styles.test}>Code (Beta)</h3>
            <label onClick={handleClick} className={iscode ? `${styles.switch + " " + styles.checked}` : styles.switch}>
                <div></div>
            </label>
        </div>
    )
}