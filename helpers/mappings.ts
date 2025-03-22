import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { JellifyTrack } from "../types/JellifyTrack";
import { RatingType, TrackType } from "react-native-track-player";
import { QueuingType } from "../enums/queuing-type";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import Client from "../api/client";
import { isUndefined } from "lodash";

/**
 * The container that the Jellyfin server will attempt to transcode to
 * 
 * This is set to `ts` (MPEG-TS), as that is what HLS relies upon
 * 
 * Finamp and Jellyfin Web also have this set to `ts`
 * @see https://jmshrv.com/posts/jellyfin-api/#playback-in-the-case-of-music
 */
const transcodingContainer = "ts";

/**
 * A mapper function that can be used to get a RNTP `Track` compliant object
 * from a Jellyfin server `BaseItemDto`. Applies a queuing type to the track
 * object so that it can be referenced later on for determining where to place
 * the track in the queue
 * 
 * @param item The `BaseItemDto` of the track
 * @param queuingType The type of queuing we are performing
 * @returns A `JellifyTrack`, which represents a Jellyfin library track queued in the player
 */
export function mapDtoToTrack(item: BaseItemDto, queuingType?: QueuingType) : JellifyTrack {
    const urlParams = {
        "Container": item.Container!,
        "TranscodingContainer": transcodingContainer,
        "TranscodingProtocol": TrackType.HLS,
        "EnableRemoteMedia": "true",
        "EnableRedirection": "true",
        "api_key": Client.api!.accessToken,
        "StartTimeTicks": "0",
        "PlaySessionId": Client.sessionId,
    }

    const isFavorite = !isUndefined(item.UserData) && (item.UserData.IsFavorite ?? false);

    return {
        url: `${Client.api!.basePath}/Audio/${item.Id!}/universal?${new URLSearchParams(urlParams)}`,
        type: TrackType.HLS,
        headers: {
            "X-Emby-Token": Client.api!.accessToken
        },
        title: item.Name,
        album: item.Album,
        artist: item.Artists?.join(", "),
        duration: item.RunTimeTicks,
        artwork: item.AlbumId ? getImageApi(Client.api!).getItemImageUrlById(item.AlbumId, ImageType.Primary, { width: 300, height: 300 }) : undefined,

        rating: isFavorite ? RatingType.Heart : undefined,
        item,
        QueuingType: queuingType ?? QueuingType.DirectlyQueued
    } as JellifyTrack
}