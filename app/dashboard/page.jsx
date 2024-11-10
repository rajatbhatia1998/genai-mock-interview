import AddNewInterview from './_components/AddNewInterview'
import RecentInterview from './_components/RecentInterview'
export default function Dashboard(){
    return (
        <div className="p-10">
            <h2 className="font-bold text-2xl">Dashboard</h2> 
            <h2 className="text-gray-500">Create and Start your AI Mockup Interview</h2>

            <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
                <AddNewInterview/>
            </div>
            <div className='flex flex-1'>
                <RecentInterview/>
            </div>
        </div>
    )
}