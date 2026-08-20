import React from 'react'
import BackButton from '@/src/app/(main)/components/BackButton'
import CreateIngredientForm from '@/src/app/(admin)/components/forms/CreateIngredientForm'

const page = () => {
  return (
    <div className='px-4'>
        <div className='flex items-center gap-2 mb-6'>
            <BackButton />
            <h3 className='text-xl font-bold'>Crear ingrediente</h3>
        </div>
        <CreateIngredientForm />
    </div>
  )
}

export default page