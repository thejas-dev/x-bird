import {HiOutlineCamera} from 'react-icons/hi';
import {useEffect,useState} from 'react';	
import {signIn} from 'next-auth/react'

export default function SignInComponent({loading,id,name,setName,setUsername,currentWindow,setCurrentWindow,
	username,email,image,url1Setter,finalLoading,setFinalLoading,createAccount,ngaGmail,setNgaGmail,
	ngaPassword,setNgaPassword,ngaConfirmPassword,setNgaConfirmPassword,registerAccountNGA,
	loginAccountNGA,setIncorrectPass,incorrectPass,setPasswordNotMatch,passwordNotMatch,setAccountAlreadyExist,
	accountAlreadyExist,imageSet}) {
	
	const [path3,setPath3] = useState('');
	const [showSignUp,setShowSingUp] = useState(false);



	return (
		<div className="h-[100%] bg-[#e6f2ff] p-2 relative flex w-full items-center justify-center ">
			<div className={` flex justify-center left-0 top-0 z-50 items-center bg-black/70 backdrop-blur-md transition-all duration-300 ease-in-out ${finalLoading ? 'absolute' : 'hidden'} h-full w-full`}>
				<span className="loader4 flex items-center justify-center">
					<img src="https://ik.imagekit.io/d3kzbpbila/thejashari_QSzOWJHFV?updatedAt=1690659361414" alt="" className="h-[50px] w-[50px] -rotate-[40deg]"/>
				</span> 
			</div>
			{
				currentWindow === 'google' ?
				
				<div class="form-container shadow-xl shadow-purple-500/40 hover:shadow-purple-500
				transition-all duration-300 ease-in-out relative overflow-hidden">
					<div className={`bg-black/60 ${loading ? 'absolute' : 'hidden' }  absolute top-0 left-0 h-full w-full flex items-center justify-center`}>
						<span className="loader6"/>
					</div>
					<p class="title">{
						showSignUp ? 
						'Create account'
						:
						'Login'
					}</p>
					<form class="form" onSubmit={(e)=>{
						e.preventDefault();
						if(showSignUp){
							registerAccountNGA()
						}else{
							loginAccountNGA()
						}	
					}}>
						<div class="input-group">
							<label for="username">Gmail</label>
							<input type="text" name="Gmail" id="username" placeholder=""
							value={ngaGmail} onChange={(e)=>{
								let char = e.target.value[e.target.value.length - 1]
								if(char !== ' ' && char !== '#'){
									setNgaGmail(e.target.value)
								}
							}}
							/>
						</div>
						<div class="input-group">
							<label for="password">Password</label>
							<input type="password" name="password" id="password" placeholder=""
							value={ngaPassword} onChange={(e)=>{setNgaPassword(e.target.value)}}
							/>
							{
								incorrectPass && !passwordNotMatch &&
								<h1 className="text-red-500 text-md mt-1">Gmail ID or password is incorrect</h1>
							}
						</div>
						{
							showSignUp &&
							<div class="input-group">
								<label for="password">Confirm password</label>
								<input type="password" name="password" id="password" placeholder=""
								value={ngaConfirmPassword} onChange={(e)=>{setNgaConfirmPassword(e.target.value)}}
								/>
								{
									passwordNotMatch &&
									<h1 className="text-red-500 text-md mt-1 animate-pulse">Password is not matching</h1>
								}
								{
									accountAlreadyExist &&
									<h1 className="text-red-500 text-md mt-1">Account already exist</h1>	
								}
							</div>							
						}
						<button 
						onClick={()=>{
							if(ngaGmail.length > 3 && ngaPassword.length > 3){
								if(showSignUp){
									registerAccountNGA()
								}else{
									loginAccountNGA()
								}								
							}
						}}
						class={`sign mt-3 ${(ngaGmail.length > 3 && ngaPassword.length > 3) ? 'opacity-100' : 'opacity-50'} `}>{
							showSignUp ? 
							'Sign up'
							:
							'Sign in'
						}</button>
					</form>
					<div class="social-message">
						<div class="line"></div>
						<p class="message">Login with social accounts</p>
						<div class="line"></div>
					</div>
					<div class="social-icons">
							<div 
							onClick={()=>{signIn(id)}}
							className="flex justify-center mt-5 w-full py-3 text-white rounded-full border-[1.7px] hover:bg-gray-700/50 cursor-pointer 
							duration-200 ease-in-out transition-all border-gray-300">
								<div className="gap-2 flex items-center px-2">
									<img src="https://img.freepik.com/free-icon/google_318-258888.jpg" 
									alt="not found" className="h-5 w-5 "/>
									<h1 className="text-white text-gray-900 font-semibold">Login with google</h1>
								</div>
							</div>
					</div>
					<p className="signup mt-5">{
						showSignUp ? 
						'Already have an account?'
						:
						"Don't have an account?"
						} 
						<span 
						onClick={()=>{
							setIncorrectPass(false)
							setShowSingUp(!showSignUp)
						}}
						rel="noopener noreferrer" href="#" className="text-center text-[0.9rem] cursor-pointer
						text-gray-100 hover:underline">{
						showSignUp ? 
						' Sign in'
						:
						' Sign up'
						}</span>
					</p>
				</div>



				:
				currentWindow === 'accountset' ? 
				<div className='lg:w-[35%] md:w-[50%] w-[90%] lg:h-[60%] md:h-[60%] h-[60%] border-[1px] bg-[#100C08] border-gray-200/80 shadow-md py-3 pb-5 flex flex-col rounded-2xl'>
					<h1 className="md:text-2xl text-xl font-bold text-gray-100 px-4">Set up your account</h1>
					<div className="h-[1px] w-full bg-gray-700/50 my-3"/>
					<div className="h-full w-full flex-col flex justify-center">
						<div className="w-full px-4 py-3">
							<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg focus-within:border-sky-400  border-gray-300/60">
								<h1 className="text-sm text-gray-400" id="name" >Name</h1>
								<input type="text" placeholder="Enter your name" 
								onFocus={()=>document.getElementById('name').classList.add('text-sky-500')}
								onBlur={()=>document.getElementById('name').classList.remove('text-sky-500')}
								value={name}
								onChange={(e)=>setName(e.target.value)}
								className="w-full text-lg
								text-gray-100 placeholder:text-gray-500/70  bg-transparent outline-none "/>
							</div>
						</div>
						<div className="w-full px-4 py-3">
							<div className="w-full flex flex-col border-[1.5px] px-2 py-1 rounded-lg focus-within:border-sky-400  border-gray-300/60">
								<h1 className="text-sm text-gray-500" id="Username" >@Username</h1>
								<input type="text" placeholder="Enter your Username" 
								onFocus={()=>document.getElementById('Username').classList.add('text-sky-500')}
								onBlur={()=>document.getElementById('Username').classList.remove('text-sky-500')}
								value={username}
								onChange={(e)=>{
									let char = e.target.value[e.target.value.length - 1]
									if(char !== ' ' && char !== '@' && char !== '#'){
										setUsername(e.target.value)
									}
								}}
								className="w-full text-lg
								text-gray-100 placeholder:text-gray-500/70 bg-transparent outline-none "/>
							</div>
						</div>
						<div className="w-full flex items-center mt-2 justify-center">
							<button 
							onClick={()=>setCurrentWindow('imageset')}
							className="rounded-full py-2 text-lg hover:bg-sky-600 transition-all duration-200 ease px-10 bg-sky-500 text-white font-semibold">
								Continue
							</button>
						</div>
					</div>

				</div>
				:
				<div className='lg:w-[35%] md:w-[50%] w-[90%] lg:h-[60%] md:h-[60%] h-[60%] border-[1px] 
				bg-[#100C08] border-gray-800/80 shadow-md py-3 pb-5 relative flex flex-col rounded-2xl z-10'>
					
					<h1 className="md:text-2xl text-xl font-bold text-gray-100 px-4">Set profile picture</h1>
					<div className="h-[1px] w-full bg-gray-700/50 my-3"/>
					<div className="w-full flex items-center overflow-hidden justify-center h-full">
						<div className="relative overflow-hidden md:h-[200px] h-[150px] w-[150px] md:w-[200px] rounded-full border-[2px] border-dashed border-sky-600">
							<img src={image} alt="" className="rounded-full h-full w-full"/>
							<div className="absolute inset-0 m-auto z-40 h-[99.5%] w-[99.5%] bg-black/10 transition-all duration-200 ease-in-out hover:bg-black/30"/>
							<div 
							onClick={()=>document.getElementById('file3').click()}
							className="absolute peer z-50 md:h-10 h-8 w-8 md:w-10 md:p-[6px] p-1 rounded-full bg-black/40 hover:bg-black/30 top-0 left-0 right-0 bottom-0 m-auto">
								<HiOutlineCamera className="h-full w-full text-white"/>
							</div>
							<input type="file" accept="image/*" id="file3"
							value={path3} onChange={(e)=>{setPath3(e.target.value);url1Setter()}}
							hidden/>
						</div>
					</div>
					<div className="w-full absolute -bottom-5 flex items-center mt-2 justify-center">
						<button 
						onClick={()=>{if(imageSet){createAccount()}}}
						className={`rounded-full py-2 text-lg transition-all duration-200 ease px-10
						${imageSet ? 'bg-sky-500 hover:bg-sky-600' : 'bg-sky-800/80'}  text-white font-semibold`}>
							Create
						</button>
					</div>

				</div>

			}
		</div>

	)
}


// <div className="relative overflow-hidden rounded-2xl flex flex-col border-[1px] bg-white border-gray-200/80 shadow-md px-4 py-3 pb-5">
	
// 	<h1 className="text-2xl font-bold text-black">New to TNS-Bird?</h1>
// 	<h1 className="text-md text-gray-500 mt-5 ">Login now to get your own personalized timeline!</h1>
// 	<div 
// 	onClick={()=>{signIn(id)}}
// 	className="flex justify-center mt-5 w-full py-3 rounded-full border-[1.7px] hover:bg-gray-200/50 cursor-pointer 
// 	duration-200 ease-in-out transition-all border-gray-300">
// 		<div className="gap-2 flex items-center">
// 			<img src="https://img.freepik.com/free-icon/google_318-258888.jpg" 
// 			alt="not found" className="h-5 w-5 "/>
// 			<h1 className="text-black text-gray-900 font-semibold">Login with google</h1>
// 		</div>
// 	</div>
// </div>