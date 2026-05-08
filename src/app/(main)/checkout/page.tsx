import GuessForm from '@/src/app/(main)/components/GuessForm'
import React from 'react'

const page = () => {
  return (
    <section className="relative h-screen w-full">
        <div className="absolute top-1/3 -translate-y-1/3 left-1/2 -translate-x-1/2 flex flex-col gap-6 w-full px-4 z-20">
        <h4 className="text-2xl font-bold text-center">
          Completa con tus datos
        </h4>
        <GuessForm />
      </div>
    </section>
  )
}

export default page