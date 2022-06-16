import React, { useState, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { dataState, isImprintState, isInfoState, isProjectInfoState, screenState } from '../lib/state'
import { INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Bracket from './svg/Bracket'
import ArrowRight from './svg/ArrowRight'
import styles from '../styles/InfoBox.module.css'

export default function InfoBox({ isProjectRoute }) {
    const imprintTopRef = useRef(null)
    const data = useRecoilValue(dataState)
    const isImprint = useRecoilValue(isImprintState)
    const isInfo = useRecoilValue(isInfoState)
    const isProjectInfo = useRecoilValue(isProjectInfoState)
    const screen = useRecoilValue(screenState)
    const [isGeneral, setisGeneral] = useState(true)
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
        if(imprintTopRef.current) imprintTopRef.current.scrollIntoView()
        setisGeneral(true)
        setisCV(false)
        setisAbout(false)
    }, [isInfo])
    
    const BracketCon = ({ turn }) => <div 
        style={{ 
            transform: !turn ? `rotate(180deg)` : `rotate(0deg)`,
            marginLeft: !turn && (screen < 2 ? 4 : screen < 3 ? 3 : 2.5),
            width: !turn && screen == 3 && 294
        }}
        className={`flexCenter ${styles.bracketCon} ${!isGeneral && styles.bracketConMargin}`}>
            <Bracket styles={styles}/> 
        {/* <Image src='/bracketTrans.png' layout='fill' objectFit='contain' /> */}
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
                            height: !isGeneral ? (screen == 3 ? 12 : 17) : 'fit-content', // no text crumble
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
    }
    return (
        <div style={{ opacity: isInfo ? 1 : 0, display: !isInfo && !isProjectInfo && 'none' }} 
            className={`${styles.pergament} ${isProjectRoute ? styles.pergamentProject : ''}`}
            >
            {isImprint ?
            <div>
                <div style={{ marginTop: -15}} ref={imprintTopRef}/>
                <div style={{ padding: '15px 15px 15px 15px', fontSize: screen == 3 ? 11.4 : 13 }} className={``}>
                    <span style={{ textDecoration: 'underline'}}>Imprint</span>
                    <br/><br/>
                    <span style={{ textDecoration: 'underline'}}>Credits:</span>
                    <br/><br/>
                    Design: 
                    {/* <a href="https://www.justusgelberg.com/" 
                        rel="noreferrer" 
                        target='_blank'
                        > */}
                            Justus Gelberg
                    {/* </a> */}
                    <br/>
                    Development: 
                    {/* <a href="https://synesthesigns.com/" 
                        rel="noreferrer" 
                        target='_blank'> */}
                        Frederik Schoof
                        {/* </a> */}
                        <br/><br/>

                    <span style={{ textDecoration: 'underline'}}>Contact:</span><br/><br/>

                    Verantwortlich für den Inhalt nach §55 Abs. 2 RStV:<br/>
                    Peter Pflügler, XY straße 18, XXXX Wien<br/>
                    +49 1749338269, peter.pfluegler@gmx.at, USt-IdNr. 55602381491, Finanzamt Wien
                    <br/><br/>
                    <span style={{ textDecoration: 'underline'}}>Copyright:</span><br/>
                    Unless otherwise indicated, all material on this website is copyrighted by Marina Hoppmann. All rights reserved. No part of this website, either text or image may be used for any purpose other than personal use. Reproduction, modification, storage in a retrieval system or retransmission, in any form or by any means, electronic, mechanical or otherwise, for reasons other than personal use, is strictly prohibited without prior written consent.
                    <br/><br/>
                    <span style={{ textDecoration: 'underline'}}>Haftungsausschluss:</span><br/>
                    § 1 Warnhinweis zu Inhalten Die kostenlosen und frei zugänglichen Inhalte dieser Webseite wurden mit größtmöglicher Sorgfalt erstellt. Der Anbieter dieser Webseite übernimmt jedoch keine Gewähr für die Richtigkeit und Aktualität der kostenlos und frei zugänglich bereitgestellten Inhalte. Namentlich gekennzeichnete Beiträge geben die Meinung des jeweiligen Autors und nicht immer die Meinung des Anbieters wieder. Allein durch den Aufruf der kostenlosen und frei zugänglichen Inhalte kommt keinerlei Vertragsverhältnis zwischen dem Nutzer und dem Anbieter zustande, insoweit fehlt es am Rechtsbindungswillen des Anbieters.
                    <br/><br/>
                    § 2 Externe Links Diese Website enthält Verknüpfungen zu Websites Dritter (“externe Links”). Diese Websites unterliegen der Haftung der jeweiligen Betreiber. Der Anbieter hat bei der erstmaligen Verknüpfung der externen Links die fremden Inhalte daraufhin überprüft, ob etwaige Rechtsverstöße bestehen. Zu dem Zeitpunkt waren keine Rechtsverstöße ersichtlich. Der Anbieter hat keinerlei Einfluss auf die aktuelle und zukünftige Gestaltung und auf die Inhalte der verknüpften Seiten. Das Setzen von externen Links bedeutet nicht, dass sich der Anbieter die hinter dem Verweis oder Link liegenden Inhalte zu Eigen macht. Eine ständige Kontrolle der externen Links ist für den Anbieter ohne konkrete Hinweise auf Rechtsverstöße nicht zumutbar. Bei Kenntnis von Rechtsverstößen werden jedoch derartige externe Links unverzüglich gelöscht.
                    <br/><br/>
                    § 3 Urheber- und Leistungsschutzrechte Die auf dieser Website veröffentlichten Inhalte unterliegen dem deutschen Urheber- und Leistungsschutzrecht. Jede vom deutschen Urheber- und Leistungsschutzrecht nicht zugelassene Verwertung bedarf der vorherigen schriftlichen Zustimmung des Anbieters oder jeweiligen Rechteinhabers. Dies gilt insbesondere für Vervielfältigung, Bearbeitung, Übersetzung, Einspeicherung, Verarbeitung bzw. Wiedergabe von Inhalten in Datenbanken oder anderen elektronischen Medien und Systemen. Inhalte und Rechte Dritter sind dabei als solche 
                </div>
            </div>
            :
            <>
                <BracketCon />
                    {getBlock({ id: 0, show: true, children: data.generalInfo })}
                    {getBlock({ id: 1, show: isGeneral, title: data.cvTitle, 
                        children: data.cv && documentToReactComponents(data.cv, richText_Options) 
                    })}
                    {getBlock({ id: 2, show: isGeneral, title: data.aboutTitle, 
                        children: data.cv && documentToReactComponents(data.about, richText_Options) 
                    })}
                <BracketCon turn={true}/>
            </>
            }
        </div>
    )
}
