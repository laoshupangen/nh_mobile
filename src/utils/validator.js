import schema from 'async-validator'
import _ from 'lodash'

export default (model) => {
  return new Promise((resolve, reject) => {
    let descriptor = _.reduce(model, (result, value, key) => {
      ( result.value || (result.value = {}) )[key] = value.value;
      ( result.schema || (result.schema = {}) )[key] = value.rules;
      return result
    }, {})
    let validator = new schema(descriptor.schema)
    validator.validate(descriptor.value, { first: true }, (errors, fields) => {
      if (errors) {
        reject({
          code: 'FIELDS_ERROR',
          message: errors[0].message
        })
        return
      }
      _.forEach(model, (item, i) => {
        if (item.transform) {
          descriptor.value[i] = item.transform(descriptor.value[i])
        }
      })
      console.log(descriptor.value)
      resolve(descriptor.value)
    })
  })
}