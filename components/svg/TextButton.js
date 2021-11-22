import React, { useState } from 'react'

export default function TextButton({ isClicked, styles }) {
    const [hover, sethover] = useState(false)
    return (
        <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 48.5 43.5" style={{enableBackground: 'new 0 0 48.5 43.5',borderRadius: '100%'}} xmlSpace="preserve"
            onMouseEnter={() => sethover(true)} 
            onMouseLeave={() => sethover(false)}
            className={`${styles.textSVG}`}
        >
        <style type="text/css">
            {`.st0{fill:#E6E6E6;}`}
        </style>
        <path style={{transition: '0.2s ease-in-out'}} className="" d="M22.5,6.6c-8,0-14.5,6.5-14.5,14.5s6.5,14.5,14.5,14.5S37,29.2,37,21.2S30.5,6.6,22.5,6.6z M30,19h-2.6v-1.9
            h-3.7v9.9h2.2v2.6H19v-2.6h2.2v-9.9h-3.7V19H15v-4.5h15V19z" fill={hover || isClicked ? '#E6E6E6' : '#808080'}/>
        </svg>
    )
}
