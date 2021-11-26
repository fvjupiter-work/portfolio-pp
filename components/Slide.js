import * as React from "react";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function Example({ boxList, currentBoxId, boxIdHandler, height, width })  {

    //delete page before use

    //props
    //////////// touch-action //////// like on framer-drag described
    // const boxList = ['','','','','','','']
    // const height = 546
    // const width = 344.5
    const treshold = width / 3
    const scaleHover = 0.97
    const scaleClick = 0.93
    const duration = 0.35
    const stiffnessClick = 175
    const dragElastic = 0.175
    const borderRadiusNorm = 0 // 0 if backdrop!
    const borderRadiusClick = 0
    const backgroundWrapStyles = {} // will be passed to styles
    const barStyles = {}
    const boxStyles = {}
    const endless = false // may delete

    //controls 
    const controlsWrap = useAnimation()
    const controlsBar = useAnimation()
    const controlsBox = useAnimation()

    //states
    const [boxId, setboxId] = useState(0)
    useEffect(() => {
        setBarPosition(currentBoxId * -width)
        setboxId(currentBoxId)
    }, [])
    const setBoxId = newId => {
        setboxId(newId)
        boxIdHandler(newId)
    }
    const [isScroll, setisScroll] = useState(false)
    const [barPosition, setbarPosition] = useState(0)
    // const [scale, setscale] = useState(1)

    const setBarPosition = newPos => { 
        controlsBar.start({ x: newPos })
        setbarPosition(newPos)
    }

    const scaleBoxNorm  = () => controlsBox.start({ scale: 1, borderRadius: borderRadiusNorm })
    const scaleBoxHover = () => controlsBox.start({ scale: scaleHover,  borderRadius: borderRadiusClick })
    const scaleBoxClick = () => controlsBox.start({ 
        scale: scaleClick, 
        borderRadius: borderRadiusClick,
        transition: { type: 'spring', stiffness: stiffnessClick,  mass: 0.1, }
    }) 
    

    //gesture-trigger functions
    const panEndBar = (event, info) => {
        setisBoxTapped(false)
        console.log('boxtap set false')
        if(!isScroll){
            scaleBoxNorm()
            const   offX = info.offset.x,
                    hitTreshold = offX > treshold || offX < -treshold,
                    moveNext = offX < 0,
                    isFirst = boxId == 0,
                    isLast = boxId == boxList.length-1,
                    nextIsFirst = isLast && endless && moveNext,
                    previousIsLast = isFirst && endless && !moveNext,
                    newBarPos = nextIsFirst ? 0
                        : previousIsLast ? (boxList.length-1) * -width
                        : moveNext ? barPosition - width 
                        : barPosition + width,
                    forbidden = !endless && !isScroll 
                        && (isFirst && !moveNext) 
                        || (isLast && moveNext)
    
            if(hitTreshold && !forbidden){
                setBarPosition(newBarPos)
                setBoxId(
                    nextIsFirst ? 0
                    : previousIsLast ? boxList.length-1
                    : moveNext ? boxId + 1 : boxId - 1
                )
            } else setBarPosition(barPosition)
        }
    }

    const [isBoxTapped, setisBoxTapped] = useState(false)
    const tapBox = (index) => {
        if(isScroll){
            scaleBoxNorm()
            setBarPosition(index * -width)
            setBoxId(index)
        } else scaleBoxClick()
        setisScroll(!isScroll)
        console.log('boxtap set false')
        setisBoxTapped(false)
    }

    //styles
    const sty = {
        backgroundWrap: { 
            height: height, 
            width: width,
            borderRadius: borderRadiusNorm,
            position: 'absolute',
            overflow: 'hidden',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundColor: 'white',
            touchAction: 'none',
            ...backgroundWrapStyles
        },
        bar: { 
            height: height,
            width: isScroll ? width * (boxList.length) : width * 3,  
            marginLeft: isScroll ? 0 : -width + (-barPosition), 
            justifyContent: isScroll ? 'center' 
                : boxId == 0 ? 'flex-end' 
                : boxId == boxList.length-1 ? 'flex-start' 
                : 'center',   //(only neccessary if not endless.. update)
                top: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            // background: 'orange',
            touchAction: 'none',
            ...barStyles
        },
        box: {
            position: 'relative',
            height: height, 
            width: width,
            backgroundPosition: '50% 50%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundColor: 'white',
            boxShadow: '0 62.5px 125px -25px rgba(50, 50, 73, 0.5), 0 37.5px 75px -37.5px rgba(0, 0, 0, 0.6)',
            touchAction: 'none',
            ...boxStyles
        }
    }
    
    //components (function which returns elements to not always render again...)
    const getBox = ({ val, index }) => 
        <motion.div 
            key={index}
            animate={controlsBox} 
            transition={{ duration: duration }}
            style={{...sty.box,
                display: !isScroll 
                    && (index > boxId + 1 || index < boxId - 1) ? 'none' : 'block',
                    zIndex: index == boxId && 1
            }}
            onTapStart={() => { setisBoxTapped(isBoxTapped); console.log('boxtap set true') }}
            onTap={() => { if(!isBoxTapped) tapBox(index) }}
        >
            <div style={{ zIndex: 2, height: '100%', width: '100%', position: 'absolute' }} />
            {val}
    </motion.div>

    return <>
        <div style={sty.backgroundWrap}
            animate={controlsWrap}
            transition={{ duration: duration }}
        >
            {/* <div style={{ background: 'white', height: height+50, width: width}}></div> */}
            <motion.section 
                style={sty.bar}
                animate={controlsBar}
                transition={{ duration: duration }}
                drag='x'
                dragConstraints={{ 
                    left: isScroll ? -width * (boxList.length-1) : -width + -width * boxId, 
                    right: isScroll ? 0 : width + (-width * boxId),
                    top: 0, 
                    bottom: 0 
                }} 
                dragElastic={dragElastic}
                onTapStart={scaleBoxClick}
                onPanEnd={panEndBar}
                onHoverStart={!isScroll && scaleBoxHover}
                onHoverEnd={!isScroll && scaleBoxNorm}
            >
                {!isScroll && endless && getBox({ val:'go to last', index: -1 })}
                {boxList.map((val, index) => getBox({ val, index }))}
                {!isScroll && endless && getBox({ val:'go to first', index: boxList.length })}
            </motion.section>
        </div>
    </>
}
