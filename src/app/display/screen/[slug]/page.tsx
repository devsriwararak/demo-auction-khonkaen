

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ slug: string }>
// }) {
//   const slug = (await params).slug
//   return <div>My Post: {slug}</div>
// }

import React from 'react'
import PageScreen from './PageScreen';

interface PageParams {
  slug: string;
}

interface PageProps {
  params: Promise<PageParams>;
}

const Page  = async({params} : PageProps) => {
  const { slug } = await params;
  return (
    <div>
      <PageScreen id={Number(slug)}/>
      </div>
  )
}

export default Page