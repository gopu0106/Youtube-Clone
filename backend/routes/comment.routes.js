import express from 'express';
import Comment from '../models/Comment.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// @desc    Get comments for a video
// @route   GET /api/comments/:videoId
router.get('/:videoId', async (req, res) => {
    try {
        const comments = await Comment.find({ videoId: req.params.videoId })
            .populate('userId', 'username avatar')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add a comment
// @route   POST /api/comments
router.post('/', protect, async (req, res) => {
    const { videoId, text } = req.body;
    try {
        const comment = await Comment.create({
            videoId,
            text,
            userId: req.user._id
        });
        const populatedComment = await comment.populate('userId', 'username avatar');
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a comment
// @route   PUT /api/comments/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        
        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        comment.text = req.body.text || comment.text;
        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });
        
        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        await comment.deleteOne();
        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
