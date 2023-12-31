import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
        parentId: String,
        children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
        isComment: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);

export default Thread;
