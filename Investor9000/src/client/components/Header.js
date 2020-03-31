import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Logo from '../../../public/images/investor9000.png';

const useStyles = makeStyles({
    headerImage: {
        margin: 'auto',
        height: '100%',
        padding: '10px',
        objectFit: 'scale-down',
    },
    header: {
        position: 'fixed',
        top: '0',
        height: '200px',
        width: '100%',
        textAlign: 'center',
        border: '1px solid black',
        background: 'linear-gradient(114deg, rgba(0, 0, 0, 1) 0%, rgba(45, 45, 45, 1) 100%)',
        color: '#ffffff',
        transition: 'all .15s ease-in',
    },
    headerScrolled: {
        position: 'fixed',
        top: '0',
        height: '50px',
        width: '100%',
        textAlign: 'center',
        border: '1px solid black',
        background: 'linear-gradient(114deg, rgba(0, 0, 0, 1) 0%, rgba(45, 45, 45, 1) 100%)',
        color: '#ffffff',
        transition: 'all .15s ease-in',
        zIndex: '1',
    },
    headerGhost: {
        height: '200px',
        transition: 'all .15s ease-in',
    },
    headerGhostScrolled: {
        height: '50px',
        transition: 'all .15s ease-in',
    },
});

const Header = () => {
    const [scroll, setScroll] = useState(true);
    const classes = useStyles();

    useEffect(() => {
        window.addEventListener('scroll', () => {
            const isTop = window.scrollY <= 0;
            if (isTop) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        });
    });

    return (
        <div>
            <div className={scroll ? classes.headerGhost : classes.headerGhostScrolled} />
            <div className={scroll ? classes.header : classes.headerScrolled}>
                <img src={Logo} className={classes.headerImage} alt="Investor9000" />
            </div>
        </div>
    );
};

export default Header;
