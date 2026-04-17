import styles from './Logo.module.css'

const Logo = () => {
    return (
        <div className={styles['menu-title']}>
            <h1>Étlap</h1>
            <div className={styles['title-decoration']}>
                <span></span>
                <svg aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 3c1.918 0 3.52 1.35 3.91 3.151a4 4 0 0 1 2.09 7.723l0 7.126h-12v-7.126a4 4 0 1 1 2.092 -7.723a4 4 0 0 1 3.908 -3.151z" />
                    <path d="M6.161 17.009l11.839 -.009" />
                </svg>
                <span></span>
            </div>
        </div>
    )
}

export default Logo