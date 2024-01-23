import { BaseModel } from 'meteor/socialize:base-model';
import { Meteor } from'meteor/meteor';
import { Mongo } from'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { User } from 'meteor/socialize:user-model';




    /**
    * The Follow Class
    * @class Follow
    * @extends User
    * @param {Object} document An object representing a Follow usually a Mongo document
    */
    export class Follow extends User {

        /**
        * Get the user being followed
        * @method getFollowedUser
        * @returns {Object} The user being followed
        */
        getFollowedUser() {
            if(this.followId){
                return  Meteor.users.findOne(this.followId);
            }
        }

        /**
        * Check if the follow relationship is a duplicate
        * @method isFollowDuplicate
        * @returns {boolean} True if the follow relationship is a duplicate, false otherwise
        */
        isFollowDuplicate() {
            return !!FollowsCollection.findOne({userId:this.userId, followId:this.followId});
        }

        /**
        * Create a new follow relationship
        * @method follow
        * @throws {Error} If the follow relationship is a duplicate
        */
        follow() {
            if (this.isFollowDuplicate()) {
                throw new Error('Duplicate follow relationship');
            }

            FollowsCollection.insert({ userId: this.userId, followId: this.followId });
        }
    }

    export const FollowsCollection = new Mongo.Collection('socialize:follows');

    Follow.attachCollection(FollowsCollection);
    /**
    * Get the User instance for the follow
    * @function user
    * @memberof Follow
    */
    Follow.prototype.user = function () {
        if(this.followId){
            return  Meteor.users.findOne(this.followId);
        }
    };

    /**
    * Check if the user already follows the user
    * @memberof Follow
    * @returns {Boolean} Returns if the follow already exists
    */
    Follow.prototype.isDuplicate = function () {
        return !!FollowsCollection.findOne({userId:this.userId, followId:this.followId});
    };


    //Create the schema for a follow
    Follow.appendSchema({
        userId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
            autoValue: function () {
                if(this.isInsert){
                    if(!this.isSet && this.isFromTrustedCode){
                        return Meteor.userId();
                    }
                }
            },
            index: 1,
            denyUpdate:true
        },
        followId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
            index: 1
        },
        createdAt: {
            type:Date,
            autoValue: function() {
                if(this.isInsert){
                    return new Date();
                }
            },
            denyUpdate: true
        }
    });

    FollowsCollection.allow({
        insert:function (userId, follow) {
            return userId && follow.checkOwnership() && !follow.isDuplicate();
        },
        remove:function (userId, follow) {
            return userId && follow.checkOwnership();
        }
    });