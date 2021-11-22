import React, { useState } from 'react'

export default function Info({ styles, isClicked }) {
    const [hover, sethover] = useState(false)
    return (
        <svg className={`${styles.infoSVG}`} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => sethover(true)} 
        onMouseLeave={() => sethover(false)}
        >
        <circle style={{transition: '0.2s ease-in-out'}} cx="15.4669" cy="14.5329" r="14.5329" fill={hover || isClicked ? '#E6E6E6' : '#808080'} />
        <path d="M14.0603 22H16.8775V11.743H14.0603V22ZM16.8775 7.8346H14.0603V10.1558H16.8775V7.8346Z" fill="white"/>
        </svg>
    )
}
