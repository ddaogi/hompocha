import React from "react";
import ChatComponent from "./Chat/ChatComponent";
import CamFour from "./cam/CamFour";
import EffectComponent from "./Chat/EffectComponent";

export default class ParentComponent extends React.Component {
    state = {
        sessionConnected: false,
        camFourStream: null
    }

    handleSessionConnected = (localUser) => {
        this.setState({ sessionConnected: true , camFourStream: localUser});
    }

    render() {
        return (
            <div>
                <CamFour onVideoLoad={this.handleSessionConnected} />
                {this.state.sessionConnected && <ChatComponent user={this.state.camFourStream}/> &&
                     <EffectComponent user={this.state.camFourStream}/>
                }
            </div>
        );
    }
}
