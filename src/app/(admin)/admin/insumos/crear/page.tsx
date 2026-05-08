import React from 'react'
import CreateIngredientForm from '../../../components/CreateIngredientForm'
import BackButton from '@/src/app/(main)/components/BackButton'

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