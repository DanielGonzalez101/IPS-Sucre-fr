import { getHeroSlides } from "@/actions/hero";
import { HeroSlideManager } from "@/components/admin/HeroSlideManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Hero — Admin" };

export default async function HeroAdminPage() {
  const { data: slides, error } = await getHeroSlides();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Hero principal</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edita la imagen y el texto que aparece en la portada del sitio.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
          Error al cargar los slides: {error}
        </div>
      )}

      {!error && (
        <HeroSlideManager slides={slides ?? []} />
      )}
    </div>
  );
}