import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/dashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { getMyConnectionRequests } from '@/config/redux/action/authAction';

export default function MyConnectionsPage() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
    }, [])

    useEffect(() => {
        if(authState.connectionRequest.length !== 0){
            console.log("connectionRequest",authState.connectionRequest);
        }
    }, [authState.connectionRequest])



    return (
        <UserLayout>
            <DashboardLayout>
                <div>
                    MyConnectionsPage
                </div>
            </DashboardLayout>

        </UserLayout>
    )
}
