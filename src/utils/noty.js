import Noty from 'noty'

export default (type, message, config = {}) => {
  new Noty({
    layout: 'topRight',
    theme: 'nest',
    text: message,
    type: type,
    timeout: 3000,
    ...config
  }).show()
}