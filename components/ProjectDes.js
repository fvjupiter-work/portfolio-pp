import React from 'react'
import { useRecoilValue } from 'recoil'
import { projectPicIdState, isProjectInfoState, isInfoState, projectInfoState, screenState } from '../lib/state'
import getStyles from '../lib/getStyles'
import { INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import styles from '../styles/ProjectDes.module.css'

export default function ProjectDes({ show }) {
    const { title, description, images } = useRecoilValue(projectInfoState)
    const isProjectInfo = useRecoilValue(isProjectInfoState)
    const projectPicId = useRecoilValue(projectPicIdState)
    const isInfo = useRecoilValue(isInfoState)
    const screen = useRecoilValue(screenState)
    const sty = {
        des: {
            opacity: isProjectInfo ? 1 : 0,
            display: !isProjectInfo && !isInfo && 'none',
            zIndex: isInfo ? -5 : 0
        }
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
    return <div style={{ 
                    height: !isProjectInfo && (screen < 3 ? 36 : 28.8),
                    marginTop: screen == 3 && (isProjectInfo ? 1 : 3)
                }} 
                className={`${styles.projectDesCon} ${!isInfo ? styles.projectDesConNoInfo : ''}`}>
        <div style={{ zIndex: isInfo ? -5 : 0 }} 
            className={`${styles.smallTitleBox} ${show ? styles.smallTitleBoxProject : ''}`}
            >
            <div className={`font ${styles.smallScreenTitle}`}>{title}</div> 
            <div style={{ opacity: isProjectInfo || isInfo ? 0 : 1 }}
                className='font transitLong'
                >
                    {images ? `${projectPicId+1}/${images.length}` : null}
            </div>
        </div>
        <div style={getStyles(sty, 'des')}  className={`font transitLong ${styles.des}`}>
            {description ? documentToReactComponents(description, richText_Options) : null}
        </div>
    </div>
}
