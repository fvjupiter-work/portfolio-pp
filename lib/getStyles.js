export default function getStyles (stylesObj, classN, inlineStyles) {
    let classArr = classN.split(' ')
    const convertedStyles = {}
    classArr.forEach(c => Object.assign(convertedStyles, stylesObj[c]))
    Object.assign(convertedStyles, inlineStyles)
    return convertedStyles
  }
  