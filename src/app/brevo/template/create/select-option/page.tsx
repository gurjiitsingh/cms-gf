import TemplateOptions from "./components/TemplateOptions";


export default function SelectTemplateTypePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-orange-700 mb-6 text-center">
        Choose How You Want to Create Your Template
      </h1>
      <TemplateOptions />
    </div>
  );
}
