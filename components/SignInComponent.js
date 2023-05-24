

import {signIn} from 'next-auth/react'

export default function SignInComponent({id}) {
	// body...
	


	return (
		<div className="h-[100%] flex w-full items-center justify-center ">
			<div className="rounded-2xl flex flex-col border-[1px] border-gray-200/80 shadow-md px-4 py-3 pb-5">
				<h1 className="text-2xl font-bold text-black">New to X-Bird?</h1>
				<h1 className="text-md text-gray-500 mt-5 ">Login now to get your own personalized timeline!</h1>
				<div 
				onClick={()=>{signIn(id)}}
				className="flex justify-center mt-5 w-full py-3 rounded-full border-[1.7px] hover:bg-gray-200/50 cursor-pointer 
				duration-200 ease-in-out transition-all border-gray-300">
					<div className="gap-2 flex items-center">
						<img src="https://img.freepik.com/free-icon/google_318-258888.jpg" 
						alt="not found" className="h-5 w-5 "/>
						<h1 className="text-black text-gray-900 font-semibold">Login with google</h1>
					</div>
				</div>
			</div>
		</div>

	)
}