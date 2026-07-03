export default function AdminPqrsDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Detalle PQRS</h1>
      <p className="mt-2 text-gray-600">ID: {params.id}</p>
    </div>
  );
}
