import { useState } from "react";
import { Link } from "react-router-dom";
import GenderCheckbox from "../components/Checkbox/GenderCheckBox";
import useSignup from "../hooks/useSignup";







const Signup = () => {

            const [inputs, setInputs] = useState({
                                    fullName:"",
                                    username:"",
                                    password:"",
                                    confirmPassword:"",
                                    gender:"",
                                   });
            const {loading, signup} = useSignup();
            const handleCheckboxChange = (gender: "male" | "female") => {
                setInputs({ ...inputs, gender });
            };
            const handleSubmitForm = (e: React.FormEvent) => {
                e.preventDefault();
                signup(inputs);
            };


  return (
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
        <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
            <h1 className='text-3xl font-semibold text-center text-gray-300'>
                 Sign Up <span className='text-red-500'>ChatApp</span>
            </h1>

            <form onSubmit={handleSubmitForm}>
                <div className="flex flex-col gap-2">
                <div>
                <label className='label p-2 text-white'>
							<span className='text-base label-text'>Full Name</span>
						</label>
						<input
							type='text'
							placeholder='Enter Your FullName'
							className='w-full input input-bordered  h-10'
							value={inputs.fullName}
							onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
						/>
                </div>
                <div>
                <label className='label p-2 text-white'>
							<span className='text-base label-text'>Username</span>
						</label>
						<input
							type='text'
							placeholder='@UserName'
							className='w-full input input-bordered h-10'
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
						/>
                </div>
                <div>
                <label className='label p-2 text-white'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Your Password'
							className='w-full input input-bordered h-10'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
						/>
                </div>
                <div>
                <label className='label p-2 text-white'>
							<span className='text-base label-text'>Confirm Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Confirm Password'
							className='w-full input input-bordered h-10'
							value={inputs.confirmPassword}
							onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
						/>
                </div>
                <div>
                <GenderCheckbox
                 selectedGender={inputs.gender} 
                 onCheckboxChange={handleCheckboxChange} 
                 />
                </div>
                </div>
                <Link to={"/login"}
                className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block text-white'
                >Already have an account?</Link>
                <div>
						<button className='btn btn-block btn-sm mt-2 border border-slate-700' disabled={loading}>
							{loading ? "Loading..." : "Sign Up"}
						</button>
					</div>
            </form>

        </div>
    </div>
  );
};


export default Signup;