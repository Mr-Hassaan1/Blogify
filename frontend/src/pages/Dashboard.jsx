import Sidebar from '@/components/Sidebar'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
    return (
        <div className=' flex bg-gray-300  dark:bg-gray-900'>
            <Sidebar />
            <div className='flex-1'>
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
