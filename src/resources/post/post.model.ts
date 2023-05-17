import {Schema, model} from 'mongoose';
import Post from '@/resources/post/post.interface';

const PostSchema = new Schema (
    {
        title: {
            required: true,
            type: String
        },
        body: {
            required: true,
            type: String
        }
    },
    {timestamps: true}
);

export default model<Post>('Post',PostSchema);
