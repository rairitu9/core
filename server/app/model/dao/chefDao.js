/*
 Copyright [2016] [Relevance Lab]

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */


var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var logger = require('_pr/logger')(module);
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;
var chefNodeSchema = new Schema({
    chefServerId:{
        type:String,
        requires:true,
        trim:true
    },
    chefNodeName: {
        type:String,
        requires:true,
        trim:true
    },
    chefNodeIp: {
        type:String,
        requires:false,
        trim:true
    },
    chefNodeFqdn: {
        type:String,
        requires:false,
        trim:true
    },
    chefNodePlatform: {
        type:String,
        requires:false,
        trim:true
    },
    chefNodeUpTime: {
        type:String,
        requires:false,
        trim:true
    },
    chefNodeEnv:{
        type:String,
        required:false,
        trim:true
    },
    chefJsonClass:{
        type:String,
        required:false,
        trim:true
    },
    chefType:{
        type:String,
        required:false,
        trim:true
    },
    chefEnvironments:[String],
    createdOn:{
        type:Date,
        required:false,
        default:Date.now
    }
});
chefNodeSchema.plugin(mongoosePaginate);
var chefNodes = mongoose.model('chefNode', chefNodeSchema);

var chefDao = function() {
    this.createChefNode = function(chefNodeDetails, callback) {
        var chefNode = new chefNodes(chefNodeDetails);
        chefNode.save(function(err, data) {
            if (err) {
                logger.error(err);
                callback(err,null);
            }else{
                callback(null, data);
            }
        });
    };

    this.getChefNodeByChefName = function(chefName, callback) {
        chefNodes.find({chefName:chefName},function(err, chefData) {
            if (err) {
                logger.error(err);
                callback(err,null);
            }else{
                callback(null, chefData);
            }
        });
    };

    this.removeChefNodeByChefName = function(chefName, callback) {
        chefNodes.remove({chefName:chefName},function(err, chefData) {
            if (err) {
                logger.error(err);
                callback(err,null);
            }else{
                callback(null, chefData);
            }
        });
    };

    this.updateChefNode = function(chefId,chefNodeDetails, callback) {
        chefNodes.update({
            "_id": new ObjectId(chefId)
        }, {
            $set: {
                chefEnv:chefNodeDetails.chefEnv,
                chefJsonClass:chefNodeDetails.chefJsonClass,
                chefType:chefNodeDetails.chefType
            }
        }, {
            upsert: false
        },function(err, data) {
            if (err) {
                logger.error(err);
                callback(err,null);
            }else{
                callback(null, data);
            }
        });
    };

    this.getNodesByServerId = function(query,callback){
        chefNodes.paginate(query.queryObj, query.options,
            function(err, nodes) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, nodes);
                }
            });
    };

    this.getChefEnvByServerId = function(serverId,callback){
        chefNodes.findOne({chefServerId:serverId}, function(err, node) {
                if (err) {
                    return callback(err);
                } else if(node) {
                    return callback(null, node.chefEnvironments);
                } else{
                    return callback(null, []);
                }
            });
    }
}
module.exports = new chefDao();