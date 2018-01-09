'use strict';

var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var LabelSchema = new Schema({
  label_vendor:{
    type: String,
    required: 'A value must be provided for label_vendor',
    maxlength: [ 3, 'The value {VALUE} exceeds the allowed length {MAXLENGTH}' ],
    minlength: [ 3, 'The value {VALUE} exceeds the allowed length {MINLENGTH}' ]
  },
  created_date:{
    type: Date,
    default: Date.now
  },
  label_track:{
    type: String,
    required: 'Provide the track number of the label that was created',
    index: { unique: true, sparse: true }
  },
  public_id:{
    type: String,
    required: 'Provide the IBC ID of the owner of the label'
  },
  ip_address:{
    type: String,
    required: 'Provide the IP address of the request'
  },
  label_service:{
    type: String,
    required: 'Provide the service requested'
  },
  label_station:{
    type: String,
    required: 'Provide the station that is requesting the label'
  }
});

module.exports = mongoose.model( 'LabelModel', LabelSchema );
