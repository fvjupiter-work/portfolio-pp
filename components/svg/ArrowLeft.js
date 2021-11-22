import React, { useState } from 'react'

export default function ArrowLeft({ isClicked }) {
    const [hover, sethover] = useState(false)
    const css = `
        .st0{fill-rule:evenodd;clip-rule:evenodd;fill:#808080;}
    `
    return (
        <svg height='40' width='40' version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 37.7 40.1" style={{enableBackground:'new 0 0 37.7 40.1'}} xmlSpace="preserve"
            onMouseEnter={() => sethover(true)} 
            onMouseLeave={() => sethover(false)}
            
            >
                <style type="text/css">
                    {css}
                </style>
                <path style={{fill: hover || isClicked ? '#E6E6E6' : '#808080'}} className="st0" d="M17.4,4.1c-8,0-14.5,6.5-14.5,14.5c0,8,6.5,14.5,14.5,14.5c8,0,14.5-6.5,14.5-14.5C31.9,10.6,25.4,4.1,17.4,4.1
                    z M18.3,12.5c0,0-4.2,4.3-5.4,5.4h11.5v1.7H12.9c1.1,1.1,5.4,5.4,5.4,5.4h-2.6c-0.6-0.6-1.4-1.5-2.3-2.4c-1.3-1.4-2.7-2.9-3.7-3.8
                    c0.9-0.9,2.2-2.3,3.5-3.6c1-1,1.9-2,2.5-2.7H18.3z"/>
        </svg>

    )
}
