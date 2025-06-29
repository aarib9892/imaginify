
import { Collection } from '@/components/shared/Collections'
import { navLinks } from '@/constants'
import { getAllImages } from '@/lib/actions/image.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Home =async  ({searchParams}:SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || ''
  console.log(searchQuery)
  const images = await getAllImages({page , searchQuery})
  return (
    <>
    <section className='home'>
      <h1 className='home-heading'>
        Unleash you creative vision with imaginify
      </h1>
      <ul className='flex-center w-full gap-20'>
        {
          navLinks.slice(1,5).map((link) => (
            <Link
            key={link.route}
            href={link.route}
            className='flex-center flex-col gap-2'
            >
              <li className='flex-center w-fit rounded-full bg-white p-4'>
                <Image src={link.icon} width={24} height={24} alt='route.label' />
              </li>
              <p className='text-white p-14-medium text-center'>{link.label}</p>
            
            </Link>

          ))
        }
        <li></li>
      </ul>

    </section>

    <section className='sm:mt-12'>
      <Collection 
      hasSearch={true}
      images={images?.data}
      totalPages={images?.totalPage}
      page={page}

      />
    </section>
     
     
    </>
  )
}

export default Home