'use client'

import { useEffect, useState } from "react";
import { Calendar, HomeIcon } from '../../components/Layouts/sidebar/icons';
import { SearchIcon } from "@/assets/icons";

function RequestCard(){
    return (
        <div className="card m-2 p-3 pt-6 flex flex-col gap-0.5 rounded-lg shadow-purple-400 shadow- bg-gradient-to-b from-blue-400 to-blue-700 text-black relative w-64">
            <p className="font-lg font-bold font-sans"> <HomeIcon className="inline-block"/> Burn Institute </p>
            <p> Operation. </p>
            <p> 4 bag ( 3 Managed )  </p>
            <p className="rounded-full bg-red-500 text-white absolute p-3 -right-3 -top-3">A+</p>

            <form action='/search-blood/?id=1238' method="post" className="mt-4 flex justify-center items-center">
                <label className="flex gap-0.5 justify-center items-center px-2 py-0.5 font-semibold rounded-full bg-gradient-to-bl from-slate-500 to-slate-400 shadow-1 shadow-fuchsia-200">
                    <SearchIcon className="font-bold"/>
                    <input type="submit" className="btn btn-bg-primary p-2" value="Start Search"/>
                </label>
            </form>
        </div>
    );
}

export default function BloodRequest(){
    const [requests, setRequests] = useState<Array<Number>>();

    useEffect(()=>{
        setRequests([1,1,1,1,1,1,1,1,11,1,1,1,1,1,1,1,1])
    }, []);

    return (
        <div className="flex justify-center items-start">
            <div className="grid md:grid-cols-3 grid-cols-1 justify-center mx-auto gap-2">
                { requests?.map( ( req, ind ) => {
                    return <RequestCard key={ind.toString()} />
                }) }
            </div>
        </div>
    );
}