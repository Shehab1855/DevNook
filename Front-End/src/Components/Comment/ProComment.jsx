import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Comment.css';

function ProComment({proId, getPro}) {
    const token =  localStorage.getItem('userToken');
    console.log(token);

    const [warehouseData, setWarehouseData] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0,
    });
    const getComments = async (proId) => {
        setWarehouseData({ ...warehouseData, loading: true });
        axios
            .get(`https://localhost:7134/api/Project/Getcomment/id:int ?id=${proId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the request headers
                },
            })
            .then((resp) => {
                setWarehouseData({
                    ...warehouseData,
                    results: resp.data,
                    loading: false,
                    err: null,
                });
              
            })
           
            .catch((err) => {
                setWarehouseData({
                    ...warehouseData,
                    loading: false,
                    err: err.response.data.err,
                });
            });

    };
    const handleDeleteComment = async (proId) => {
        try {
          await axios.delete(
            `https://localhost:7134/api/Project/comment/id:int ?projectid=${proId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Reload posts after comment deletion
          getPro(proId);
          getComments(proId);
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      };
    useEffect(() => {
        getComments(proId);
        console.log(warehouseData.results);
    }, []);

    const myObject = warehouseData.results;
    //   const myArray = Object.entries(myObject);

    return (
        <>
            <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous" />
            <div class="container">
                <div class="row">

                    {warehouseData.results.map((pro) => (
                        <div class="col-md-8">
                            <div class="media g-mb-30 media-comment">
                                <img class="d-flex g-width-50 g-height-50 rounded-circle g-mt-3 g-mr-15" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Image Description" />
                                <div class="media-body u-shadow-v18 g-bg-secondary g-pa-30">
                               
                                    <div class="g-mb-15">
                                        <h5 class="h5 g-color-gray-dark-v1 mb-0">{pro.username}</h5>
                                        <div class="dropdown">
                                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Dropdown button
                                        </button>
                                        <ul class="dropdown-menu">
                                        <li> <a className="dropdown-item" href="#" onClick={() => handleDeleteComment(pro.id)}>Delete</a></li>
                                        {/* <li><a className="dropdown-item" href="#"  onClick={() => handleEditPost(post.id)}>edit</a></li> */}

                                        </ul>
                                    </div>
                                        <span class="g-color-gray-dark-v4 g-font-size-12">{pro.eventDate}</span>
                                    </div>

                                    <p>{pro.taxt}</p>
                                </div>
                            </div>
                        </div>))
                    }
                </div>
            </div>
        </>
    )

}
export default ProComment;