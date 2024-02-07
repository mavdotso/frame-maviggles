import { FrameButton, FrameContainer, FrameImage, FrameInput, FrameReducer, NextServerPageProps, getPreviousFrame, useFramesReducer, getFrameMessage } from 'frames.js/next/server';
import Link from 'next/link';
import { DEBUG_HUB_OPTIONS } from './debug/constants';
import { generateImage } from './generate-image';
import drawMaviggle from './lib/maviggles';

type State = {
    active: string;
    total_button_presses: number;
};

const initialState = { active: '1', total_button_presses: 0 };

const reducer: FrameReducer<State> = (state, action) => {
    return {
        total_button_presses: state.total_button_presses + 1,
        active: action.postBody?.untrustedData.buttonIndex ? String(action.postBody?.untrustedData.buttonIndex) : '1',
    };
};

// This is a react server component only
export default async function Home({ params, searchParams }: NextServerPageProps) {
    const previousFrame = getPreviousFrame<State>(searchParams);

    const frameMessage = await getFrameMessage(previousFrame.postBody, {
        ...DEBUG_HUB_OPTIONS,
        fetchHubContext: true,
    });

    if (frameMessage && !frameMessage?.isValid) {
        throw new Error('Invalid frame payload');
    }

    const [state, dispatch] = useFramesReducer<State>(reducer, initialState, previousFrame);

    // Here: do a server side side effect either sync or async (using await), such as minting an NFT if you want.
    // example: load the users credentials & check they have an NFT

    // Example with satori and sharp:
    // const imageUrl = await generateImage(frameMessage);
    const imageUrl = drawMaviggle();

    console.log('info: state is:', state);

    if (frameMessage) {
        const { isValid, buttonIndex, inputText, castId, requesterFid, casterFollowsRequester, requesterFollowsCaster, likedCast, recastedCast, requesterVerifiedAddresses, requesterUserData } =
            frameMessage;

        console.log(frameMessage);
    }

    return (
        <FrameContainer postUrl="/frames" state={state} previousFrame={previousFrame}>
            <FrameImage src={imageUrl} />
            <FrameButton onClick={dispatch}>Generate maviggle</FrameButton>
        </FrameContainer>
    );
}
