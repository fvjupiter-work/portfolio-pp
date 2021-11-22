import React from 'react'
import { motion } from 'framer-motion';

export default function Fade({ classN, delay, duratio, scale, children }) {
    return(
      <motion.div className={classN} initial="hidden" animate="visible" variants={{
          hidden: {
            opacity: 0,
            scale: scale ? scale[0] : 1,
          },
          visible: {
            opacity: 1,
            scale: scale ? scale[1] : 1,
            transition: {
              delay: delay,
              duration: duratio,
            }
          },
        }}>{children}
      </motion.div>
    )
  }
