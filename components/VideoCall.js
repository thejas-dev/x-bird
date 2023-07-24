import {ImPhoneHangUp} from 'react-icons/im';
import {useState,useEffect} from 'react';
import {MdOutlineCameraswitch} from 'react-icons/md'
import {BsMic,BsMicMute,BsCameraVideo,BsCameraVideoOff} from 'react-icons/bs';
import {useRecoilState} from 'recoil';
import {currentPeerState,currentUserState,alertTheUserForIncomingCallState,
	acceptedState,remotePeerIdState,currentRoomIdState,callerIdState} from '../atoms/userAtom';
import { useId } from "react";
import {socket} from '../service/socket'
import { v4 as uuidv4 } from 'uuid';
import {useSound} from 'use-sound';

let myPeer;
let myStream;
let peers = {};
let currentCall;

export default function VideoCall({currentWindow,setCurrentWindow,
	callNow,setCallNow,currentCaller,setCurrentCaller
}) {
	const [micAllowed,setMicAllowed] = useState(true)
	const [videoAllowed,setVideoAllowed] = useState(true);
	const [mediaStream,setMediaStream] = useState('');
	const [currentPeerId,setCurrentPeerId] = useRecoilState(currentPeerState)
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState)
	const [currentRoomId,setCurrentRoomId] = useRecoilState(currentRoomIdState);
	const [stopRing,setStopRing] = useState('');
	const [newUserAlert,setNewUserAlert] = useState('');
	const [showNewUserAlert,setShowNewUserAlert] = useState(false);
	const [accepted,setAccepted] = useRecoilState(acceptedState);	
	const [acceptedCall,setAcceptedCall] = useState(false);
	const [remotePeerId, setRemotePeerId] = useRecoilState(remotePeerIdState);
	const [userLeftAlert,setUserLeftAlert] = useState('');
	const [showUserLeftAlert,setShowUserLeftAlert] = useState(false);
	const [currentFacingMode,setCurrentFacingMode] = useState('user');
	const [hideOptions,setHideOptions] = useState(false);
	const [callerId,setCallerId] = useRecoilState(callerIdState);
	const [play, { stop }] = useSound('dialer.mp3',{
	  loop:true
	});

	// const [myStream,setMyStream] = useState(undefined);

	const [alertTheUserForIncomingCall,setAlertTheUserForIncomingCall] = useRecoilState(alertTheUserForIncomingCallState)


	const updateMic = async() => {
		if(myStream){
			if(micAllowed){
				myStream.getAudioTracks()[0].enabled = false
				setMicAllowed(false)
			}else{
				myStream.getAudioTracks()[0].enabled = true;			
				setMicAllowed(true)			
			}			
		}
	}

	const updateVideo = async() => {
		if(myStream){
			if(videoAllowed){
				myStream.getVideoTracks()[0].enabled = false;
				setVideoAllowed(false)
			}else{
				myStream.getVideoTracks()[0].enabled = true;			
				setVideoAllowed(true)			
			}			
		}
	}

	async function switchCamera() {

	  const videoTrack = myStream.getVideoTracks()[0];
	  if(videoTrack.getSettings().facingMode === 'user'){
	  	

		navigator.getUserMedia({
		  audio: true,
		  video: {
		    facingMode: { exact: "environment" },
		  },
		},function(stream){
			if(currentCall){
				currentCall.peerConnection.getSenders().forEach((sender) => {
			    if(sender.track.kind === "audio" && stream.getAudioTracks().length > 0){
			        sender.replaceTrack(stream.getAudioTracks()[0]);
			    }
			    if (sender.track.kind === "video" && stream.getVideoTracks().length > 0) {
			        sender.replaceTrack(stream.getVideoTracks()[0]);
			      }
			    });				
			}
		    let tracks = myStream.getTracks();
			tracks.forEach(function(track) {
			   track.stop()
			});
		    myStream = stream;
		    if(acceptedCall){
		    	setLocalStreamToMiniVideo(stream)		    
		    }else{
		    	document.getElementById('videoMainStream').srcObject = myStream
		    }
		});

	  }else{
	  	

		navigator.getUserMedia({audio: true, video: { 
			facingMode: "user" 
		}},async function(stream) {
			if(currentCall){
				currentCall.peerConnection.getSenders().forEach((sender) => {
			    if(sender.track.kind === "audio" && stream.getAudioTracks().length > 0){
			        sender.replaceTrack(stream.getAudioTracks()[0]);
			    }
			    if (sender.track.kind === "video" && stream.getVideoTracks().length > 0) {
			        sender.replaceTrack(stream.getVideoTracks()[0]);
			      }
			    });				
			}
		    let tracks = myStream.getTracks();
			tracks.forEach(function(track) {
			   track.stop()
			});
		    myStream = stream;
		    if(acceptedCall){
		    	setLocalStreamToMiniVideo(stream)		    
		    }else{
		    	document.getElementById('videoMainStream').srcObject = myStream
		    }
		})

	  }

	}


	

 // useEffect(() => {
 //     const enableVideoStream = async () => {
 //         try {
 //             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
 //             setMediaStream(stream);
 //             setVideoToLocalStream()
 //             // alert('obtained')
 //         } catch (error) {
 //             console.error('Error accessing webcam', error);
 //             // alert('not obtained')

 //         }
 //     };
 //     if(callerId){
 //     	enableVideoStream();
 //     }
 // }, []);

	useEffect(()=>{
		if(callerId){
			setVideoToLocalStream();
			play()
			var video = document.getElementById('videoMainStream');
			video.setAttribute("name", callerId);
		}
	},[callerId])

	// useEffect(()=>{console.log(peers)},[peers])
	

	useEffect(()=>{
		socket.on('new-user',({user,peerId})=>{
			setNewUserAlert(user)
			setShowNewUserAlert(true);
			stop();
			setTimeout(()=>{
				setShowNewUserAlert(false)
			},4000)	
		});
		socket.on('incoming-call',({peerId,roomId,user})=>{
			const data = {
				roomId,user,peerId
			}
			setAlertTheUserForIncomingCall(data)
		})
		socket.on('stop-ring',({id})=>{
			setStopRing(id)
		})
		socket.on('user-disconnected',({id})=>{
			// alert(id);
			if(peers[id]){
				peers[id].close()
			};
			setVideoToLocalStream();			
			setAcceptedCall(false);
		})
		socket.on('user-left',({userId})=>{
			if(document.getElementsByName(userId)[0]){
				// alert(userId)
				setVideoToLocalStream();
				setAcceptedCall(false);
			}
		})

		return ()=>{
			socket.off('new-user');
			socket.off('incoming-call')
			socket.off('stop-ring')
			socket.off('user-disconnected');
			socket.off('user-left');
		}
	},[])

	useEffect(()=>{
		if(stopRing){
			const id = stopRing;
			setStopRing('');
			stopTheRingFun(id);
		}
	},[stopRing])

	const stopTheRingFun = async(id) => {

		if(alertTheUserForIncomingCall?.roomId  === id){
			setAlertTheUserForIncomingCall('');			
		}

	}

	const connectToCall = async() => {
		if(callerId && !accepted){
			const roomId = await uuidv4()
			setCurrentRoomId(roomId)
			socket.emit('add-user-to-room',{
				roomId,
				userId:currentUser._id
			})
			const tempUser = {
				id:currentUser._id,
				name:currentUser.name,
				username:currentUser.username,
				image:currentUser.image
			}
			socket.emit('call-to-user',{
				callerId:callerId,
				user:tempUser,
				roomId,
				peerId:currentPeerId
			})			
			
		}
	}


	const stopCall = async() => {
		let currRoomId = currentRoomId; 
		socket.emit('user-left',{roomId:currRoomId,userId:currentUser._id});
		var video = document.getElementById('miniStream');
		var video2 = document.getElementById('videoMainStream');
		stop()
		video.src = "";
		video.muted = true;
		video2.muted = true;
		video2.src = "";

		let tracks = myStream?.getTracks();
		tracks.forEach(function(track) {
		   track.stop()
		});

		if(peers[remotePeerId]){
			peers[remotePeerId].close();
		}
		if(acceptedCall){
			setAcceptedCall(false);			
		}
		if(accepted){
			setAccepted(false);
		}

		let currCallerId = callerId;
		setCallerId('');
		setCurrentCaller('');
		setRemotePeerId('');
		setCurrentRoomId('');
		socket.emit('stop-ring',{callerId:currCallerId, roomId:currRoomId})
	}

	const setVideoToLocalStream = async() => {
	    var errorCallback = function(e) {
	    	console.log('Reeeejected!', e);
	    };

	    var video = document.getElementById('videoMainStream');
	    video.muted = true
	    if (navigator.getUserMedia) {
		    navigator.getUserMedia({audio: true, video: { 
    			facingMode: "user" 
    		}}, function(stream) {
		    if(myStream?.getTracks()){
			    let tracks = myStream.getTracks();
				tracks.forEach(function(track) {
				   track.stop()
				});
			    myStream = stream
		    	video.srcObject = myStream;
				connectToCall();
		    }else{
		    	myStream = stream
		    	video.srcObject = myStream;
				connectToCall();
		    }
	    }, errorCallback);

	    video.onloadedmetadata = function(e) {
	        video.play()
	    };

		}
	}

	const setLocalStreamToMiniVideo = async(stream) => {
		// var errorCallback = function(e) {
	    // 	console.log('Reeeejected!', e);
	    // };

	    var video = document.getElementById('miniStream');
	    video.muted = true
	    video.srcObject = stream;
	    video.onloadedmetadata = function(e) {
	        video.play()
	    };

	    // if (navigator.getUserMedia) {
		//     navigator.getUserMedia({audio: true, video: { 
    	// 		facingMode: "user" 
    	// 	}}, function(stream) {
		//     video.srcObject = stream;
		//     myStream = stream

	    // }, errorCallback);

	    

		// }
	}

	const addStreamToMain = (stream) => {
		stop()
		setAcceptedCall(true);
		var video = document.getElementById('videoMainStream');
		video.muted = false;
		video.srcObject = stream;
		video.onloadedmetadata = function (e) {
			video.play()
		}
	}

	const acceptAndSendStream = async(id) => {
		var errorCallback = function(e) {
	    	console.log('Reeeejected!', e);
	    };
	    // console.log(id)

		if(navigator.getUserMedia){
			navigator.getUserMedia({audio: true, video: { 
    			facingMode: "user" 
    		}},async function(stream) {
    			let tracks = await myStream.getTracks();
				await tracks.forEach(function(track) {
				   track.stop()
				});
    			myStream = stream
				const call = myPeer.call(id, myStream);
				peers[id] = call;
				currentCall = call
				call.on('stream',userVideoStream => {
					// console.log(userVideoStream);
					addStreamToMain(userVideoStream);
					setLocalStreamToMiniVideo(myStream);
				})	    
				call.on('close',()=>{
					call.close();
					let tracks = stream.getTracks();
					tracks.forEach(function(track) {
					   track.stop();
					});
					// setVideoToLocalStream();
					setAccepted(false);
				})

	    	}, errorCallback);
		}
		

	}	

	useEffect(()=>{
		if(remotePeerId){
			acceptAndSendStream(remotePeerId);
			
		}
	},[remotePeerId])

	// useEffect(()=>{alert('myStream changed')},[myStream])


	useEffect(() => {
		import("peerjs").then(({ default: Peer }) => {
			// normal synchronous code
			let callId;
			const peer = new Peer();
			peer.on('open', id => {
				callId = id;
				setCurrentPeerId(id)
			})
			myPeer = peer

			myPeer.on('call',call=>{
				var errorCallback = function(e) {
			    	console.log('Reeeejected!', e);
			    };

				if(navigator.getUserMedia){
					navigator.getUserMedia({audio:true,video:{
						facingMode:'user'
					}},async function(stream){
						let tracks = await myStream.getTracks();
						await tracks.forEach(function(track) {
						   track.stop()
						});
						myStream = stream;
						call.answer(myStream);
						currentCall = call

						call.on('stream',userVideoStream=>{
							setLocalStreamToMiniVideo(myStream);
							addStreamToMain(userVideoStream)
						})

						call.on('close',()=>{
							call.close();
							let tracks = myStream.getTracks();
							tracks.forEach(function(track) {
							   track.stop()
							});
							// setVideoToLocalStream();			
							setAcceptedCall(false);
						})

					},errorCallback)
				}
			})
		})
	}, [])

	return(
		<div className={`fixed left-0 ${callerId ? 'bottom-0' : '-bottom-[100%]'} flex items-center justify-center
		h-full w-full z-50 bg-black/80 backdrop-blur-sm transition-all duration-200 ease-in-out`}>
			<div className="h-full relative w-full flex md:pt-8 justify-center">
				<div className={`absolute top-2 ${showNewUserAlert ? 'left-2' : '-left-[100%]'} bg-black/70 px-2 py-2
				text-white backdrop-blur-sm flex items-center gap-3 rounded-lg transition-all duration-200 ease-in-out`}>
					<img src={newUserAlert?.image} alt="" className="h-6 w-6 rounded-full" /> {newUserAlert?.name} joined
				</div>

				<div className={`absolute top-2 ${showUserLeftAlert ? 'left-2' : '-left-[100%]'} bg-black/70 px-2 py-2
				text-white backdrop-blur-sm flex items-center gap-3 rounded-lg transition-all duration-200 ease-in-out`}>
					<img src={userLeftAlert?.image} alt="" className="h-6 w-6 rounded-full" /> {userLeftAlert?.name} joined
				</div>

				<div className="sm:h-[85%] h-full  rounded-2xl md:aspect-[16/9] mx-auto aspect-[9/16]">
					<video id="videoMainStream" 
					onClick={()=>setHideOptions(!hideOptions)}
					className="min-h-full min-w-full object-cover" src=""></video>
				</div>
				<div className={`absolute overflow-hidden flex items-center justify-center md:aspect-[16/9] h-[150px] 
				bg-gray-800/50 backdrop-blur-sm right-3 md:right-8 rounded-xl ${hideOptions ? 'bottom-10' : 'bottom-14'}  
				aspect-[9/16] transition-all duration-300 ease-in-out`}>
					<video id="miniStream" 
					onClick={()=>setHideOptions(!hideOptions)}					
					className={`min-h-full ${acceptedCall ? 'block' : 'hidden'} min-w-full object-cover`} src=""></video>					
					<div className={`w-[50%] md:w-[30%] ${acceptedCall ? 'hidden' : 'block'} aspect-square rounded-full`}>
						<img src={currentCaller?.image} alt="" className="animate-pulse rounded-full h-full w-full"/>						
					</div>
				</div>


				<div className={`absolute flex gap-8 ${hideOptions ? '-bottom-[10%]' : 'md:bottom-3 bottom-5'} items-center  
				left-0 right-0 mx-auto justify-center transition-all duration-300 ease-in-out`}>
					<div 
					onClick={()=>{if(myStream) switchCamera()}}
					className={`${videoAllowed ? 'bg-sky-500' : 'bg-gray-500/50'} select-none outline-none transition-all duration-200 ease-in-out p-2 rounded-full cursor-pointer`}>						
						<MdOutlineCameraswitch className="text-white h-6 w-6"/>												
					</div>
					<div 
					onClick={updateVideo}
					className={`${videoAllowed ? 'bg-sky-500' : 'bg-gray-500/50'} select-none outline-none transition-all duration-200 ease-in-out p-2 rounded-full cursor-pointer`}>
						{
							videoAllowed ?
							<BsCameraVideo className="text-white h-6 w-6"/>
							:
							<BsCameraVideoOff className="text-white h-6 w-6"/>							
						}
					</div>
					<div 
					onClick={updateMic}
					className={`${micAllowed ? 'bg-sky-500' : 'bg-gray-500/50'} select-none outline-none transition-all duration-200 ease-in-out p-2 rounded-full cursor-pointer`}>
						{
							micAllowed ?
							<BsMic className="text-white h-6 w-6"/>
							:
							<BsMicMute className="text-white h-6 w-6"/>							
						}
					</div>
					<div 
					onClick={()=>{
						setCallNow(false);	
						if(myStream){
							stopCall()
						}					
					}}
					className="bg-red-500 p-2 rounded-full cursor-pointer">
						<ImPhoneHangUp className="text-white h-6 w-6"/>
					</div>

				</div>	
			</div>


		</div>


	)

}