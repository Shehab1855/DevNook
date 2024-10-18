import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Interactions({ userT, userData }) {
  const [notification, setNotification] = useState([]);
  

  async function getNotification() {
    try {
      const response = await axios.get(
        'https://localhost:7134/api/profile/notifications',
        {
          headers: {
            Authorization: `Bearer ${userT}`,
          },
        }
      );
      console.log(response.data);
      setNotification(response.data)

    } catch (error) {
      // Handle 401 Unauthorized error
      if (error.response && error.response.status === 401) {
      //   setError('Unauthorized: Please check your credentials.');
      } else {
        // Handle other errors
        // setError('An error occurred while fetching notifications.');
      }
    }
  }

  useEffect(() => {
    getNotification();
  }, []);

  return <>
     {notification.reverse().map((notification ,index)=>(
      <div key={index}>
        <div className='d-flex w-75 my-1'>

          <div className=' my-2 w-75 border-bottom border-1 d-flex'>
            <p><Link to={`/AnotherProfile/${notification.userid}`}>{'< '}{notification.username}{' />'}</Link></p>
            <p className='ms-1 text-light-emphasis'>
            {notification.eventType === 'Comment' ? 'commented on this' :
              notification.eventType === 'comment' ? 'commented on this' :
              notification.eventType === 'like' ? 'liked this' :
              notification.eventType === 'answer' ? 'answered this' :
              notification.eventType === 'Bookmark' ? 'Bookmarked this' :
              notification.eventType === 'DisLike' ? 'disliked this' :
              ''}
            </p>
            <p className='ms-1 text-light-emphasis'>
              {/* {notification.notificationdType} */}
              {
                notification.notificationdType === 'project'?
                <Link to={`/projectdetails/${notification.notificationsrelatedID}`}>{notification.notificationdType}</Link>:
                notification.notificationdType === 'Question'?
                <Link to={`/questiondetails/${notification.notificationsrelatedID}`}>{notification.notificationdType}</Link>:
                notification.notificationdType === 'post'?
                <Link to={`/postdetails/${notification.notificationsrelatedID}`}>{notification.notificationdType}</Link>:
                notification.notificationdType === 'answer'?
                <Link to={`/questiondetails/${notification.notificationsrelatedID}`}>{notification.notificationdType}</Link>:
                ''
              }
            </p>
            {/* <p className='ms-1 text-light-emphasis'>at</p> */}
          </div>
          <div>
            <p className='ms-4 text-black-50 mt-1 pt-1'>{notification.notificationdate}</p>
          </div>
        </div>
      </div>
     ))}
  </>
  
}
