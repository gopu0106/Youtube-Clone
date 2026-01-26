import express from 'express';
import Channel from '../models/Channel.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// @desc    Create a new channel
// @route   POST /api/channels
router.post('/', protect, async (req, res) => {
    const { channelName, description, channelBanner } = req.body;
    try {
        const channel = await Channel.create({
            channelName,
            description,
            channelBanner,
            owner: req.user._id
        });
        res.status(201).json(channel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Fetch channel by ID
// @route   GET /api/channels/:id
router.get('/:id', async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id).populate('owner', 'username avatar');
        if (!channel) return res.status(404).json({ message: 'Channel not found' });
        res.json(channel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
