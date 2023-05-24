import {RiSearchLine} from 'react-icons/ri';
import {AiOutlineSetting} from 'react-icons/ai'
import {useState,useEffect} from 'react'


export default function Explore() {
	
	const [headings,setHeadings]  = useState([])
	const [currentHeading,setCurrentHeading] = useState('For you')


	useEffect(()=>{
		const data = [
		{
			title:'For you'
		},
		{
			title:'Trending'
		},
		{
			title:'News'
		},
		{
			title:'Sports'
		},
		{
			title:'Entertainment'
		}
		]
		setHeadings(data)
	},[])

	return (
		<div className="lg:w-[44.6%] md:w-[70%] xs:w-[90%] w-[100%] flex flex-col h-full border-r-[1.3px] border-gray-200">
			<div className="flex items-center w-full px-5 gap-7 mt-2">
				<div className="rounded-full overflow-hidden bg-gray-200/80 w-full flex items-center p-[10px] px-4 gap-3">
					<RiSearchLine className="h-5 w-5 text-gray-500"/>
					<input type="text" className="w-full placeholder:font-normal placeholder:text-gray-400 outline-none 
					bg-transparent font-semibold text-gray-800" placeholder="Search Twitter"/>
				</div>
				<div className="p-2 hover:bg-gray-300 rounded-full cursor-pointer transition-all duration-200 ease-in-out">
					<AiOutlineSetting className="h-5 w-5 text-black"/>
				</div>	
			</div>
			<div className="mt-[6px] border-b-[1px] border-gray-200/80 flex items-center w-full">
				{
					headings.map((head,i)=>(
						<div key={i}
						onClick={()=>setCurrentHeading(head.title)}
						className={`relative whitespace-nowrap w-[100%] px-7 flex items-center justify-center 
						${currentHeading === head.title ? 'text-black':'text-gray-500'} py-3 hover:bg-gray-200/70 
						transition-bg duration-200 font-semibold cursor-pointer ease-in-out `}>
							{head.title}
							<div className={`absolute bottom-0 w-[50%] rounded-full h-[4px] ${currentHeading === head.title ? 'bg-sky-500':'bg-transparent'}`}/>
						</div>

					))
				}
			</div>
		</div>

	)
}