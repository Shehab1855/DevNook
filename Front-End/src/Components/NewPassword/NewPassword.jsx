// import React, { useState, useEffect } from 'react';
// import  {useLocation}  from 'react-router-dom';
// import axios from 'axios';


// export default function NewPassword() {
//     //  let navigate = useNavigate();

//     const location = useLocation();
//     const [icn, setICN] = useState({
//         id: '',
//         changePasswordTokken: '',
//         newPassword: ''
//     });

//     useEffect(() => {
//         const searchParams = new URLSearchParams(location.search);
//         const id = searchParams.get('id');
//         const token = searchParams.get('token');
//         const newPassword = ;
//         if (id && token && newPassword) {
//             setICN({
//                 id: id,
//                 changePasswordTokken: token,
//                 newPassword: 
//             });
//         }
//     }, [location]);

//  async function sendNewPass() {
//     try {
//         await axios.put('https://localhost:7134/api/Auth/ResetPassword', icn);
//         window.location.href = '/login'; // Redirect manually
//     } catch (error) {
//         // Handle the error
//         // console.error('Error resetting password:', error);
//         // Display an error message to the user
//         // For example:
//         // alert('Failed to reset password. Please try again later.');
//     }
// }


//     return (
//         <div>
//             <div className='d-flex p-3'>
//                 <input onChange={(e)=> x = e.target.value} className='form-control mx-1 w-75' type="password" placeholder='Enter new password' />
//                 <button onClick={sendNewPass} className='btn btn-outline-info'>Submit</button>
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function NewPassword() {
    const location = useLocation();
    const [icn, setICN] = useState({
        id: '',
        changePasswordTokken: '',
        newPassword: ''
    });

    // Update the newPassword state when the input changes
    const handlePasswordChange = (e) => {
        setICN({ ...icn, newPassword: e.target.value });
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const id = searchParams.get('userId');
        const token = searchParams.get('token');
        if (id && token) {
            setICN({
                id: id,
                changePasswordTokken: token,
                newPassword: ''
            });
        }
    }, [location]);

    async function sendNewPass() {
        
            await axios.put('https://localhost:7134/api/Auth/ResetPassword', icn);
            window.location.href = '/login'; // Redirect manually
       
    }

    return (
        <div>
            <div className='d-flex p-3'>
                <input onChange={handlePasswordChange} className='form-control mx-1 w-75' type="password" placeholder='Enter new password'/>
                <button onClick={sendNewPass} className='btn btn-outline-info'>Submit</button>
            </div>
        </div>
    );
}
