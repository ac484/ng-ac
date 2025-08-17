import { notFound } from 'next/navigation'

interface ContractPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ContractPage({ params }: ContractPageProps) {
  const { id } = await params

  // TODO: Fetch contract data based on ID
  // const contract = await getContract(id)

  // if (!contract) {
  //   notFound()
  // }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Contract Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Contract ID: {id}</p>
        <p className="text-gray-500 mt-2">Contract details will be displayed here.</p>
      </div>
    </div>
  )
}