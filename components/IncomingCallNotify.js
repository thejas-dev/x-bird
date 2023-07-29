import {useRecoilState} from 'recoil';
import {alertTheUserForIncomingCallState,currentUserState,currentPeerState,acceptedState,
	remotePeerIdState,currentRoomIdState,callerIdState,inCallState,groupCallerState,
	currentGroupPeerState,inGroupCallState} from '../atoms/userAtom';
import {useState,useEffect} from 'react'; 
import {socket} from '../service/socket';
import {useSound} from 'use-sound';

export default function IncomingCallNotify({callNow,
	setCallNow,
	currentCaller,
	setCurrentCaller,
	inCall,
	inGroupCall
}) {
	// body...
	const [alertTheUserForIncomingCall,setAlertTheUserForIncomingCall] = useRecoilState(alertTheUserForIncomingCallState)
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState)
	const [currentPeerId,setCurrentPeerId] = useRecoilState(currentPeerState)
	const [videoCallNotify,setVideoCallNotify] = useState(false);
	const [accepted,setAccepted] = useRecoilState(acceptedState);
	const [remotePeerId, setRemotePeerId] = useRecoilState(remotePeerIdState);
	// const [remotePeerIdGroup, setRemotePeerIdGroup] = useRecoilState(remotePeerIdGroupState);
	const [currentGroupPeerId,setCurrentGroupPeerId] = useRecoilState(currentGroupPeerState)
	const [currentRoomId,setCurrentRoomId] = useRecoilState(currentRoomIdState);
	const [groupCaller,setGroupCaller] = useRecoilState(groupCallerState)
	const [callerId,setCallerId] = useRecoilState(callerIdState);
	// const [inGroupCall,setInGroupCall] = useRecoilState(inGroupCallState)
	// const [inCall,setInCall] = useRecoilState(inCallState);
	const [play, { stop }] = useSound('ringtone2.mp3',{
	  onend: () => {
	    play();
	  },
	});


	useEffect(()=>{
		if(currentUser){
			if(currentUser?.videCallNotify && currentUser?.notify){
				setVideoCallNotify(true)
			}else{
				setVideoCallNotify(false)				
			}
		}
	},[currentUser])

	useEffect(()=>{
		if(alertTheUserForIncomingCall){
			playRingtone()
		}else{
			stopRingtone()
		}
	},[alertTheUserForIncomingCall])


	const playRingtone = () => {
		if(videoCallNotify){play()}
	}

	const stopRingtone = () => {
		if(videoCallNotify){stop()}
	};

	const acceptCall = async() => {
		inCall = true;
		setCallerId(alertTheUserForIncomingCall?.user?.id);
		setCurrentCaller(alertTheUserForIncomingCall?.user);
		setCurrentRoomId(alertTheUserForIncomingCall?.roomId)
		setCallNow(true);
		const tempUser = {
			id:currentUser._id,
			name:currentUser.name,
			username:currentUser.username,
			image:currentUser.image
		}
		socket.emit('call-accepted',{
			user:tempUser,
			roomId:alertTheUserForIncomingCall?.roomId,
			peerId:alertTheUserForIncomingCall?.peerId
		})
		setAccepted(true)
		setRemotePeerId(alertTheUserForIncomingCall?.peerId);
		setAlertTheUserForIncomingCall('');
		stopRingtone();
	}

	const acceptGroupCall = async() => {
		inGroupCall = true;
		setGroupCaller(alertTheUserForIncomingCall?.user?.id);
		setCurrentCaller(alertTheUserForIncomingCall?.user);
		setCurrentRoomId(alertTheUserForIncomingCall?.roomId)
		setCallNow(true);
		const tempUser = {
			id:currentUser._id,
			name:currentUser.name,
			username:currentUser.username,
			image:currentUser.image
		}
		socket.emit('group-call-accepted',{
			user:tempUser,
			roomId:alertTheUserForIncomingCall?.roomId,
			peerId:currentGroupPeerId
		})
		setAccepted(true)
		setAlertTheUserForIncomingCall('');
		stopRingtone();
	}

	return (
		<div className={`fixed ${alertTheUserForIncomingCall && videoCallNotify && !accepted ? 'top-0' : '-top-[40%]'}
		px-3 md:py-2 py-4 bg-white dark:bg-[#100C08]/70 left-0 right-0 mx-auto dark:backdrop-blur-md border-[1px] border-gray-500/90 shadow-xl 
		hover:shadow-purple-700/70 dark:shadow-purple-700/50 shadow-sky-500/50 transition-all duration-300 ease-in-out
		dark:border-gray-800/50 rounded-b-lg flex flex-col gap-2 z-50 max-w-sm
		`}>
			<div className={`flex items-center gap-2`}>
				<img src={alertTheUserForIncomingCall?.user?.image} alt="" className="rounded-full md:h-12 h-10 md:w-12 w-10 hover:shadow-md
				shadow-sky-500" id="image"/>
				<div className="flex flex-col">
					<p className="text-black dark:text-gray-200 md:text-xl text-lg font-semibold">{
						alertTheUserForIncomingCall?.group ? 
						'Incoming group call'
						:
						'Incoming video call'
					}</p>
					<p className="text-gray-500 dark:text-gray-400 md:text-lg text-md ">@ {alertTheUserForIncomingCall?.user?.username}</p>
				</div>




			</div>
			<div className="flex items-center w-full justify-between gap-2">
				<button 
				onClick={()=>{
					setAlertTheUserForIncomingCall('');
					stopRingtone();
				}}
				className="px-5 py-2 rounded-lg bg-red-500 w-[50%] dark:bg-red-600 border-[1px] border-gray-300 dark:border-gray-800 text-gray-100">Decline</button>
				<button 
				onClick={()=>{
					if(alertTheUserForIncomingCall?.group){
						acceptGroupCall()
					}else{
						acceptCall();
					}
				}}
				className="px-5 py-2 rounded-lg bg-green-500 w-[50%] dark:bg-green-600 border-[1px] border-gray-300 dark:border-gray-800 text-gray-100">{
					alertTheUserForIncomingCall?.group ? 
					'Join'
					:
					'Accept'
				}</button>
			</div>

		</div>

	)
}