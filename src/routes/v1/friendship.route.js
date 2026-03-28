import express from 'express';
import {
    acceptFriendRequestController,
    deleteFriendRequestController,
    getallincomingPendingRequestController,
    getallsentPendingRequestController,
    getAllUserFriendsController,
    getFriendDetailByfriendshipIdController,
    getFriendRequestController,
    sendFriendRequestController
} from '../../controllers/friendship.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/send', isAuthenticated, sendFriendRequestController);
router.patch(
    '/accept/:friendRequestId',
    isAuthenticated,
    acceptFriendRequestController
);
router.delete(
    '/decline/:friendRequestId',
    isAuthenticated,
    deleteFriendRequestController
);
router.get(
    '/:friendshipId/friend-detail',
    isAuthenticated,
    getFriendDetailByfriendshipIdController
);
router.get(
    '/friend/:friendshipRequestId',
    isAuthenticated,
    getFriendRequestController
);
router.get(
    '/sent-pending',
    isAuthenticated,
    getallsentPendingRequestController
);
router.get(
    '/incoming-pending',
    isAuthenticated,
    getallincomingPendingRequestController
);
router.get('/friends', isAuthenticated, getAllUserFriendsController);

export default router;
