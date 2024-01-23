import { FollowsCollection } from './../common/follow-model.js';

FollowsCollection.allow({
    insert:function (userId, follow) {
        return userId && follow.checkOwnership() && !follow.isDuplicate();
    },
    remove:function (userId, follow) {
        return userId && follow.checkOwnership();
    }
});

Meteor.publish('myfollows', function () {
    return FollowsColleciton.find({$or : [{userId: this.userId}, {followId: this.userId}]});
});