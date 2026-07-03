"use client";

// Placeholder para el editor de texto enriquecido.
// Integrar con Tiptap o Quill según requerimiento.
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white">
      <div className="flex gap-2 border-b border-gray-200 p-2 text-sm text-gray-500">
        <button type="button" className="px-2 py-1 hover:bg-gray-100 rounded font-bold">B</button>
        <button type="button" className="px-2 py-1 hover:bg-gray-100 rounded italic">I</button>
        <button type="button" className="px-2 py-1 hover:bg-gray-100 rounded underline">U</button>
      </div>
      <textarea
        className="w-full p-3 text-sm focus:outline-none resize-none min-h-[200px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Escribe aquí el contenido..."}
      />
    </div>
  );
}
