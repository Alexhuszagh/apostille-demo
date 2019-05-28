import * as crypto from 'crypto-js'
import { Post } from 'core/domain/posts'

const Utf8Decode = (text: string) =>
    crypto.enc.Utf8.parse(text)

const Utf8DecodeJSON = (data: object) =>
    Utf8Decode(JSON.stringify(data))

const Base64Encode = (bytes: string) =>
    crypto.enc.Base64.stringify(bytes)

const ExtractText = (post: Post) =>
    Base64Encode(Utf8Decode(post.body || ''))

const ExtractImage = (post: Post) =>
    (post.image ? [post.image] : [])

const ExtractVideo = (post: Post) =>
    (post.video ? [post.video] : [])

const ExtractMultimedia = (post: Post) =>
    ExtractImage(post).concat(ExtractVideo(post))

export const ExtractPost = (post: Post) =>
    Utf8DecodeJSON({
        data: ExtractText(post),
        multimedia: ExtractMultimedia(post),
    })
