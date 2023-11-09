import { useRef } from "react";
import Plyr, { APITypes } from "plyr-react";
import "plyr-react/plyr.css";


const VideoPlayer = ({ id }) => {
    const ref = useRef<APITypes>(null);

    const videoId = id;
    const provider = "youtube";
    const videoOptions = undefined;

    const plyrVideo = videoId && provider ? (
        <Plyr
            ref={ref}
            source={{ type: "video", sources: [{ src: videoId, provider: provider }] }}
            options={videoOptions}
        />
    ) : null;

    return ( <div> {plyrVideo} </div>)
};

export default VideoPlayer;
