'use client'

import { Select } from '@/components/FormElements/select';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

export default function SearchBlood(){
    const searchParams = useSearchParams();
    const id = searchParams.get('id');


    return (
        <div>
            <p className="title font-sans font-bold text-xl md:text-2xl">Searching for blood</p>
            <hr/>
            <form className='grid grid-cols-1 md:grid-cols-2 md:gap-6'>
                <Select
                    placeholder='Select'
                    items={[
                        {value:"A+", label:"a+"},
                        {value:"B+", label:"b+"}
                        ]}
                    label='Blood Group'
                    defaultValue='None'
                    disabled={id != undefined}
                    className='flex justify-between items-center'
                />
                <p className='flex justify-between items-center text-dark dark:text-white'>
                   <span> Unit</span>
                   <span className='font-bold'> FH HALL UNIT </span>
                </p>
            </form>
        </div>
    );
}