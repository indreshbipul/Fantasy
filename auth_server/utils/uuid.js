const uuid = require('uuid')

function uuidGenerate(){
    const id = uuid.v4()
    return id
}

module.exports = uuidGenerate