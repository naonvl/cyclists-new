const generateTag = () => {
  const randomNumber = Math.floor(Math.random() * 99999999999)
  return `JERSEY-DESIGNER-${randomNumber}`
}

export default generateTag
