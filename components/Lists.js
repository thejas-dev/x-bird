import {MdPostAdd} from 'react-icons/md';
import {useState,useEffect} from 'react';
import {useRecoilState} from 'recoil'
import {currentUserState} from '../atoms/userAtom'
import {BiArrowBack} from 'react-icons/bi';
import {AiOutlineSearch} from 'react-icons/ai';
import {updateUserLists} from '../utils/ApiRoutes';
import {RxCross2} from 'react-icons/rx';
import {RiFileList3Line} from 'react-icons/ri';
import axios from 'axios';

export default function Lists({currentWindow,setCurrentWindow}) {
	// body...
	const [loading,setLoading] = useState(false);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [searchValue,setSearchValue] = useState('');
	const [newListReveal,setNewListReveal] = useState(false);
	const [newListName,setNewListName] = useState('');
	const [newListDescription,setNewListDescription] = useState('');
	const [imageUploading,setImageUploading] = useState(false);

	const addNewList = async() => {
		setImageUploading(true);
		let currList = {
			name:newListName,
			description:newListDescription,
			members:[]
		}
		let newLists = [currList,...currentUser?.lists];
		const {data} = await axios.post(`${updateUserLists}/${currentUser._id}`,{
			lists:newLists
		})
		setCurrentUser(data.user);
		setImageUploading(false);
		setNewListReveal(false);
	}

	return (
		<div className="lg:w-[44.6%] relative  md:w-[70%] xs:w-[90%] w-[100%] flex flex-col h-full border-r-[1.3px] border-gray-200 scrollbar-none overflow-y-scroll">
			<div className={`${newListReveal  ? 'left-0' : 'left-[100%]'} z-50 transition-all duration-300 ease-in-out fixed top-0 h-full w-full bg-black/30 flex items-center justify-center`}>
				<div className="relative m-auto border-[1.1px] border-gray-200 lg:w-[40%] md:w-[60%] 
				sm:w-[80%] sm:max-h-[65%] overflow-hidden h-full w-full sm:rounded-3xl bg-white flex flex-col overflow-y-scroll 
				scrollbar-none">
					<div className={`absolute z-50 flex items-center justify-center h-full w-full bg-white/60 ${!imageUploading && 'hidden'} `}>
						<span className="loader3 h-14 w-14"/>
					</div>
					<div className="sticky z-40 bg-white/50 backdrop-blur-lg flex items-center justify-between top-0 px-5 py-3 w-full">
						<div className="flex items-center gap-4">
							<div 
							onClick={()=>setNewListReveal(false)}
							className="h-8 w-8 p-1 rounded-full hover:bg-gray-300/40 transition-all 
							duration-200 ease-in-out cursor-pointer">
								<RxCross2 className="h-full w-full text-black"/>
							</div>
							<h1 className="md:text-2xl pb-[1.5px] text-xl text-black font-semibold">New List</h1>
						</div>
						<button 
						onClick={addNewList}
						className="bg-black text-white font-semibold rounded-full px-5 py-2">
							Save
						</button>
					</div>
					<div className="w-full flex flex-col gap-5 px-5 py-3">
						<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg focus-within:border-sky-400  border-gray-300/60">
							<h1 className="text-sm text-gray-500" id="name" >Name</h1>
							<input type="text" placeholder="List name" 
							onFocus={()=>document.getElementById('name').classList.add('text-sky-500')}
							onBlur={()=>document.getElementById('name').classList.remove('text-sky-500')}
							value={newListName}
							onChange={(e)=>setNewListName(e.target.value)}
							className="w-full text-lg
							text-black placeholder:text-gray-500/70 outline-none "/>
						</div>
						<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg focus-within:border-sky-400  border-gray-300/60">
							<h1 className="text-sm text-gray-500" id="bio" >Description</h1>
							<textarea type="text" placeholder="List description" 
							onFocus={()=>document.getElementById('bio').classList.add('text-sky-500')}
							onBlur={()=>document.getElementById('bio').classList.remove('text-sky-500')}
							value={newListDescription}
							onChange={(e)=>setNewListDescription(e.target.value)}
							className="w-full text-lg
							text-black placeholder:text-gray-500/70 outline-none resize-none h-[100px]"/>
						</div>		
					</div>
				</div>
			</div>
			<div className="sticky top-0 gap-1 w-full backdrop-blur-lg z-30 flex items-center md:px-4 px-2 py-3 bg-white/50">
				<div 
				onClick={()=>setCurrentWindow('Home')}
				className="grid items-center p-1 hover:bg-gray-400/30 rounded-full transition-all duration-200 ease-in-out cursor-pointer select-none">
					<BiArrowBack className="h-7 w-7 text-black"/>
				</div>
				<div className="w-full flex items-center rounded-full gap-2 
				bg-gray-200/50 border-gray-200/50 border-[1px] focus-within:border-sky-500 px-3 py-2">
					<AiOutlineSearch className="h-6 w-6 text-gray-600"/>
					<input type="text" placeholder="Search Lists"  
					value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}
					className="w-full text-md outline-none p-1 text-black placeholder:text-gray-600 bg-transparent"/>
				</div>
				<div 
				onClick={()=>setNewListReveal(true)}
				className="grid items-center p-1 hover:bg-gray-400/30 rounded-full transition-all duration-200 ease-in-out cursor-pointer select-none">
					<MdPostAdd className="h-7 w-7 text-black"/>
				</div>
			</div>
			<div className={`h-full w-full backdrop-blur-lg bg-white flex items-center justify-center absolute z-50 ${!loading && 'hidden'}`}>
				<span className="loader3"></span>
			</div>
			<div className="w-full flex flex-col md:px-4 px-2 py-2">	
				<h1 className="md:text-2xl text-xl text-black font-semibold">Your Lists</h1>
				<div className={`w-full flex ${currentUser?.lists?.length < 1 && 'hidden'} gap-2 py-7 flex-col`}>
					{
						currentUser?.lists?.map((list,j)=>(
							<div key={j} className="w-full hover:bg-gray-200/40 cursor-pointer transition-all duration-200
							ease-in-out flex items-center gap-4 px-3 py-2 rounded-xl">
								<div className="p-3 rounded-lg bg-sky-300/50">
									<RiFileList3Line className="h-8 w-8 text-blue-700"/>
								</div>
								<div className="flex-col flex">
									<p className="text-lg font-bold text-black">{list?.name} <span className="text-gray-400 font-normal text-md"> •  {list?.members?.length} members</span></p>
									<p className="text-md text-gray-600 flex items-center gap-1"><img src={currentUser?.image} alt="" className="rounded-full h-5 w-5"/> <span className="text-black font-semibold">{currentUser?.name}</span> <span className="sm:flex hidden">@{currentUser?.username}</span></p>
								</div>

							</div>
						))
					}
				</div>
				<div className={`${currentUser?.lists?.length < 1 ? 'grid' : 'hidden'} w-full h-[200px] items-center`}>
					<h1 className="text-md text-gray-600 text-center">Nothing to see here yet — create favorite Lists to see your favorite posts.</h1>
				</div>
				<div className="mt-5 bg-gray-500/20 h-[1px] w-full"/>
			</div>

		</div>


	)
}