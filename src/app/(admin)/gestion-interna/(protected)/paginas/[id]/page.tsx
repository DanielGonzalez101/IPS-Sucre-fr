export default function AdminPaginaDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Editar Página</h1>
      <p className="mt-2 text-gray-600">ID: {params.id}</p>
    </div>
  );
}
