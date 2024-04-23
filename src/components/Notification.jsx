const Notification = ({ message }) => {
  if (message.text === null) {
    return null
  }

  return (
    <div className={message.isError ? 'errorMessage' : 'infoMessage'}>
      {message.text}
    </div>
  )
}

export default Notification