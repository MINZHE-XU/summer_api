// app/models/datagroup.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DatagroupSchema   = new Schema({
    groupeddata: String
});

module.exports = mongoose.model('Datagroup', DatagroupSchema);
