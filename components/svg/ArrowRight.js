import React, { useState } from 'react'

export default function ArrowRight({ isClicked }) {
	const [hover, sethover] = useState(false)
    return (
        <svg height='40' width='40' version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 37.7 40.1" style={{enableBackground:'new 0 0 37.7 40.1'}} xmlSpace="preserve" 
	 
	 onMouseEnter={() => sethover(true)} 
	 onMouseLeave={() => sethover(false)}
	 
	 >
<style type="text/css">
	{`.st0{fill-rule:evenodd;clip-rule:evenodd;fill:#808080; transition: 0.2s ease-in-out;}`}
</style>
<path style={{fill: hover || isClicked ? '#E6E6E6' : '#808080'}} className="st0" d="M17.4,33.1c8,0,14.5-6.5,14.5-14.5c0-8-6.5-14.5-14.5-14.5c-8,0-14.5,6.5-14.5,14.5
	C2.9,26.6,9.4,33.1,17.4,33.1z M16.6,24.7c0,0,4.2-4.3,5.4-5.4H10.4v-1.7h11.5c-1.1-1.1-5.4-5.4-5.4-5.4h2.6
	c0.6,0.6,1.4,1.5,2.3,2.4c1.3,1.4,2.7,2.9,3.7,3.8c-0.9,0.9-2.2,2.3-3.5,3.6c-1,1-1.9,2-2.5,2.7H16.6z"/>
</svg>
    )
}
