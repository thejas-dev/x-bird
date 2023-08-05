import {useEffect,useState} from 'react'
import {RxCross2} from 'react-icons/rx';

let data = []

export default function CategorySelector({showCategorySelector,setShowCategorySelector,imageUploading,updateCategoriesFunction,
	setCategoryList,categoryList,currentUser}) {
	const [addThisItem,setAddThisItem] = useState('');

	useEffect(()=>{
		if(addThisItem || (addThisItem === 0)){
			addToList(addThisItem)
			setAddThisItem('')
		}
	},[addThisItem])

	useEffect(()=>{
		data = [
		{
			title:'News'
		},
		{
			title:'Sports'
		},
		{
			title:'Entertainment'
		},
		{
			title:'Movies'
		},
		{
			title:'Memes'
		},
		{
			title:'Technology'
		},{
			title:'Politics'
		},
		{
			title:'Gaming'
		},{
			title:'Food'
		},{
			title:'Health'
		},{
			title:'Travel'
		},{
			title:'Education'
		},{
			title:'Business and Finance'
		},{
			title:'Sarcasm'
		},{
			title:'Social'
		},{
			title:'Personal development'
		}
	]
	},[])


	const addToList = (j) => {
		if(categoryList.includes(data[j].title)){
			let idx = categoryList.findIndex(element=>{
				if(element === data[j].title){
					return true
				}
				return false
			})

			let catList = [...categoryList];
			catList.splice(idx,1);

			setCategoryList(catList)
		}else{
			let catList = [...categoryList];
			catList.push(data[j].title);

			setCategoryList(catList);
		}
	}

	const clearAllSelection = () => {
		setCategoryList([]);
		data.map((dat,j)=>{
			let ele = document.getElementById(`checkboxid-${j}`).checked
			document.getElementById(`checkboxid-${j}`).checked = false
		})
	}


	return (
		<div className={`fixed top-0 ${showCategorySelector ? 'left-0' : 'left-[100%]'} flex items-center justify-center
			h-full w-full z-50 bg-black/30 dark:backdrop-blur-md dark:bg-black/40 transition-all duration-200 ease-in-out`}>
				<div className="relative m-auto border-[1.1px] border-gray-200 dark:border-gray-600 lg:w-[50%] md:w-[70%] 
				sm:w-[80%] sm:max-h-[85%] overflow-hidden h-full w-full sm:rounded-3xl bg-white dark:bg-[#100C08] flex flex-col overflow-y-scroll 
				scrollbar-none scroll-smooth">
					<div className={`absolute z-50 flex items-center justify-center h-full w-full bg-white/60 dark:bg-[#100C08]/60 ${!imageUploading && 'hidden'} `}>
						<span className="loader3 h-14 w-14"/>
					</div>
					<div className="sticky z-40 bg-white/50 dark:bg-[#100C08]/50 backdrop-blur-lg flex items-center justify-between 
					top-0 px-3 py-2 w-full border-b-[1px] border-gray-300/50">
						<div className="flex items-center gap-4">
							<div 
							onClick={()=>{if(currentUser?.categories?.length > 3) setShowCategorySelector(false)}}
							className="h-8 w-8 p-1 rounded-full hover:bg-gray-300/40 dark:hover:bg-gray-800/40 transition-all 
							duration-200 ease-in-out cursor-pointer">
								<RxCross2 className={`h-full w-full ${currentUser?.categories?.length < 2 ? 'text-gray-500 dark:text-gray-800' : 'text-black dark:text-gray-100'}`}/>
							</div>
							<h1 className="md:text-2xl pb-[1.5px] text-xl text-black dark:text-gray-200 font-semibold">Select your favorites (Atleast 4)</h1>
						</div>
						<button 
						onClick={()=>{
							if(categoryList.length > 3){
								updateCategoriesFunction()
							}
						}}
						className={`bg-black dark:bg-white ${categoryList?.length > 3 ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'} text-white dark:text-black font-semibold rounded-full px-5 py-2`}>
							Save
						</button>
					</div>
					<div className="w-full h-full px-3 py-2">
						<h1 className="text-md text-gray-500 text-center">We recomment posts based on your interests</h1>
						<div className="grid xs:grid-cols-2 mt-3 grid-cols-1 w-full gap-4 px-2 py-2">
							{
								data.map((dat,j)=>{
									const checkBox = document.getElementById(`checkboxid-${j}`)
									if(checkBox){
										if(categoryList.includes(dat.title)){
											checkBox.checked = true
										}else{
											checkBox.checked = false										
										}										
									}
									return(
										<div 
										
										className="flex justify-between gap-2 items-center hover:bg-gray-200/50 dark:hover:bg-gray-600/50 transition-all duration-200 
										ease-in-out px-3 py-2 rounded-xl cursor-pointer" key={j}>
											<h1 className="text-md font-semibold text-black dark:text-gray-200 select-none">{dat.title}</h1>
											
											<label 
											onClick={()=>{
												setAddThisItem(j)
											}}
											className="switch2">
											  <input type="checkbox" id={`checkboxid-${j}`} class="input__check"/>
											  <span class="slider2"></span>
											</label>
										</div>

									)
								})
							}
						</div>
						<center>
							<button 
							onClick={clearAllSelection}
							className="text-lg text-red-500 text-center pb-7 mt-5 mx-auto">Clear all</button>
						</center>
					</div>


				</div>

		</div>

	)
}


