import React, { Component } from 'react';
import styles from './ChatComponent.module.css'
export default class ChatComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageList: [],
            message: '',
        };
        this.chatScroll = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handlePressKey = this.handlePressKey.bind(this);
        this.close = this.close.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    componentDidMount(){
        this.props.user.getStreamManager().stream.session.on('signal:chat',(event)=>{
            const data= JSON.parse(event.data);
            let messageList = this.state.messageList;
            messageList.push({connectionId: event.from.connectionId, message:data.message });
            const document = window.document;
            // setTimeout(() => {
            //     const userImg = document.getElementById('userImg-' + (this.state.messageList.length - 1));
            //     const video = document.getElementById('video-' + data.streamId);
            //     const avatar = userImg.getContext('2d');
            //     avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 60, 60);
            //     this.props.messageReceived();
            // }, 50);
            this.setState({ messageList: messageList});
            this.scrollToBottom();
        });
    }
    handleChange(event){
        this.setState({ message: event.target.value})
    }
    handlePressKey(event){
        if (event.key ==="Enter"){
            this.sendMessage();
        }
    }
    sendMessage(){
        console.log(this.state.message);
        if (this.props.user && this.state.message){
            let message = this.state.message.replace(/ + (?= )/g,'');
            if(message !== '' && message !== ' '){
                const data = { message: message, streamId: this.props.user.getStreamManager().stream.streamId};
                this.props.user.getStreamManager().stream.session.signal({
                    data: JSON.stringify(data),
                    type: 'chat',
                });
            }
            this.setState({message : ''});
        }
    }
    scrollToBottom() {
        setTimeout(() => {
            try {
                this.chatScroll.current.scrollTop = this.chatScroll.current.scrollHeight;
            } catch (err) {}
        }, 20);
    }
    close() {
        this.props.close(undefined);
    }
    render() {
        const styleChat = { display: this.props.chatDisplay };
        return (
            <div id="chatContainer" className={styles.container}>
                <div id="chatComponent" style={styleChat}>
                    <div id="chatToolbar">
                        <span>{this.props.user.getStreamManager().stream.session.sessionId} - CHAT</span>
                        <button id="closeButton" onClick={this.close}>
                        </button>
                    </div>
                    <div className="message-wrap" ref={this.chatScroll}>
                        {this.state.messageList.map((data, i) => (
                            <div
                                key={i}
                                id="remoteUsers"
                                className={
                                    'message' + (data.connectionId !== this.props.user.getConnectionId() ? ' left' : ' right')
                                }
                            >
                                {/*<canvas id={'userImg-' + i} width="60" height="60" className="user-img" />*/}
                                <div className="msg-detail">
                                    <div className="msg-info">
                                    </div>
                                    <div className="msg-content">
                                        <span className="triangle" />
                                        <p className="text">{data.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div id="messageInput">
                        <input
                            placeholder="Send a messge"
                            id="chatInput"
                            value={this.state.message}
                            onChange={this.handleChange}
                            onKeyPress={this.handlePressKey}
                        />
                        <button id="sendButton" onClick={this.sendMessage}>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
