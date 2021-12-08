import React, { useState } from 'react'

export default function FullS({ styles }) {
    const [hover, sethover] = useState(false)
    return (
        <svg height='80' width='80' version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 87.1 67" className={styles.fullSSvg} style={{ enableBackground:'new 0 0 87.1 67', marginRight: 7 }} xmlSpace="preserve"
            onMouseEnter={() => sethover(true)} 
            onMouseLeave={() => sethover(false)}
            >
        {/* <style type="text/css">
            .st0{fill-rule:evenodd;clip-rule:evenodd;fill:#828181;}
        </style> */}
        <path style={{fill: hover ? '#E6E6E6' : '#808080' }} className="st0" d="M52.8,23.7H34.1c-1.7,0-3,1.3-3,3v18.6c0,1.7,1.3,3,3,3h18.6c1.7,0,3-1.3,3-3V26.7C55.8,25,54.4,23.7,52.8,23.7
            z M42,44.5h-7.1v-7.1h1.6v5.5H42V44.5z M52,34.6h-1.6v-5.5h-5.5v-1.6H52V34.6z"/>
        </svg>
    )
}
