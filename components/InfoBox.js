import React, { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { dataState, isInfoState, isProjectInfoState } from '../lib/state'
import Image from 'next/image'
import { INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
// import Bracket from './svg/Bracket'
import ArrowRight from './svg/ArrowRight'
import styles from '../styles/InfoBox.module.scss'

export default function InfoBox({ isProjectRoute }) {
    const data = useRecoilValue(dataState)
    const isInfo = useRecoilValue(isInfoState)
    const isProjectInfo = useRecoilValue(isProjectInfoState)
    const [isGeneral, setisGeneral] = useState(false)
    const [isCV, setisCV] = useState(false)
    const [isAbout, setisAbout] = useState(false)
    const toggle = (id) => {
        switch (id) {
            case 0: 
                setisGeneral(!isGeneral)
                setisCV(false)
                setisAbout(false)
                break
            case 1: setisCV(!isCV); break
            case 2: setisAbout(!isAbout); break
            default: break
        }
    }
    useEffect(() => {
        setisGeneral(false)
        setisCV(false)
        setisAbout(false)
    }, [isInfo])
    
    const BracketCon = ({ turn }) => <div 
        style={{ transform: turn ? `rotate(180deg)` : `rotate(0deg)` }}
        className={`flexCenter ${styles.bracketCon} ${!isGeneral && styles.bracketConMargin}`}>
            {/* <Bracket styles={styles}/> */}
        <Image src='/bracketTrans.png' layout='fill' objectFit='contain' />
    </div>

    const getBlock = ({ id, show, title, children }) => {
        let isOpen = id == 0 ? isGeneral : id == 1 ? isCV : isAbout
        return <>
            {show ?
                <div style={{ display: !isGeneral ? 'flex' : 'block' }} 
                    className={`transit ${styles.contentBox} ${!isGeneral ? styles.contentBoxVar : ''}`}>
                    <div className={`${isOpen ? styles.arrowBoxWrapOpen 
                        : isGeneral ? styles.arrowBoxWrapGeneral 
                        : styles.arrowBoxWrap} transit`}
                        >
                        <div style={{ transform: isOpen ? 'rotateY(180deg)' : 'rotateY(0deg)' }} 
                            className={`flexCenter transit ${styles.arrowBox}`} 
                            onClick={() => toggle(id)}>
                                <ArrowRight isClicked={isOpen}/>
                        </div>
                    </div>
                    {title ? 
                        <div 
                            style={id == 2 && !isOpen ? { marginBottom: 0 } : {}} 
                            className={`font ${styles.title}`}>
                                {title}
                        </div> 
                    : null}
                    <div style={{ 
                            marginTop: isGeneral && id == 0 ? 15 : 0,
                            marginBottom: !isGeneral || id == 2 ? 0 : 18, 
                            paddingLeft: !isGeneral ? 3 : 0,
                            height: !isGeneral ? 17 : 'fit-content', // no text crumble
                            overflow: 'hidden',
                        }} 
                        className={`
                            font 
                            ${id == 2 ? styles.aboutDiv : ''} 
                            ${isGeneral ? styles.desIsGeneral : ''}
                        `}
                        >
                        {id == 0 || isOpen ? children : null}
                    </div>
                </div>
            : null}
        </>
    }

    // OPTIONS FOR RICHTEXT RENDERER
    const richText_Options = {
        // renderMark: {
        //     [MARKS.BOLD]: text => <>{text}</>,
        // },
        renderNode: {
            [INLINES.HYPERLINK]: (node, children) => <a target='_blank' rel="noreferrer" href={node.data.uri}>{children}</a>,
        },
        // renderText: text => text.replace('!', '?'),
    };
    return (
        <div style={{ opacity: isInfo ? 1 : 0, display: !isInfo && !isProjectInfo && 'none' }} 
            className={`${styles.pergament} ${isProjectRoute ? styles.pergamentProject : ''}`}>
            <BracketCon />
            {getBlock({ id: 0, show: true, children: data.generalInfo })}
            {getBlock({ id: 1, show: isGeneral, title: data.cvTitle, 
                children: data.cv && documentToReactComponents(data.cv, richText_Options) 
            })}
            {getBlock({ id: 2, show: isGeneral, title: data.aboutTitle, 
                children: data.cv && documentToReactComponents(data.about, richText_Options) 
            })}
            <BracketCon turn={true}/>
        </div>
    )
}
