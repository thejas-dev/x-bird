import {useRecoilState} from 'recoil'
import {currentChatState,currentUserState,groupCallerState,alertTheUserForIncomingCallState,
	currentPeerState,currentRoomIdState,inCallState,inGroupCallState,remotePeerIdGroupState,
	acceptedState,currentGroupPeerState
} from '../atoms/userAtom'
import { v4 as uuidv4 } from 'uuid';
import {ImPhoneHangUp} from 'react-icons/im';
import {BsMic,BsMicMute,BsCameraVideo,BsCameraVideoOff} from 'react-icons/bs';
import {TbScreenShare} from 'react-icons/tb';
import {useSound} from 'use-sound';
import {MdOutlineCameraswitch} from 'react-icons/md'
import {useState,useEffect} from 'react';
import {socket} from '../service/socket'
import {FiMaximize,FiMinimize2} from 'react-icons/fi';
import ReactDOM from 'react-dom';

let myPeer;
let myStream;
let peers = {};
let currentCall;
let activeStreams = [];

export default function GroupVideoCall({
	currentWindow,
	setCurrentWindow,
	callNow,
	setCallNow,
	setCurrentGroupCaller,
	currentGroupCaller,
	acceptedCall,
	setAcceptedCall,
	inGroupCall,
	inCall
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
	// const [inCall,setInCall] = useRecoilState(inCallState);
	// const [inGroupCall,setInGroupCall] = useRecoilState(inGroupCallState)
	const [accepted,setAccepted] = useRecoilState(acceptedState);	
	const [videoAllowed,setVideoAllowed] = useState(true);
	const [streams,setStreams] = useState([]);
	const [addToContainer,setAddToContainer] = useState('');
	const [addToContainer2,setAddToContainer2] = useState('');
	const [stopRing,setStopRing] = useState(false);
	const [changeVisibleOption,setChangeVisibleOption] = useState(false);
	const [openMaxWindow,setOpenMaxWindow] = useState(false);
	const [maxVideoSource,setMaxVideoSource] = useState('');
	const [play, { stop:stopAudio4 }] = useSound('dialer.mp3',{
	  loop:true
	});

	function setMicandVideoAllowed() {
		if(myStream){
			setVideoAllowed(true);
			setMicAllowed(true);
		}		
	}

	function addMediaStream(stream) {
	  activeStreams.push(stream);
	}

	function closeAllMediaStreams() {
	  activeStreams.forEach((stream) => {
	    closeMediaStream(stream);
	  });

	  activeStreams.length = 0;
	}

	function closeMediaStream(stream) {
	  if (!stream) return;

	  const tracks = stream.getTracks();

	  tracks.forEach((track) => {
	    track.stop();
	  });
	}

	useEffect(()=>{
		if(groupCaller){
			inGroupCall = true			
			setLocalStream();
			if(currentUser?.dialerRingtonePlay && !accepted){
				play()
			}
		}
	},[groupCaller])

	useEffect(()=>{
		if(acceptedCall){
			stopAudio4();
		}
	},[acceptedCall])

	useEffect(()=>{
		if(changeVisibleOption){
			setChangeVisibleOption(false)
			setHideOptions(!hideOptions)
		}
	},[changeVisibleOption])

	const hideTheOptions = () => {
		setChangeVisibleOption(true)
	}

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
    			addMediaStream(stream)
	    		if(myStream){
				    let tracks = myStream.getTracks();
					tracks.forEach(function(track) {
					   track.stop()
					});
				    myStream = stream
				    setMicandVideoAllowed()
			    	addOwnStreamToContainer(myStream)	
			    	connectToCall()			
			    }else{
			    	myStream = stream
				    setMicandVideoAllowed()			    	
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

	useEffect(()=>{
		if(addToContainer2){
			addStreamToContainer(addToContainer2?.userVideoStream,addToContainer2?.id,addToContainer2?.newDiv,
					addToContainer2?.userName,addToContainer2?.userId);
			setAddToContainer2('');
		}
	},[addToContainer2])

	const acceptAndSendStream = async(id,userName,userId) => {
		stopAudio4();
		var errorCallback = function(e) {
	    	console.log('Reeeejected!', e);
	    };

	    if(myStream){
	    	
	    	const call = await myPeer.call(id, myStream);
			peers[id] = call;
			currentCall = call
			
			const newDiv = document.createElement('div');
			call.on('stream',userVideoStream => {
				console.log(userVideoStream)
				let temp = {
					userVideoStream,id,newDiv,userName,userId
				}
				setAddToContainer2(temp)
			})	    

			call.on('close',()=>{
				newDiv.remove()
				setOpenMaxWindow(false)

			})
	    }else{
			if(navigator.getUserMedia){
				navigator.getUserMedia({audio: true, video: { 
	    			facingMode: "user" 
	    		}},async function(stream) {
	    			addMediaStream(stream);
	    			let tracks = await myStream?.getTracks();
					await tracks?.forEach(function(track) {
					   track?.stop()
					});

	    			myStream = stream
				    setMicandVideoAllowed()
					const call = myPeer.call(id, myStream);
					
					peers[id] = call;
					currentCall = call
					
					const newDiv = document.createElement('div');
					call.on('stream',userVideoStream => {
						let temp = {
							userVideoStream,id,newDiv,userName,userId
						}
						setAddToContainer2(temp)
						setLocalStreamToMiniVideo(myStream);
					})	    
					call.on('close',()=>{
						newDiv.remove()
						setOpenMaxWindow(false)

					})

		    	}, errorCallback);
			}	    	
	    }

		

	}

	useEffect(()=>{
		socket.on('new-group-user',({user,peerId})=>{
			stopAudio4();
			inGroupCall = true;
			setNewUserAlert(user)
			acceptAndSendStream(peerId,user.name,user.id);
			setShowNewUserAlert(true);
			setAcceptedCall(true);
			setTimeout(()=>{
				setShowNewUserAlert(false)
			},4000)	
		});
		socket.on('incoming-group-call',({peerId,roomId,user})=>{
			if(!inCall && !inGroupCall){
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
		socket.on('user-left-group',({userId,user,peerId})=>{
			if(peers[peerId]) peers[peerId].close();
			setUserLeftAlert(user);
			setShowUserLeftAlert(true)
			setTimeout(()=>{
				setShowUserLeftAlert(false)
			},4000)	
		})
		socket.on('stop-ring-group',({id,peerId})=>{
			setStopRing(id)
		})
		socket.on('user-already-in-call',({currUser})=>{
			setUserAlreadyInCall(currUser);
			setShowUserAlreadyInCall(true)
			setTimeout(()=>{
				setShowUserAlreadyInCall(false)
			},4000)
		})

		return ()=>{
			socket.off('incoming-group-call')
			socket.off('new-group-user')
			socket.off('user-left-group')
			socket.off('stop-ring-group')
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
				setMicandVideoAllowed()
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
	  		setCurrentFacingMode('environment')
	  		addMediaStream(stream);
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
			setMicandVideoAllowed()
		    setLocalStreamToMiniVideo(myStream)		    
		    
		});

	  }else{
	  	
		navigator.getUserMedia({audio: true, video: { 
			facingMode: "user" 
		}},async function(stream) {
	  		setCurrentFacingMode('user')	  	
	  		addMediaStream(stream)
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
			setMicandVideoAllowed()		    
		    setLocalStreamToMiniVideo(myStream)		    
		})
	  }
	}

	const stopCall = async() => {
		let currRoomId = currentRoomId; 

		socket.emit('user-left-group',{
			roomId:currRoomId,
			userId:currentUser._id, 
			peerId:currentGroupPeerId,
			user:{
				name:currentUser.name,
				image:currentUser.image
			}
		});
		stopAudio4()

		const parent = document.getElementById("streamContainer")
		while (parent.firstChild) {
		    parent.firstChild.remove()
		}

		closeAllMediaStreams();
		let tracks = myStream?.getTracks();
		tracks?.forEach(function(track) {
		   track?.stop()
		});
		inGroupCall = false;
		setOpenMaxWindow(false)

		myStream = '';
		setMicandVideoAllowed()

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
		socket.emit('stop-ring-group',{callerId:currGroupCaller, roomId:currRoomId, peerId:currentGroupPeerId})
	}

	const addOwnStreamToContainer = async(userVideoStream) => {
		const newDiv = document.createElement("div");

		newDiv.classList.add('bg-black', 'xs:h-[230px]', 'h-[250px]', 'md:w-[32%]', 'xs:w-[48%]', 'overflow-hidden'
		,'w-[98%]', 'rounded-2xl', 'flex', 'items-center', 'justify-center','relative')
		let video = document.createElement('video')
		video.srcObject = userVideoStream;
		video.muted = true;
		newDiv.addEventListener('click',(e)=>{
			hideTheOptions()
		})

		let maxDiv = document.createElement('div');
		maxDiv.classList.add("absolute", "right-1" ,"bottom-2", "p-[6px]", "hover:scale-105", "transition-all", "duration-200" ,"ease-in-out", 
			"rounded-full", "cursor-pointer", "bg-black/30", "backdrop-blur-sm", "text-white",'z-50')

		maxDiv.addEventListener('click',()=>{
			setOpenMaxWindow(true);
			let maxVideo = document.getElementById('videoMaxStream');
			maxVideo.srcObject = video.srcObject;
			maxVideo.muted = true
			maxVideo.autoplay = true;

			maxVideo.onloadedmetadata = function(){
				maxVideo.play()
			}
		})

		const iconElement = <FiMaximize className="h-5 w-5 text-white" />;
		ReactDOM.render(iconElement, maxDiv);	

		newDiv.appendChild(maxDiv)

		video.setAttribute('id','miniGroupStream')
		
		video.onloadedmetadata = function(){
			video.play()
		}
		video.classList.add('h-full', 'w-full', 'object-cover', 'object-center','bg-black')
		newDiv.appendChild(video);
				
		document.getElementById('streamContainer').append(newDiv);
		styleByChild()

	}

	const addStreamToContainer = async(userVideoStream,id,newDiv,userName,userId) => {
		if(!newDiv){

			const newDiv = document.createElement("div");
			newDiv.setAttribute('id',id);
			newDiv.setAttribute('name',userId);
			newDiv.classList.add('bg-black', 'xs:h-[230px]', 'h-[250px]', 'md:w-[32%]', 'xs:w-[48%]', 'overflow-hidden'
			,'w-[98%]', 'rounded-2xl', 'flex', 'items-center', 'justify-center','relative')
			let video = document.createElement('video')
			video.srcObject = userVideoStream;

			newDiv.addEventListener('click',(e)=>{
				hideTheOptions()
			})
			
			let maxDiv = document.createElement('div');
			maxDiv.classList.add("absolute", "right-1" ,"bottom-2", "p-[6px]", "hover:scale-105", "transition-all", "duration-200" ,"ease-in-out", 
				"rounded-full", "cursor-pointer", "bg-black/30", "backdrop-blur-sm", "text-white",'z-50')

			maxDiv.addEventListener('click',()=>{
				setOpenMaxWindow(true);
				let maxVideo = document.getElementById('videoMaxStream');
				maxVideo.srcObject = video.srcObject;
				maxVideo.muted = true
				maxVideo.autoplay = true;

				maxVideo.onloadedmetadata = function(){
					maxVideo.play()
				}
			})

			const iconElement = <FiMaximize className="h-5 w-5 text-white" />;
			ReactDOM.render(iconElement, maxDiv);
			
			newDiv.appendChild(maxDiv)

			video.classList.add('h-full', 'w-full', 'object-cover', 'object-center','bg-black')
			newDiv.appendChild(video);
			document.getElementById('streamContainer').append(newDiv);
			document.getElementById('streamContainer').scrollIntoView({ behavior: 'smooth', block: 'end' });
			styleByChild()
			
			video.onloadedmetadata = function(){
				video.play()
			}

		}else{

			newDiv.setAttribute('name',userId);			
			newDiv.setAttribute('id',id);
			newDiv.classList.add('bg-black', 'xs:h-[230px]', 'h-[250px]', 'md:w-[32%]', 'xs:w-[48%]', 'overflow-hidden'
			,'w-[98%]', 'rounded-2xl', 'flex', 'items-center', 'justify-center','relative')
			let video = document.createElement('video')
			video.srcObject = userVideoStream;

			newDiv.addEventListener('click',(e)=>{
				hideTheOptions()
			})

			let maxDiv = document.createElement('div');
			maxDiv.classList.add("absolute", "right-1" ,"bottom-2", "p-[6px]", "hover:scale-105", "transition-all", "duration-200" ,"ease-in-out", 
				"rounded-full", "cursor-pointer", "bg-black/30", "backdrop-blur-sm", "text-white",'z-50')

			maxDiv.addEventListener('click',()=>{
				setOpenMaxWindow(true);
				let maxVideo = document.getElementById('videoMaxStream');
				maxVideo.srcObject = video.srcObject;
				maxVideo.muted = true
				maxVideo.autoplay = true;

				maxVideo.onloadedmetadata = function(){
					maxVideo.play()
				}
			})

			const iconElement = <FiMaximize className="h-5 w-5 text-white" />;
			ReactDOM.render(iconElement, maxDiv);

			newDiv.appendChild(maxDiv)
			
			video.classList.add('h-full', 'w-full', 'object-cover', 'object-center','bg-black')
			newDiv.appendChild(video);
			document.getElementById('streamContainer').append(newDiv);
			document.getElementById('streamContainer').scrollIntoView({ behavior: 'smooth', block: 'end' });
			styleByChild()
			
			video.onloadedmetadata = function(){
				video.play()
			}
		}
	}

	const addStreamToContainer2 = async(stream) => {
		if(!stream.newDiv){

			const newDiv = document.createElement("div");
			newDiv.setAttribute('id',stream?.id);
			newDiv.classList.add('xs:h-[230px]', 'h-[250px]', 'md:w-[32%]', 'xs:w-[48%]', 'overflow-hidden'
			,'w-[98%]', 'rounded-2xl', 'flex', 'items-center', 'justify-center','relative')
			let video = document.createElement('video')
			
			video.srcObject = stream?.userVideoStream;

			newDiv.addEventListener('click',(e)=>{
				hideTheOptions()
			})

			let maxDiv = document.createElement('div');
			maxDiv.classList.add("absolute", "right-1" ,"bottom-2", "p-[6px]", "hover:scale-105", "transition-all", "duration-200" ,"ease-in-out", 
				"rounded-full", "cursor-pointer", "bg-black/30", "backdrop-blur-sm", "text-white",'z-50')

			maxDiv.addEventListener('click',()=>{
				setOpenMaxWindow(true);
				let maxVideo = document.getElementById('videoMaxStream');
				maxVideo.srcObject = video?.srcObject;
				maxVideo.muted = true
				maxVideo.autoplay = true;

				maxVideo.onloadedmetadata = function(){
					maxVideo.play()
				}
			})

			const iconElement = <FiMaximize className="h-5 w-5 text-white" />;
			ReactDOM.render(iconElement, maxDiv);

			newDiv.appendChild(maxDiv)

			video.classList.add('h-full', 'w-full', 'object-cover', 'object-center','bg-black')
			newDiv.append(video);

			document.getElementById('streamContainer').append(newDiv);
			document.getElementById('streamContainer').scrollIntoView({ behavior: 'smooth', block: 'end' });
			styleByChild()

			video.onloadedmetadata = function(){
				video.play()
			}			
		}else{

			stream.newDiv.setAttribute('id',stream?.id);
			stream.newDiv.classList.add('xs:h-[230px]', 'h-[250px]', 'md:w-[32%]', 'xs:w-[48%]', 'overflow-hidden'
			,'w-[98%]', 'rounded-2xl', 'flex', 'items-center', 'justify-center','relative')
			let video = document.createElement('video')
			
			video.srcObject = stream?.userVideoStream;

			stream?.newDiv?.addEventListener('click',(e)=>{
				hideTheOptions()
			})

			let maxDiv = document.createElement('div');
			maxDiv.classList.add("absolute", "right-1" ,"bottom-2", "p-[6px]", "hover:scale-105", "transition-all", "duration-200" ,"ease-in-out", 
				"rounded-full", "cursor-pointer", "bg-black/30", "backdrop-blur-sm", "text-white",'z-50')

			maxDiv.addEventListener('click',()=>{
				setOpenMaxWindow(true);
				let maxVideo = document.getElementById('videoMaxStream');
				maxVideo.srcObject = video.srcObject;
				maxVideo.muted = true
				maxVideo.autoplay = true;

				maxVideo.onloadedmetadata = function(){
					maxVideo.play()
				}
			})

			const iconElement = <FiMaximize className="h-5 w-5 text-white" />;
			ReactDOM.render(iconElement, maxDiv);

			stream.newDiv.appendChild(maxDiv)

			video.classList.add('h-full', 'w-full', 'object-cover', 'object-center','bg-black')
			stream.newDiv.append(video);

			document.getElementById('streamContainer').append(stream.newDiv);
			document.getElementById('streamContainer').scrollIntoView({ behavior: 'smooth', block: 'end' });
			styleByChild()

			video.onloadedmetadata = function(){
				video.play()
			}			
		}
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

			myPeer.on('call',async function(call){
				let constraints = {
					audio:true,
					video:{
						facingMode:'user'
					}
				}
				var errorCallback = function(e) {
			    	console.log('Reeeejected!', e);
			    };
				if(!myStream){
					try{
						navigator?.getUserMedia(constraints,async function(stream){
		  					addMediaStream(stream)
							myStream = stream
							setMicandVideoAllowed()

							peers[call.peer] = call;
						
							call.answer(myStream);
							currentCall = call;
							
							let newDiv = document.createElement('div')
							call.on('stream',userVideoStream=>{
								stopAudio4()
								setAcceptedCall(true);
								let userStream = {
									userVideoStream,id:call?.peer,newDiv
								}
								setAddToContainer(userStream);
							})

							call.on('close',()=>{
								newDiv.remove()
								setOpenMaxWindow(false)
								console.log("user left")
							})

						},errorCallback)
					}catch(ex){
						errorCallback(ex)
					}
					
				}else{
					peers[call.peer] = call;
					
					call.answer(myStream);
					currentCall = call;

					let newDiv = document.createElement('div')
					call.on('stream',userVideoStream=>{
						stopAudio4()
						setAcceptedCall(true);
						let userStream = {
							userVideoStream,id:call.peer,newDiv
						}
						setAddToContainer(userStream);
					})

					call.on('close',()=>{
						newDiv.remove();
						setOpenMaxWindow(false)
						console.log("user left")
					})
				}
				
			})
		})
	}, [])

	useEffect(()=>{
		if(addToContainer){
			addStreamToContainer2(addToContainer)
		}
	},[addToContainer])

	const styleByChild = () => {
		// const parentElement = document.getElementById('streamContainer');
	   
	    // const childDivElements = parentElement.querySelectorAll('div');

	    // if(childDivElements.length > 0){
		//     const numberOfChildren = childDivElements?.length;

		//     switch(numberOfChildren){
		//     	case 1:
		//     		parentElement.classList.add('items-center');
		//     		parentElement.classList.remove('mt-[50px]')
		//     		break;
		//     	case 2:
		//     		parentElement.classList.remove('items-center');
		//     		parentElement.classList.add('mt-[50px]')
		//     		break;
		//     	default:
		//     		parentElement.classList.add('items-center');
		//     		parentElement.classList.remove('mt-[50px]')
		//     		break;

		//     }	    	
	    // }

	}

	



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
				onClick={()=>setHideOptions(!hideOptions)}		
				className={`h-full relative p-[2%] w-full mx-auto 
				 flex items-center justify-center `}>
					<div 
					id="streamContainer" className="h-full overflow-y-scroll scrollbar-none md:py-0 py-10 w-full md:gap-[2%] gap-[3%] z-30 flex flex-wrap items-center justify-center">
						
						

						
					</div>
					
					<div className={`grid-cols-2 grid w-[12%] md:w-[10%] ${acceptedCall ? 'hidden' : 'block'} aspect-square 
					rounded-full overflow-hidden absolute m-auto right-2 bottom-10 z-40`}>
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
				left-0 right-0 mx-auto justify-center z-50 transition-all duration-300 ease-in-out flex-wrap`}>
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

			<div className={`fixed ${openMaxWindow ? 'h-full w-full' : 'h-0 w-0'} left-0 bg-black/30 
			backdrop-blur-md top-0 right-0 bottom-0 m-auto z-30 flex items-center justify-center transition-all
			duration-300 ease-in-out`}>
				<div className={`sm:h-[85%] h-full relative sm:rounded-2xl md:aspect-[16/9] mx-auto aspect-[9/16] overflow-hidden`}>
					<div 
					onClick={()=>{
						setOpenMaxWindow(false);
						let videoElement = document.getElementById('videoMaxStream');
						videoElement.srcObject = null;
						videoElement.src = ''
					}}
					className={`absolute right-2 hover:scale-110 transition-all duration-300 
 					ease-in-out rounded-full cursor-pointer bg-black/20 backdrop-blur-sm text-white 
 					cursor-pointer z-30 ${!hideOptions ? 'top-2' : '-top-[100px]'} p-1 h-8 w-8`}>	
 						<FiMinimize2 className='h-full w-full text-white'/>
					</div>
					<div 
					onClick={()=>setHideOptions(!hideOptions)}					
					className={`absolute h-full w-full top-0 left-0 sm:rounded-2xl transition-all duration-300 xs:hidden bg-gradient-to-t from-black/40 via-transparent to-transparent
					ease-in-out 
					${!hideOptions ? 'opacity-100' : 'opacity-0'}`}/>
					<video id="videoMaxStream" 
					onClick={()=>setHideOptions(!hideOptions)}
					className="h-full w-full object-cover object-center bg-black sm:rounded-2xl" src=""></video>
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



// <div className='bg-black xs:h-[230px] h-[250px] md:w-[32%] xs:w-[48%] overflow-hidden w-[98%] 
// 						rounded-2xl flex items-center justify-center relative'>
// 							<video className="h-full w-full object-cover object-center bg-black" src="sample-mp4-file.mp4"></video>
// 							<div className="absolute right-1 bottom-2 p-[6px] hover:scale-105 transition-all duration-200 
// 							ease-in-out rounded-full cursor-pointer bg-black/30 backdrop-blur-sm text-white">
// 								<FiMaximize className='h-5 w-5 text-white'/>
// 							</div>
// 						</div>	