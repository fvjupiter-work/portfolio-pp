import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function Example({ boxList, currentBoxId, boxIdHandler, height, width, borderRadius })  {
    const treshold = width / 8
    const scaleHover = 0.97
    const scaleClick = 0.93
    const isScaleOnSwipe = true
    const duration = 0.35
    const stiffnessClick = 175
    const dragElastic = 0.175
    const borderRadiusNorm = 0 // 0 if backdrop!
    const borderRadiusClick = 0//borderRadius


    const [boxShadowww, setboxShadowww] = useState('')
    const [bgColor, setbgColor] = useState('white')


    const backgroundWrapStyles = { 
        backgroundColor: bgColor
        // backgroundColor: 'lightGray'
    } // will be passed to styles
    const barStyles = {}
    const boxStyles = {
        boxShadow: boxShadowww,
        // '0 62.5px 125px -25px rgba(50, 50, 73, 0.5), 0 37.5px 75px -37.5px rgba(0, 0, 0, 0.6)',
    }
    const endless = false // may delete

    //controls 
    const controlsWrap = useAnimation()
    const controlsBar = useAnimation()
    const controlsBox = useAnimation()

    //states
    const [boxId, setboxId] = useState(0)
    const setBoxId = newId => {
        setboxId(newId)
        boxIdHandler(newId)
    }

    useEffect(() => {
        setBarPosition(currentBoxId * -width)
        setboxId(currentBoxId)
    }, [])

    useEffect(() => {
        scaleBoxNorm()
        setisScroll(false)
        setBarPosition(boxId * -width)
    }, [boxId])

    const [isScroll, setisScroll] = useState(false)
    const [isBarMove, setisBarMove] = useState(false)
    const [barPosition, setbarPosition] = useState(0)

    const setBarPosition = newPos => { 
        controlsBar.start({ x: newPos })
        setbarPosition(newPos)
    }

    const scaleBoxNorm  = () => controlsBox.start({ scale: 1, borderRadius: borderRadiusNorm })
    const scaleBoxHover = () => controlsBox.start({ scale: scaleHover,  borderRadius: borderRadiusClick })
    const scaleBoxClick = () => controlsBox.start({ 
        scale: scaleClick, 
        // borderRadius: borderRadiusClick,
        transition: { type: 'spring', stiffness: stiffnessClick,  mass: 0.1, }
    }) 



    const [showEditCount, setshowEditCount] = useState(0)
    useEffect(() => setshowEditCount(showEditCount+1), [isScroll])
    useEffect(() => setshowEditCount(0), [boxId])
    const [variant, setvariant] = useState('none');
    const handleChange = (event) => setvariant(event.target.value)
    const handleChange2 = (event) => setbgColor(event.target.value)
    useEffect(() => {
        let newStyle
        switch (variant) {
            case 'none': newStyle = 'none'
                break;
            case 'boxShadow 1': newStyle = '0 5px 10px -2px rgba(50, 50, 73, 0.5)'
                break;
            case 'boxShadow 2': newStyle = '0 62.5px 125px -25px rgba(50, 50, 73, 0.25), 0 37.5px 75px -37.5px rgba(0, 0, 0, 0.3)'
                break;
            case 'boxShadow 3': newStyle = '0 62.5px 125px -25px rgba(50, 50, 73, 0.5), 0 37.5px 75px -37.5px rgba(0, 0, 0, 0.6)'
                break;
        
            default:
                break;
        }
        setboxShadowww(newStyle)
    }, [variant])
    
    const getBgVariants = () => showEditCount > 4 ? <div style={{position: 'fixed', top: 100, left: 20,}}>
        <div style={{ display: 'flex', alignItems: 'center'}}>
            <select value={variant} onChange={handleChange}>
                <option value="none">none</option>
                <option value="boxShadow 1">boxShadow 1</option>
                <option value="boxShadow 2">boxShadow 2</option>
                <option value="boxShadow 3">boxShadow 3</option>
            </select>
            <input style={{margin: 10, padding: 0}} type='color' value={bgColor} onChange={handleChange2}/>
            <div style={{cursor: 'pointer'}} onClick={() => setshowEditCount(0)}>x</div>
        </div>
    </div> : <></>






    //gesture-trigger functions
    const panEndBar = (event, info) => {
        setTimeout(() => setisBarMove(false), 1)
        const offX = info.offset.x
        const hitTreshold = offX > treshold || offX < -treshold
        const moveNext = offX < 0
        const isFirst = boxId == 0
        const isLast = boxId == boxList.length-1
        const nextIsFirst = isLast && endless && moveNext
        const previousIsLast = isFirst && endless && !moveNext
        const newBarPos = nextIsFirst ? 0
                    : previousIsLast ? (boxList.length-1) * -width
                    : moveNext ? barPosition - width 
                    : barPosition + width
        const forbidden = !endless && !isScroll
                    && (isFirst && !moveNext) 
                    || (isLast && moveNext)

        if(!isScroll && hitTreshold && !forbidden){
            scaleBoxNorm()
            setBarPosition(newBarPos)
            setBoxId(
                nextIsFirst ? 0
                : previousIsLast ? boxList.length-1
                : moveNext ? boxId + 1 : boxId - 1
            )
            setisScroll(false)
        } else if(!isScroll) { 
            scaleBoxNorm()
            setBarPosition(barPosition)
            setBoxId(boxId)
            setisScroll(false)
        }
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
            ...backgroundWrapStyles,
        },
        bar: { 
            height: height,
            width: isScroll ? width * (boxList.length) : width * 3,  
            marginLeft: isScroll ? 0 : -width + (-barPosition), 
            justifyContent: isScroll ? 'center' 
                : boxId == 0 ? 'flex-end' 
                : boxId == boxList.length-1 ? 'flex-start' 
                : 'center',
                top: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
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
            overflow: 'hidden',
            // boxShadow: '0 62.5px 125px -25px rgba(50, 50, 73, 0.5), 0 37.5px 75px -37.5px rgba(0, 0, 0, 0.6)',
            touchAction: 'none',
            ...boxStyles
        }
    }
    
    //components (function which returns elements to not always render again...)
    const getBox = ({ val, index }) => 
        <div key={index} style={{ transition: '0.3s' }}>
            <div 
                style={{ 
                    zIndex: 2, 
                    height: '100%', 
                    width: '100%', 
                    position: 'absolute' 
                }} 
                onClick={() => { if(isScroll && !isBarMove) {
                    setBoxId(index) 
                    scaleBoxNorm()
                    setBarPosition(index * -width)
                    setisScroll(false)
                } else if(!isBarMove) { setisScroll(true); scaleBoxClick() }
            }}/>
            <motion.div 
                animate={controlsBox} 
                transition={{ duration: duration }}
                style={{...sty.box,
                    display: !isScroll 
                        && (index > boxId + 1 || index < boxId - 1) ? 'none' : 'block',
                    zIndex: index == boxId && 1,
                }}
                >{val}
            </motion.div>
        </div>

    return <> {getBgVariants()}
        <div 
            style={sty.backgroundWrap}
            animate={controlsWrap}
            transition={{ duration: duration }}
            >
            <motion.section 
                style={sty.bar}
                animate={controlsBar}
                transition={{ duration: duration }}
                dragDirectionLock
                drag='x'
                dragConstraints={{ 
                    left: isScroll ? -width * (boxList.length-1) : -width + -width * boxId, 
                    right: isScroll ? 0 : width + (-width * boxId),
                    top: 0, 
                    bottom: 0 
                }} 
                dragElastic={dragElastic}
                onPanStart={() => { 
                    setisBarMove(true); if(isScaleOnSwipe) scaleBoxClick()
                }}
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
