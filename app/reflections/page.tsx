import { listPublishedReflections } from "@/app/content/repository";
import { ReflectionLibrary } from "@/app/reflections/reflection-library";

export default async function ReflectionsPage() {
  const reflections = await listPublishedReflections();

  return (
    <main className="reflections-page">
      <section className="reflections-introduction page-container page-intro">
        <p className="eyebrow">The Library</p>
        <h1>Reflections</h1>
        <p>Thoughtful writings exploring Scripture, theology, philosophy, apologetics, and Christian living.</p>
      </section>

      <ReflectionLibrary reflections={reflections} />
    </main>
  );
}
