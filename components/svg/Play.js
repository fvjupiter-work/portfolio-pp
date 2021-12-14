import React from 'react'

export default function Play() {//{ styles }
    const [hover, sethover] = useState(false)
    return (
        <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             height='40' width='40' 
            //  className={styles.playSvg}
              viewBox="0 0 51.1 42.2" 
             style={{enableBackground:'new 0 0 51.1 42.2'}} xmlSpace="preserve"
             onMouseEnter={() => sethover(true)} 
             onMouseLeave={() => sethover(false)}
             >
        {/* <style type="text/css">
            .st0{fill-rule:evenodd;clip-rule:evenodd;fill:#808080;}
        </style> */}
        <path style={{fill: hover ? '#E6E6E6' : '#808080'}} className="st0" d="M26.5,6C18.5,6,12,12.5,12,20.5S18.5,35,26.5,35S41,28.5,41,20.5C41,12.5,34.5,6,26.5,6z M23.6,26.8V15.1
            l9.2,5.8L23.6,26.8z"/>
        </svg>
    )
}
