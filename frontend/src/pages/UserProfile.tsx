import axios from "@/lib/axios";
import { User } from "@/types/users"
import { useEffect, useState } from "react";


const UserProfile = () => {

  const [ userInfo, setUserInfo ] = useState<User>();
  const userIDPlaceholder = "65d69c469d47c04d60421fdb";

  const tempUser = {
    "name": "alex2",
    "password": "abc123",
    "email": "alex@gmail.com",
    "institution": "Queens University",
    "agreement": "i agree",
    "participating": [],
    "judging": [],
    "hosting": []
  }

  useEffect(()=>{
    // api should not return password. may want to return id?
    axios.get(`user/${userIDPlaceholder}`)
    .then(res => {
      console.log(res.data);
      const userRes : User = res.data;
      setUserInfo(userRes);
    })
    .catch(err => console.log(err))
      
  }, [setUserInfo])

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-5xl font-bold">Profile Page</h1>
      <p className="text-3xl">Here's your info: </p>
    </div>
  )
}

export default UserProfile
