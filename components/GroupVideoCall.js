import {useRecoilState} from 'recoil'
import {currentChatState,currentUserState,groupCallerState,alertTheUserForIncomingCallState,
	currentPeerState,currentRoomIdState,inCallState,remotePeerIdGroupState,acceptedState,
	currentGroupPeerState
} from '../atoms/userAtom'
import { v4 as uuidv4 } from 'uuid';
import {ImPhoneHangUp} from 'react-icons/im';
import {BsMic,BsMicMute,BsCameraVideo,BsCameraVideoOff} from 'react-icons/bs';
import {TbScreenShare} from 'react-icons/tb';
import {useSound} from 'use-sound';
import {MdOutlineCameraswitch} from 'react-icons/md'
import {useState,useEffect} from 'react';
import {socket} from '../service/socket'



let myPeer;
let myStream;
let peers = {};
let currentCall;


export default function GroupVideoCall({
	currentWindow,
	setCurrentWindow,
	callNow,
	setCallNow,
	setCurrentGroupCaller,
	currentGroupCaller,
	acceptedCall,
	setAcceptedCall
}) {
	// body...
	const [groupCaller,setGroupCaller] = useRecoilState(groupCallerState)
	const [screenSharing,setScreenSharing] = useState(false);
	const [screenSharingSupported,setScreenSharingSupported] = useState(false);
	const [showNewUserAlert,setShowNewUserAlert] = useState(false);
	const [hideOptions,setHideOptions] = useState(false);
	const [micAllowed,setMicAllowed] = useState(true)
	const [alertTheUserForIncomingCall,setAlertTheUserForIncomingCall] = useRecoilState(alertTheUserForIncomingCallState)
	const [showUserAlreadyInCall,setShowUserAlreadyInCall] = useState(false);
	const [userAlreadyInCall,setUserAlreadyInCall] = useState('');
	const [showUserLeftAlert,setShowUserLeftAlert] = useState(false);
	const [userLeftAlert,setUserLeftAlert] = useState('');
	const [newUserAlert,setNewUserAlert] = useState('');
	const [currentGroupPeerId,setCurrentGroupPeerId] = useRecoilState(currentGroupPeerState)
	const [currentRoomId,setCurrentRoomId] = useRecoilState(currentRoomIdState);
	const [currentFacingMode,setCurrentFacingMode] = useState('user');
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState)
	const [remotePeerIdGroup, setRemotePeerIdGroup] = useRecoilState(remotePeerIdGroupState);
	const [inCall,setInCall] = useRecoilState(inCallState);
	const [accepted,setAccepted] = useRecoilState(acceptedState);	
	const [videoAllowed,setVideoAllowed] = useState(true);
	const [streams,setStreams] = useState([]);
	const [addToContainer,setAddToContainer] = useState('');
	const [play, { stop:stopAudio4 }] = useSound('dialer.mp3',{
	  loop:true
	});

	useEffect(()=>{
		if(groupCaller && !accepted){
			setLocalStream();
			if(currentUser?.dialerRingtonePlay){
				play()
			}
		}
	},[groupCaller])

	const connectToCall = async() => {
		if(groupCaller && !accepted){
			const roomId = await uuidv4()
			setCurrentRoomId(roomId)
			socket.emit('add-user-to-group-room',{
				roomId,
				userId:currentUser._id
			})
			const tempUser = {
				id:currentUser._id,
				name:currentUser.name,
				username:currentUser.username,
				image:currentUser.image
			}
			for(let i = 0; i < groupCaller?.length; i++){
				socket.emit('call-to-group-user',{
					groupCaller:groupCaller[i],
					user:tempUser,
					roomId,
					peerId:currentGroupPeerId
				})		
			}
			
		}
	}

	const setLocalStream = async() => {
		var errorCallback = function(e) {
	    	console.log('Reeeejected!', e);
	    };

	    
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
		    	addOwnStreamToContainer(myStream)	
		    	connectToCall()			
		    }else{
		    	myStream = stream
		    	addOwnStreamToContainer(myStream);
		    	connectToCall()					    					
		    }		   	    
	    }, errorCallback);

		}
	}

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

	const acceptAndSendStream = async(id) => {
		var errorCallback = function(e) {
	    	console.log('Reeeejected!', e);
	    };

		if(navigator.getUserMedia){
			navigator.getUserMedia({audio: true, video: { 
    			facingMode: "user" 
    		}},async function(stream) {
    			let tracks = await myStream?.getTracks();
				await tracks?.forEach(function(track) {
				   track?.stop()
				});
    			myStream = stream
				const call = myPeer.call(id, myStream);
				peers[id] = call;
				currentCall = call
				call.on('stream',userVideoStream => {
					addStreamToContainer(userVideoStream,id);
					setLocalStreamToMiniVideo(myStream);
				})	    
				call.on('close',()=>{
					call.close();
				})

	    	}, errorCallback);
		}
		

	}

	useEffect(()=>{
		socket.on('new-group-user',({user,peerId})=>{
			setNewUserAlert(user)
			acceptAndSendStream(peerId);
			setShowNewUserAlert(true);
			stopAudio4();
			setTimeout(()=>{
				setShowNewUserAlert(false)
			},4000)	
		});
		socket.on('incoming-group-call',({peerId,roomId,user})=>{
			if(!inCall){
				const data = {
					roomId,user,peerId,group:true
				}
				setAlertTheUserForIncomingCall(data);
			}else{
				let currUser = {
					name:currentUser?.name,
					username:currentUser?.username,
					image:currentUser?.image
				}
				socket.emit('user-in-call',{currUser,user});
			}
		})

		return ()=>{
			socket.off('incoming-group-call')
			socket.off('new-group-user')
		}
	},[])

	useEffect(()=>{

		if(navigator.mediaDevices && "getDisplayMedia" in navigator.mediaDevices){
			setScreenSharingSupported(true)
		}else{
			setScreenSharingSupported(false)
		}

	},[])

	const setLocalStreamToMiniVideo = async(stream) => {
		var video = document.getElementById('miniGroupStream');
	    video.muted = true
	    video.srcObject = stream;
	    video.onloadedmetadata = function(e) {
	        video.play()
	    };
	}

	async function screenShare() {
		if(screenSharing){
			setScreenSharing(false);
			switchCamera()
		}else{
			const displayMediaOptions = {
			  video: {
			    displaySurface: "window",
			  },
			  audio: false,
			};

			const videoTrack = myStream?.getVideoTracks()[0];
			navigator.mediaDevices.getDisplayMedia(displayMediaOptions,function(stream){
				if(currentCall){
					currentCall.peerConnection.getSenders().forEach((sender) => {
				    if(sender.track.kind === "audio" && stream.getAudioTracks().length > 0){
				        sender.replaceTrack(stream.getAudioTracks()[0]);
				    }
				    if (sender.track.kind === "video" && stream.getVideoTracks().length > 0) {
				        sender.replaceTrack(stream.getVideoTracks()[0]);
				      }
				    });		
				    setScreenSharing(true);		
				}
			    let tracks = myStream?.getTracks();
				tracks?.forEach(function(track) {
				   track?.stop()
				});
			    myStream = stream;
			    setLocalStreamToMiniVideo(myStream)		    
			});			
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
		    setLocalStreamToMiniVideo(myStream)		    
		    
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
		    setLocalStreamToMiniVideo(myStream)		    
		})
	  }
	}

	const stopCall = async() => {
		let currRoomId = currentRoomId; 
		socket.emit('user-left',{roomId:currRoomId,userId:currentUser._id});
		stopAudio4()
		// video2.muted = true;
		// video2.src = "";

		let tracks = myStream?.getTracks();
		tracks?.forEach(function(track) {
		   track?.stop()
		});
		setInCall(false);

		if(peers[remotePeerIdGroup]){
			peers[remotePeerIdGroup].close();
		}
		if(acceptedCall){
			setAcceptedCall(false);			
		}
		if(accepted){
			setAccepted(false);
		}

		let currGroupCaller = groupCaller;
		setGroupCaller('');
		setCurrentGroupCaller('');
		setRemotePeerIdGroup('');
		setCurrentRoomId('');
		socket.emit('stop-ring',{groupCaller:currGroupCaller, roomId:currRoomId})
	}

	const addOwnStreamToContainer = async(userVideoStream) => {
		const newDiv = document.createElement("div");

		newDiv.classList.add('bg-black', 'xs:h-[230px]', 'h-[250px]', 'md:w-[32%]', 'xs:w-[48%]', 'overflow-hidden'
		,'w-[98%]', 'rounded-2xl', 'flex', 'items-center', 'justify-center')
		let video = document.createElement('video')
		video.srcObject = userVideoStream;
		video.muted = true;
		video.addEventListener('click',(e)=>{
			setHideOptions(!hideOptions)
		})

		video.id = "miniGroupStream"
		
		video.onloadedmetadata = function(){
			video.play()
		}
		video.classList.add('h-full', 'w-full', 'object-cover', 'object-center','bg-red-500')
		newDiv.appendChild(video);
		console.log(newDiv)
		document.getElementById('streamContainer').append(newDiv);;

	}

	const addStreamToContainer = async(userVideoStream,id) => {
		const newDiv = document.createElement("div");

		newDiv.setAttribute('id',id);
		newDiv.classList.add('bg-black', 'xs:h-[230px]', 'h-[250px]', 'md:w-[32%]', 'xs:w-[48%]', 'overflow-hidden'
		,'w-[98%]', 'rounded-2xl', 'flex', 'items-center', 'justify-center')
		let video = document.createElement('video')
		video.srcObject = userVideoStream;

		video.addEventListener('click',(e)=>{
			setHideOptions(!hideOptions)
		})

		video.onloadedmetadata = function(){
			video.play()
		}
		video.classList.add('h-full', 'w-full', 'object-cover', 'object-center')
		newDiv.appendChild(video);
		document.getElementById('streamContainer').append(newDiv);

	}

	const addStreamToContainer2 = async(stream) => {
		const newDiv = document.createElement("div");

		newDiv.setAttribute('id',stream?.id);
		newDiv.classList.add('bg-black', 'xs:h-[230px]', 'h-[250px]', 'md:w-[32%]', 'xs:w-[48%]', 'overflow-hidden'
		,'w-[98%]', 'rounded-2xl', 'flex', 'items-center', 'justify-center')
		let video = document.createElement('video')
		video.srcObject = stream?.userVideoStream;

		video.addEventListener('click',(e)=>{
			setHideOptions(!hideOptions)
		})

		video.onloadedmetadata = function(){
			video.play()
		}
		video.classList.add('h-full', 'w-full', 'object-cover', 'object-center')
		newDiv.appendChild(video);
		console.log(newDiv)
		document.getElementById('streamContainer').append(newDiv);

	}

	useEffect(() => {
		import("peerjs").then(({ default: Peer }) => {
			// normal synchronous code
			let callId;
			const peer = new Peer();
			peer.on('open', id => {
				callId = id;
				setCurrentGroupPeerId(id)
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
						let tracks = await myStream?.getTracks();
						await tracks?.forEach(function(track) {
						   track?.stop()
						});
						peers[call.peer] = call;
						myStream = stream;
						call.answer(myStream);
						currentCall = call;

						call.on('stream',userVideoStream=>{
							stopAudio4()
							setAcceptedCall(true);
							let userStream = {
								userVideoStream,id:call.peer
							}
							setAddToContainer(userStream);
						})

						call.on('close',()=>{
							call.close();
							console.log("user left")
						})

					},errorCallback)
				}
			})
		})
	}, [])

	useEffect(()=>{
		if(addToContainer){
			addStreamToContainer2(addToContainer)
		}
	},[addToContainer])





	return (
		<div className={`fixed left-0 ${groupCaller ? 'bottom-0' : '-bottom-[100%]'} flex items-center justify-center
		h-full w-full z-50 bg-black/80 backdrop-blur-sm transition-all duration-200 ease-in-out`}>
			<div className={`fixed ${showUserAlreadyInCall ? 'scale-100' : 'scale-0'} transition-all duration-300 ease-in-out flex items-center justify-center `}>
				<div className="bg-black/70 rounded-full text-white dark:bg-white/30 px-3 py-1">
					<h1 className="text-md text-white font-semibold">{userAlreadyInCall?.name} in call</h1>
				</div>
			</div>
			<div className="h-full relative w-full">
				<div className={`fixed z-50 top-2 ${showNewUserAlert ? 'left-2' : '-left-[100%]'} bg-black/70 px-2 py-2
				text-white backdrop-blur-sm flex items-center gap-3 rounded-lg transition-all duration-200 ease-in-out`}>
					<img src={newUserAlert?.image} alt="" className="h-6 w-6 rounded-full" /> {newUserAlert?.name} joined
				</div>

				<div className={`fixed z-50 top-2 ${showUserLeftAlert ? 'left-2' : '-left-[100%]'} bg-black/70 px-2 py-2
				text-white backdrop-blur-sm flex items-center gap-3 rounded-lg transition-all duration-200 ease-in-out`}>
					<img src={userLeftAlert?.image} alt="" className="h-6 w-6 rounded-full" /> {userLeftAlert?.name} left
				</div>

				<div 
				className={`h-full relative p-[2%] w-full mx-auto 
				overflow-y-scroll flex items-center justify-center scrollbar-none`}>
					<div 
					onClick={()=>setHideOptions(!hideOptions)}		
					id="streamContainer" className="h-full w-full md:gap-[2%] gap-[3%] flex flex-wrap items-center justify-center">
						
						

						
					</div>
					
					<div className={`grid-cols-2 grid w-[12%] md:w-[10%] ${acceptedCall ? 'hidden' : 'block'} aspect-square 
					rounded-full overflow-hidden absolute m-auto right-2 bottom-10`}>
						{
							currentGroupCaller?.image?.map((img,j)=>{
								if(currentGroupCaller.image.length === 3){
									if(j<2){
										return (
											<img src={img} key={j} className="object-cover w-full h-full animate-pulse " alt=""/>
										)
									}
								}else{
									if(j<4){
										return (
											<img src={img} key={j} className="object-cover w-full h-full animate-pulse " alt=""/>
										)
									}	
								}
							})
						}
					</div>

					
					
				</div>
				


				<div className={`absolute flex xs:gap-8 gap-5 ${hideOptions ? '-bottom-[10%]' : 'md:bottom-3 bottom-5'} items-center  
				left-0 right-0 mx-auto justify-center transition-all duration-300 ease-in-out flex-wrap`}>
					<div 
					onClick={()=>{if(myStream) switchCamera()}}
					className={`${videoAllowed ? 'bg-sky-500' : 'bg-gray-500/50'} select-none outline-none transition-all duration-200 ease-in-out p-2 rounded-full cursor-pointer`}>						
						<MdOutlineCameraswitch className="text-white h-6 w-6"/>												
					</div>
					<div 
					onClick={()=>{if(myStream) screenShare()}}
					className={`${screenSharing ? 'bg-sky-500' : 'bg-gray-500/50'} ${!screenSharingSupported && 'hidden' } select-none outline-none transition-all duration-200 ease-in-out p-2 rounded-full cursor-pointer`}>						
						<TbScreenShare className="text-white h-6 w-6"/>												
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
						stopCall()			
					}}
					className="bg-red-500 p-2 rounded-full cursor-pointer">
						<ImPhoneHangUp className="text-white h-6 w-6"/>
					</div>

				</div>	
			</div>


		</div>


	)
}


// {
// 	streams.map((str,j)=>{
// 		let video = document.getElementById(`streams-${j}`);
// 		video.srcObject = str

// 		return (
// 			<div className="rounded-xl border-[1px] border-sky-500 hover:scale-105 transition-all
// 			duration-300 ease-in-out md:aspect-[16/9] aspect-[9/16]">
// 				<video name="videoMainStreamGroup" id={`stream-${j}`}
// 				onClick={()=>setHideOptions(!hideOptions)}
// 				className="min-h-full min-w-full object-cover" src=""></video>
// 			</div>

// 		)
// 	})
// }