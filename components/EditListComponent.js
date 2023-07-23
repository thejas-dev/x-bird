import {RxCross2} from 'react-icons/rx';
import {HiOutlineCamera} from 'react-icons/hi'
import {useState} from 'react';
import {AiOutlineRight} from 'react-icons/ai';

export default function EditListComponent({name,description,backgroundImage,setBackgroundImage,setName,
		setDescription,updateList,editListShow,setEditListShow,imageUploading,url2Setter,setRevealListMembers,
		path4,setPath4}){

	



	

	return (
		<div className={`fixed top-0 ${editListShow ? 'left-0' : 'left-[100%]'} flex items-center justify-center
		h-full w-full z-50 bg-black/30  dark:backdrop-blur-sm transition-all duration-200 ease-in-out`}>
			<div 
			id="editListwindow"
			className="relative m-auto border-[1.1px] border-gray-200 dark:border-gray-700 lg:w-[40%] md:w-[60%] 
			sm:w-[80%] sm:max-h-[85%] overflow-hidden h-full w-full sm:rounded-3xl bg-white dark:bg-[#100C08] flex flex-col overflow-y-scroll 
			scrollbar-none scroll-smooth transition-all duration-200 ease-in-out">
				<div className={`absolute z-50 flex items-center justify-center h-full w-full bg-white/60 ${!imageUploading && 'hidden'} `}>
					<span className="loader3 h-14 w-14"/>
				</div>
				<div className="sticky z-40 bg-white/50 dark:bg-[#100C08]/50 backdrop-blur-lg flex items-center justify-between top-0 px-3 py-2 w-full">
					<div className="flex items-center gap-4">
						<div 
						onClick={()=>setEditListShow(false)}
						className="h-8 w-8 p-1 rounded-full hover:bg-gray-300/40 transition-all 
						duration-200 ease-in-out cursor-pointer">
							<RxCross2 className="h-full w-full text-black dark:text-gray-200"/>
						</div>
						<h1 className="md:text-2xl pb-[1.5px] text-xl text-black font-semibold dark:text-gray-100">Edit List</h1>
					</div>
					<button 
					onClick={updateList}
					className="bg-black dark:bg-white dark:text-black text-white font-semibold rounded-full px-5 py-2">
						Save
					</button>
				</div>
				<div className="relative w-full lg:h-[250px] md:h-[220px] sm:h-[200px] h-[190px] bg-blue-200/50">
				
					<img src={backgroundImage || 'https://th.bing.com/th/id/R.e33a470fc45adbdec1ea3ea7508893a2?rik=pqdkXe7Fm13ZYQ&riu=http%3a%2f%2fsocialmediainvestigation.com%2fwp-content%2fuploads%2f2015%2f07%2fiStock_000027835386Large.jpg&ehk=jFjZ4j6dWie5Tvxfna%2b1MA4%2b3qV2JH62SjdhP6VgR6A%3d&risl=&pid=ImgRaw&r=0'} 
					alt="" className="lg:h-[250px] md:h-[220px] sm:h-[200px] h-[190px] w-full"/>
					<div className="flex absolute justify-center top-0 left-0 bottom-0 right-0 items-center m-auto">
						<div className="flex items-center gap-1">
							<div 
							onClick={()=>document.getElementById('file4').click()}
							className="md:h-10 cursor-pointer h-8 w-8 md:w-10 md:p-[6px] p-1 rounded-full bg-black/40 hover:bg-black/30 top-0 left-0 right-0 bottom-0 m-auto">
								<HiOutlineCamera className="h-full w-full text-white"/>
							</div>
							<input type="file" accept="image/*" id="file4"
							value={path4} onChange={(e)=>{setPath4(e.target.value);url2Setter()}}
							hidden/>
							{
								backgroundImage &&
								<div 
								onClick={()=>setBackgroundImage('')}
								className="md:h-10 cursor-pointer h-8 w-8 md:w-10 md:p-[6px] p-1 rounded-full bg-black/40 hover:bg-red-600/30 top-0 left-0 right-0 bottom-0 m-auto">
									<RxCross2 className="h-full w-full text-white"/>
								</div>
							}
						</div>
					</div>
					
				</div>
				<div className="md:mt-[30px] mt-[30px] flex flex-col px-3 py-2 w-full gap-5 pb-7">
					<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg 
					focus-within:border-sky-400 border-gray-300/60 dark:border-gray-700/60">
						<h1 className="text-sm text-gray-500 dark:text-gray-400" id="name" >Name</h1>
						<input type="text" placeholder="Enter List Name" 
						onFocus={()=>document.getElementById('name').classList.add('text-sky-500')}
						onBlur={()=>document.getElementById('name').classList.remove('text-sky-500')}
						value={name}
						onChange={(e)=>setName(e.target.value)}
						className="w-full text-lg
						text-black placeholder:text-gray-500/70 dark:placeholder:text-gray-500 dark:text-gray-100 
						bg-transparent outline-none "/>
					</div>	

					<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg focus-within:border-sky-400  
					border-gray-300/60 dark:border-gray-700/60">
						<h1 className="text-sm text-gray-500 dark:text-gray-400" id="description" >Description</h1>
						<textarea type="text" placeholder="Enter description here" 
						onFocus={()=>document.getElementById('description').classList.add('text-sky-500')}
						onBlur={()=>document.getElementById('description').classList.remove('text-sky-500')}
						value={description}
						onChange={(e)=>setDescription(e.target.value)}
						className="w-full text-lg
						text-black bg-transparent placeholder:text-gray-500/70 dark:placeholder:text-gray-500 dark:text-gray-100
						outline-none resize-none h-[100px]"/>
					</div>	

					<div className="w-full h-[1px] bg-gray-200/80 dark:bg-gray-700/80"/>

					<div 
					onClick={()=>setRevealListMembers(true)}
					className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-200/20 hover:bg-gray-700/40 cursor-pointer rounded-xl transition-all duration-200 ease-in-out">
						<h1 className="text-lg text-black font-semibold dark:text-gray-100">Manage Members</h1>
						<AiOutlineRight className="text-black dark:text-gray-100 h-6 w-6"/>
					</div>

					


				</div>



			</div>
		</div>

	)
}