import express from 'express';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// @desc    Get all videos
// @route   GET /api/videos
router.get('/', async (req, res) => {
    try {
        const { title, category } = req.query;
        let query = {};
        if (title) query.title = { $regex: title, $options: 'i' };
        if (category && category !== 'All') query.category = category;

        const videos = await Video.find(query).populate('uploader', 'username avatar').populate('channelId', 'channelName');
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get video by ID
// @route   GET /api/videos/:id
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate('uploader', 'username avatar')
            .populate('channelId', 'channelName subscribers');
        if (!video) return res.status(404).json({ message: 'Video not found' });
        
        // Increment views
        video.views += 1;
        await video.save();
        
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Upload a video
// @route   POST /api/videos
router.post('/', protect, async (req, res) => {
    const { title, description, videoUrl, thumbnailUrl, category, channelId } = req.body;
    try {
        const video = await Video.create({
            title, description, videoUrl, thumbnailUrl, category, channelId,
            uploader: req.user._id
        });
        
        // Add video to channel
        await Channel.findByIdAndUpdate(channelId, { $push: { videos: video._id } });
        
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a video
// @route   PUT /api/videos/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        
        if (video.uploader.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        const { title, description, category, thumbnailUrl } = req.body;
        video.title = title || video.title;
        video.description = description || video.description;
        video.category = category || video.category;
        video.thumbnailUrl = thumbnailUrl || video.thumbnailUrl;
        
        const updatedVideo = await video.save();
        res.json(updatedVideo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Like a video
// @route   POST /api/videos/:id/like
router.post('/:id/like', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        if (video.likes.includes(req.user._id)) {
            video.likes = video.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            video.likes.push(req.user._id);
            video.dislikes = video.dislikes.filter(id => id.toString() !== req.user._id.toString());
        }
        await video.save();
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Dislike a video
// @route   POST /api/videos/:id/dislike
router.post('/:id/dislike', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        if (video.dislikes.includes(req.user._id)) {
            video.dislikes = video.dislikes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            video.dislikes.push(req.user._id);
            video.likes = video.likes.filter(id => id.toString() !== req.user._id.toString());
        }
        await video.save();
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a video
// @route   DELETE /api/videos/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        
        if (video.uploader.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        await video.deleteOne();
        res.json({ message: 'Video removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
