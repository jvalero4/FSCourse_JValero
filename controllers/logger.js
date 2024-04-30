const infoMessage = (...params) => {
    console.log(...params)
  }
  
  const errorMessage = (...params) => {
    console.error(...params)
  }
  
  module.exports = {
    infoMessage, errorMessage
  }